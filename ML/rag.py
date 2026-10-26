"""RAG layer: a knowledge base (course material) and per-student chat memory,
both stored as embeddings in ChromaDB."""
import uuid

import chromadb
from chromadb.utils import embedding_functions

from config import (CHROMA_PATH, CHUNK_OVERLAP, CHUNK_WORDS, EMBED_MODEL,
                    TOP_K_DOCS, TOP_K_MEMORY)

_client = chromadb.PersistentClient(path=CHROMA_PATH)
_embed = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=EMBED_MODEL)

knowledge = _client.get_or_create_collection("knowledge", embedding_function=_embed)
memory = _client.get_or_create_collection("chat_memory", embedding_function=_embed)


def chunk_text(text: str, size: int = CHUNK_WORDS, overlap: int = CHUNK_OVERLAP):
    words = text.split()
    if not words:
        return []
    step = max(size - overlap, 1)
    return [" ".join(words[i:i + size]) for i in range(0, len(words), step)]


def ingest_document(text: str, source: str, topic: str = "") -> int:
    """Split a document into chunks and add them to the knowledge base."""
    chunks = chunk_text(text)
    if not chunks:
        return 0
    knowledge.add(
        ids=[f"{source}-{uuid.uuid4().hex[:8]}-{i}" for i in range(len(chunks))],
        documents=chunks,
        metadatas=[{"source": source, "topic": topic, "chunk": i} for i in range(len(chunks))],
    )
    return len(chunks)


def retrieve(query: str, k: int = TOP_K_DOCS, topic: str | None = None):
    """Return the most relevant knowledge chunks for a query."""
    if knowledge.count() == 0:
        return []
    kwargs = {"query_texts": [query], "n_results": min(k, knowledge.count())}
    if topic:
        kwargs["where"] = {"topic": topic}
    res = knowledge.query(**kwargs)
    docs, metas = res["documents"][0], res["metadatas"][0]
    return [{"text": d, "source": m.get("source", "")} for d, m in zip(docs, metas)]


def remember(student_id: str, role: str, text: str):
    """Embed a chat message so it can be recalled later by meaning."""
    memory.add(
        ids=[uuid.uuid4().hex],
        documents=[text],
        metadatas=[{"student_id": student_id, "role": role}],
    )


def recall(student_id: str, query: str, k: int = TOP_K_MEMORY):
    """Past messages from this student that are relevant to the query."""
    res = memory.query(query_texts=[query], n_results=k,
                       where={"student_id": student_id})
    docs = res["documents"][0] if res["documents"] else []
    metas = res["metadatas"][0] if res["metadatas"] else []
    return [f'{m["role"]}: {d}' for d, m in zip(docs, metas)]


def format_context(chunks):
    return "\n\n".join(f"[{i+1}] ({c['source']}) {c['text']}" for i, c in enumerate(chunks))
