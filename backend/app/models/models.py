from datetime import datetime
import enum
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"

class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class EngineeringYear(str, enum.Enum):
    YEAR_1 = "year_1"
    YEAR_2 = "year_2"
    YEAR_3 = "year_3"

class SpecializationTrack(str, enum.Enum):
    COMMON = "common"
    FULLSTACK = "fullstack"
    AI = "ai"

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class ResourceType(str, enum.Enum):
    DOCUMENTATION = "Documentation"
    VIDEO = "Video"
    COURSE = "Course"
    TUTORIAL = "Tutorial"
    REPOSITORY = "Repository"
    ARTICLE = "Article"
    PRACTICE = "Practice"

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    CHANGES_REQUESTED = "changes_requested"
    APPROVED = "approved"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    full_name = Column(String, nullable=False)
    status = Column(Enum(AccountStatus), default=AccountStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews_given = relationship("ProjectReview", back_populates="reviewer")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    college = Column(String, nullable=False, default="Apex Institute of Technology")
    department = Column(String, nullable=False)
    current_year = Column(Enum(EngineeringYear), default=EngineeringYear.YEAR_1, nullable=False)
    track_id = Column(Enum(SpecializationTrack), default=SpecializationTrack.COMMON, nullable=False)
    profile_image = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    last_active_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    topic_progress = relationship("StudentTopicProgress", back_populates="student", cascade="all, delete-orphan")
    resource_progress = relationship("StudentResourceProgress", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="student", cascade="all, delete-orphan")

class CurriculumTrack(Base):
    __tablename__ = "curriculum_tracks"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)

class CurriculumYear(Base):
    __tablename__ = "curriculum_years"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    year_number = Column(Integer, unique=True, nullable=False)
    description = Column(Text, nullable=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    year_id = Column(String, ForeignKey("curriculum_years.id"), nullable=False, index=True)
    track_id = Column(String, ForeignKey("curriculum_tracks.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0, nullable=False)

    topics = relationship("Topic", back_populates="category", cascade="all, delete-orphan", order_by="Topic.order")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(String, primary_key=True, index=True)
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    year_id = Column(String, ForeignKey("curriculum_years.id"), nullable=False, index=True)
    track_id = Column(String, ForeignKey("curriculum_tracks.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    learning_objectives = Column(Text, nullable=True)  # JSON-encoded array of strings
    estimated_duration_minutes = Column(Integer, default=120)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    is_required = Column(Boolean, default=True, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    suggested_project = Column(Text, nullable=True)

    category = relationship("Category", back_populates="topics")
    resources = relationship("Resource", back_populates="topic", cascade="all, delete-orphan", order_by="Resource.display_order")
    topic_progress = relationship("StudentTopicProgress", back_populates="topic")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    topic_id = Column(String, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(Enum(ResourceType), nullable=False)
    url = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=60)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    display_order = Column(Integer, default=0)
    published = Column(Boolean, default=True, nullable=False)
    is_sample = Column(Boolean, default=True, nullable=False)

    topic = relationship("Topic", back_populates="resources")

class StudentTopicProgress(Base):
    __tablename__ = "student_topic_progress"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.NOT_STARTED, nullable=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    student = relationship("StudentProfile", back_populates="topic_progress")
    topic = relationship("Topic", back_populates="topic_progress")

    __table_args__ = (
        UniqueConstraint("student_id", "topic_id", name="uq_student_topic"),
    )

class StudentResourceProgress(Base):
    __tablename__ = "student_resource_progress"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id = Column(String, ForeignKey("resources.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.NOT_STARTED, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    student = relationship("StudentProfile", back_populates="resource_progress")

    __table_args__ = (
        UniqueConstraint("student_id", "resource_id", name="uq_student_resource"),
    )

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    tech_stack = Column(Text, nullable=False)  # JSON-encoded array of strings
    github_url = Column(String, nullable=True)
    deployment_url = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    completion_notes = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=True)
    reviewer_feedback = Column(Text, nullable=True)

    student = relationship("StudentProfile", back_populates="projects")
    submissions = relationship("ProjectSubmission", back_populates="project", cascade="all, delete-orphan")
    reviews = relationship("ProjectReview", back_populates="project", cascade="all, delete-orphan")

class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, default=1, nullable=False)
    github_url = Column(String, nullable=True)
    deployment_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="submissions")

class ProjectReview(Base):
    __tablename__ = "project_reviews"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(ProjectStatus), nullable=False)
    feedback = Column(Text, nullable=False)
    reviewed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews_given")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    student = relationship("StudentProfile", back_populates="activity_logs")
