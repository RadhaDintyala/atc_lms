"""
MongoDB Database Seeding Script for ApexLMS
Seeds all collections: users, student_profiles, curriculum_tracks, curriculum_years,
categories, topics, placeholder resources, sample students, and project submissions.
Usage: python -m app.db.seed_mongo
"""

import sys
import os
from datetime import datetime, timedelta
from pymongo import MongoClient
from app.core.config import settings
from app.core.security import get_password_hash

def seed_mongo():
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    client = MongoClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]

    # Check if already seeded
    if db.users.find_one({"email": "mentor.admin@apex.edu"}):
        print("MongoDB database already contains seed data. Skipping.")
        return

    print("Creating collections and indexes...")
    # Unique indexes
    db.users.create_index("email", unique=True)
    db.student_profiles.create_index("roll_number", unique=True)
    db.student_profiles.create_index("user_id", unique=True)
    db.topics.create_index("slug", unique=True)
    db.student_topic_progress.create_index([("student_id", 1), ("topic_id", 1)], unique=True)
    db.student_resource_progress.create_index([("student_id", 1), ("resource_id", 1)], unique=True)

    # 1. Curriculum Tracks
    print("Seeding Tracks...")
    tracks = [
        {
            "_id": "common",
            "name": "Common Foundation",
            "code": "CF",
            "description": "Core programming, web fundamentals, Git, prompt engineering, and project workflows.",
        },
        {
            "_id": "fullstack",
            "name": "Full-Stack & Application Development",
            "code": "FSAD",
            "description": "Backend frameworks, React, databases, Docker, CI/CD, and distributed microservices.",
        },
        {
            "_id": "ai",
            "name": "AI Engineering",
            "code": "AIE",
            "description": "Python for AI, Vector DBs, RAG systems, Autonomous Agents, LLM evaluation, and cloud deployment.",
        },
    ]
    for t in tracks:
        db.curriculum_tracks.replace_one({"_id": t["_id"]}, t, upsert=True)

    # 2. Years
    years = [
        {"_id": "year_1", "name": "1st Year: Common Foundation", "year_number": 1, "description": "Common core"},
        {"_id": "year_2", "name": "2nd Year: Core Specialization", "year_number": 2, "description": "Full-stack or AI track"},
        {"_id": "year_3", "name": "3rd Year: Advanced Capstone", "year_number": 3, "description": "Production systems"},
    ]
    for y in years:
        db.curriculum_years.replace_one({"_id": y["_id"]}, y, upsert=True)

    # 3. Users and Profiles
    print("Seeding Users and Profiles...")
    admin_user = {
        "_id": "usr-admin-1",
        "email": "mentor.admin@apex.edu",
        "password_hash": get_password_hash("Password@123"),
        "role": "admin",
        "full_name": "Dr. Sarah Chen (Chief Mentor)",
        "status": "active",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    db.users.replace_one({"_id": admin_user["_id"]}, admin_user, upsert=True)

    sample_students = [
        {
            "user_id": "usr-student-1",
            "prof_id": "prof-student-1",
            "name": "Alex Rivers",
            "email": "alex.rivers@apex.edu",
            "roll": "ENG2026-0142",
            "dept": "Computer Science & Engineering",
            "year": "year_1",
            "track": "common",
            "github": "https://github.com/alexrivers-dev",
            "days_ago": 1,
        },
        {
            "user_id": "usr-student-2",
            "prof_id": "prof-student-2",
            "name": "Priya Patel",
            "email": "priya.patel@apex.edu",
            "roll": "ENG2025-0089",
            "dept": "Information Technology",
            "year": "year_2",
            "track": "fullstack",
            "github": "https://github.com/priyapatel-code",
            "days_ago": 0,
        },
        {
            "user_id": "usr-student-3",
            "prof_id": "prof-student-3",
            "name": "Marcus Vance",
            "email": "marcus.vance@apex.edu",
            "roll": "ENG2025-0215",
            "dept": "AI & Data Science",
            "year": "year_2",
            "track": "ai",
            "github": "https://github.com/marcusvance-ai",
            "days_ago": 1,
        },
        {
            "user_id": "usr-student-4",
            "prof_id": "prof-student-4",
            "name": "Elena Rostova",
            "email": "elena.rostova@apex.edu",
            "roll": "ENG2024-0033",
            "dept": "Software Engineering",
            "year": "year_3",
            "track": "fullstack",
            "github": "https://github.com/elenarostova-eng",
            "days_ago": 2,
        },
        {
            "user_id": "usr-student-5",
            "prof_id": "prof-student-5",
            "name": "Devon Lane",
            "email": "devon.lane@apex.edu",
            "roll": "ENG2025-0371",
            "dept": "Computer Engineering",
            "year": "year_2",
            "track": "fullstack",
            "github": "https://github.com/devonlane",
            "days_ago": 25, # Inactive flag
        },
    ]

    for s in sample_students:
        u_doc = {
            "_id": s["user_id"],
            "email": s["email"],
            "password_hash": get_password_hash("Password@123"),
            "role": "student",
            "full_name": s["name"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow(),
        }
        db.users.replace_one({"_id": u_doc["_id"]}, u_doc, upsert=True)

        p_doc = {
            "_id": s["prof_id"],
            "user_id": s["user_id"],
            "roll_number": s["roll"],
            "college": "Apex Institute of Technology",
            "department": s["dept"],
            "current_year": s["year"],
            "track_id": s["track"],
            "github_url": s["github"],
            "last_active_at": datetime.utcnow() - timedelta(days=s["days_ago"]),
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow(),
        }
        db.student_profiles.replace_one({"_id": p_doc["_id"]}, p_doc, upsert=True)

    print("MongoDB Database seed completed successfully!")

if __name__ == "__main__":
    seed_mongo()
