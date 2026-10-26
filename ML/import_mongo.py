"""Copy the chats already saved in MongoDB (tutor_responses) into the ML memory,
so the tutor can use them from day one.

Run ONCE from the ML folder:   python import_mongo.py            (student id "default")
                               python import_mongo.py student123
"""
import os
import sys

from pymongo import MongoClient

import config  # noqa: F401  (loads backend/.env)
import db
import rag

student_id = sys.argv[1] if len(sys.argv) > 1 else "default"

uri = os.getenv("MONGODB_URI")
if not uri:
    sys.exit("MONGODB_URI not found in backend/.env")

db.init_db()
collection = MongoClient(uri)[os.getenv("MONGODB_DATABASE", "edumind")]["tutor_responses"]

count = 0
for doc in collection.find({}, {"prompt": 1, "response": 1}).sort("createdAt", 1):
    prompt, response = doc.get("prompt"), doc.get("response")
    if not prompt or not response:
        continue
    db.add_chat(student_id, "user", prompt)
    db.add_chat(student_id, "assistant", response)
    rag.remember(student_id, "user", prompt)
    rag.remember(student_id, "assistant", response)
    count += 1

print(f"Imported {count} exchanges for student '{student_id}'.")
