"""SQLite storage: chats, courses, quizzes and quiz results."""
import json
import sqlite3
from contextlib import contextmanager

from config import SQLITE_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chats_student ON chats(student_id, id);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    data TEXT NOT NULL,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    data TEXT NOT NULL,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    quiz_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    weak_concepts TEXT NOT NULL,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""


@contextmanager
def conn():
    c = sqlite3.connect(SQLITE_PATH)
    c.row_factory = sqlite3.Row
    try:
        yield c
        c.commit()
    finally:
        c.close()


def init_db():
    with conn() as c:
        c.executescript(SCHEMA)


# ---- chats ----
def add_chat(student_id: str, role: str, content: str):
    with conn() as c:
        c.execute("INSERT INTO chats(student_id, role, content) VALUES (?,?,?)",
                  (student_id, role, content))


def recent_chats(student_id: str, limit: int = 10):
    with conn() as c:
        rows = c.execute(
            "SELECT role, content FROM chats WHERE student_id=? ORDER BY id DESC LIMIT ?",
            (student_id, limit)).fetchall()
    return [dict(r) for r in reversed(rows)]


def all_student_questions(student_id: str, limit: int = 50):
    with conn() as c:
        rows = c.execute(
            "SELECT content FROM chats WHERE student_id=? AND role='user' ORDER BY id DESC LIMIT ?",
            (student_id, limit)).fetchall()
    return [r["content"] for r in rows]


# ---- courses / quizzes (stored as JSON blobs) ----
def save_json(table: str, student_id: str, topic: str, data: dict) -> int:
    with conn() as c:
        cur = c.execute(f"INSERT INTO {table}(student_id, topic, data) VALUES (?,?,?)",
                        (student_id, topic, json.dumps(data)))
        return cur.lastrowid


def update_json(table: str, row_id: int, data: dict):
    with conn() as c:
        c.execute(f"UPDATE {table} SET data=? WHERE id=?", (json.dumps(data), row_id))


def load_json(table: str, row_id: int):
    with conn() as c:
        r = c.execute(f"SELECT * FROM {table} WHERE id=?", (row_id,)).fetchone()
    if not r:
        return None
    return {"id": r["id"], "student_id": r["student_id"], "topic": r["topic"],
            "data": json.loads(r["data"])}


def list_quizzes(student_id: str, limit: int = 50):
    with conn() as c:
        rows = c.execute(
            "SELECT id, topic, data, ts FROM quizzes "
            "WHERE student_id=? ORDER BY id DESC LIMIT ?",
            (student_id, limit)).fetchall()
    return [
        {
            "id": r["id"],
            "topic": r["topic"],
            "question_count": len(json.loads(r["data"]).get("questions", [])),
            "created_at": r["ts"],
        }
        for r in rows
    ]


def list_courses(student_id: str, limit: int = 50):
    with conn() as c:
        rows = c.execute(
            "SELECT id, topic, data, ts FROM courses "
            "WHERE student_id=? ORDER BY id DESC LIMIT ?",
            (student_id, limit)).fetchall()
    courses = []
    for row in rows:
        data = json.loads(row["data"])
        total_lessons = sum(
            len(module.get("lessons", []))
            for module in data.get("modules", [])
        )
        completed = len(data.get("completed_lessons", []))
        courses.append({
            "id": row["id"],
            "topic": row["topic"],
            "title": data.get("title", row["topic"]),
            "module_count": len(data.get("modules", [])),
            "lesson_count": total_lessons,
            "completed_lessons": completed,
            "created_at": row["ts"],
        })
    return courses


# ---- quiz results ----
def add_result(student_id, quiz_id, topic, score, total, weak_concepts):
    with conn() as c:
        c.execute(
            "INSERT INTO quiz_results(student_id, quiz_id, topic, score, total, weak_concepts) "
            "VALUES (?,?,?,?,?,?)",
            (student_id, quiz_id, topic, score, total, json.dumps(weak_concepts)))


def results_for(student_id: str, limit: int = 20):
    with conn() as c:
        rows = c.execute(
            "SELECT topic, score, total, weak_concepts, ts FROM quiz_results "
            "WHERE student_id=? ORDER BY id DESC LIMIT ?", (student_id, limit)).fetchall()
    return [{"topic": r["topic"], "score": r["score"], "total": r["total"],
             "weak_concepts": json.loads(r["weak_concepts"]), "ts": r["ts"]} for r in rows]
