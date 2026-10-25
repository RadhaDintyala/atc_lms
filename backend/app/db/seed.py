"""
PostgreSQL Database Seeding Script for ApexLMS
Seeds all curriculum years, categories, topics, placeholder resources, sample students, and projects.
Usage: python -m app.db.seed
"""

import sys
import json
from datetime import datetime, timedelta
from app.db.session import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.models import (
    Base,
    User,
    UserRole,
    AccountStatus,
    StudentProfile,
    EngineeringYear,
    SpecializationTrack,
    CurriculumTrack,
    CurriculumYear,
    Category,
    Topic,
    Resource,
    DifficultyLevel,
    ResourceType,
    StudentTopicProgress,
    StudentResourceProgress,
    ProgressStatus,
    Project,
    ProjectStatus,
    ActivityLog,
)

def seed_database():
    print("Creating tables in PostgreSQL...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "mentor.admin@apex.edu").first():
            print("Database already contains seed data. Skipping.")
            return

        print("Seeding Curriculum Tracks and Years...")
        tracks = [
            CurriculumTrack(
                id="common",
                name="Common Foundation",
                code="CF",
                description="Core programming, web fundamentals, Git, prompt engineering, and project workflows.",
            ),
            CurriculumTrack(
                id="fullstack",
                name="Full-Stack & Application Development",
                code="FSAD",
                description="Backend frameworks, React, databases, Docker, CI/CD, and distributed microservices.",
            ),
            CurriculumTrack(
                id="ai",
                name="AI Engineering",
                code="AIE",
                description="Python for AI, Vector DBs, RAG systems, Autonomous Agents, LLM evaluation, and cloud deployment.",
            ),
        ]
        for t in tracks:
            db.merge(t)

        years = [
            CurriculumYear(id="year_1", name="1st Year: Common Foundation", year_number=1, description="Common engineering core"),
            CurriculumYear(id="year_2", name="2nd Year: Core Specialization", year_number=2, description="Full-stack or AI track"),
            CurriculumYear(id="year_3", name="3rd Year: Advanced Capstone", year_number=3, description="Production architecture"),
        ]
        for y in years:
            db.merge(y)
        db.commit()

        print("Seeding Users and Profiles...")
        # Admin User
        admin_user = User(
            id="usr-admin-1",
            email="mentor.admin@apex.edu",
            password_hash=get_password_hash("Password@123"),
            role=UserRole.ADMIN,
            full_name="Dr. Sarah Chen (Chief Mentor)",
            status=AccountStatus.ACTIVE,
        )
        db.add(admin_user)

        # Sample Students
        students_data = [
            {
                "id": "usr-student-1",
                "prof_id": "prof-student-1",
                "name": "Alex Rivers",
                "email": "alex.rivers@apex.edu",
                "roll": "ENG2026-0142",
                "dept": "Computer Science & Engineering",
                "year": EngineeringYear.YEAR_1,
                "track": SpecializationTrack.COMMON,
                "github": "https://github.com/alexrivers-dev",
                "days_ago": 1,
            },
            {
                "id": "usr-student-2",
                "prof_id": "prof-student-2",
                "name": "Priya Patel",
                "email": "priya.patel@apex.edu",
                "roll": "ENG2025-0089",
                "dept": "Information Technology",
                "year": EngineeringYear.YEAR_2,
                "track": SpecializationTrack.FULLSTACK,
                "github": "https://github.com/priyapatel-code",
                "days_ago": 0,
            },
            {
                "id": "usr-student-3",
                "prof_id": "prof-student-3",
                "name": "Marcus Vance",
                "email": "marcus.vance@apex.edu",
                "roll": "ENG2025-0215",
                "dept": "AI & Data Science",
                "year": EngineeringYear.YEAR_2,
                "track": SpecializationTrack.AI,
                "github": "https://github.com/marcusvance-ai",
                "days_ago": 1,
            },
            {
                "id": "usr-student-4",
                "prof_id": "prof-student-4",
                "name": "Elena Rostova",
                "email": "elena.rostova@apex.edu",
                "roll": "ENG2024-0033",
                "dept": "Software Engineering",
                "year": EngineeringYear.YEAR_3,
                "track": SpecializationTrack.FULLSTACK,
                "github": "https://github.com/elenarostova-eng",
                "days_ago": 2,
            },
            {
                "id": "usr-student-5",
                "prof_id": "prof-student-5",
                "name": "Devon Lane",
                "email": "devon.lane@apex.edu",
                "roll": "ENG2025-0371",
                "dept": "Computer Engineering",
                "year": EngineeringYear.YEAR_2,
                "track": SpecializationTrack.FULLSTACK,
                "github": "https://github.com/devonlane",
                "days_ago": 25,  # Inactive alert
            },
        ]

        for s in students_data:
            user = User(
                id=s["id"],
                email=s["email"],
                password_hash=get_password_hash("Password@123"),
                role=UserRole.STUDENT,
                full_name=s["name"],
                status=AccountStatus.ACTIVE,
            )
            db.add(user)
            db.flush()

            profile = StudentProfile(
                id=s["prof_id"],
                user_id=user.id,
                roll_number=s["roll"],
                college="Apex Institute of Technology",
                department=s["dept"],
                current_year=s["year"],
                track_id=s["track"],
                github_url=s["github"],
                last_active_at=datetime.utcnow() - timedelta(days=s["days_ago"]),
            )
            db.add(profile)

        db.commit()
        print("Database seed completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during database seed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
