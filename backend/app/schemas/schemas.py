from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl
from app.models.models import (
    UserRole,
    AccountStatus,
    EngineeringYear,
    SpecializationTrack,
    DifficultyLevel,
    ResourceType,
    ProgressStatus,
    ProjectStatus,
)

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"
    profile: Optional["StudentProfileOut"] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT
    status: AccountStatus = AccountStatus.ACTIVE

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Student Profile Schemas
class StudentProfileBase(BaseModel):
    roll_number: str
    college: str = "Apex Institute of Technology"
    department: str
    current_year: EngineeringYear
    track_id: SpecializationTrack
    profile_image: Optional[str] = None
    github_url: Optional[str] = None

class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    roll_number: str
    college: Optional[str] = "Apex Institute of Technology"
    department: str
    current_year: EngineeringYear
    track_id: SpecializationTrack
    github_url: Optional[str] = None

class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    roll_number: Optional[str] = None
    department: Optional[str] = None
    college: Optional[str] = None
    current_year: Optional[EngineeringYear] = None
    track_id: Optional[SpecializationTrack] = None
    github_url: Optional[str] = None
    profile_image: Optional[str] = None
    status: Optional[AccountStatus] = None

class StudentProfileOut(StudentProfileBase):
    id: str
    user_id: str
    last_active_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class StudentListItem(StudentProfileOut):
    full_name: str
    email: str
    account_status: AccountStatus
    overall_percentage: float
    completed_required_topics: int
    total_required_topics: int
    projects_count: int
    is_inactive_warning: bool

# Resource Schemas
class ResourceBase(BaseModel):
    title: str
    description: str
    type: ResourceType
    url: str
    duration_minutes: int = 60
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    display_order: int = 0
    published: bool = True
    is_sample: bool = True

class ResourceCreate(ResourceBase):
    topic_id: str

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ResourceType] = None
    url: Optional[str] = None
    duration_minutes: Optional[int] = None
    difficulty: Optional[DifficultyLevel] = None
    display_order: Optional[int] = None
    published: Optional[bool] = None

class ResourceOut(ResourceBase):
    id: str
    topic_id: str

    class Config:
        from_attributes = True

# Topic Schemas
class TopicBase(BaseModel):
    title: str
    description: str
    learning_objectives: Optional[List[str]] = []
    estimated_duration_minutes: int = 120
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    is_required: bool = True
    is_published: bool = True
    order: int = 0
    suggested_project: Optional[str] = None

class TopicCreate(TopicBase):
    category_id: str
    year_id: str
    track_id: str

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    learning_objectives: Optional[List[str]] = None
    estimated_duration_minutes: Optional[int] = None
    difficulty: Optional[DifficultyLevel] = None
    is_required: Optional[bool] = None
    is_published: Optional[bool] = None
    order: Optional[int] = None
    suggested_project: Optional[str] = None

class TopicOut(TopicBase):
    id: str
    slug: str
    category_id: str
    year_id: str
    track_id: str
    resources: List[ResourceOut] = []

    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    order: int = 0
    year_id: str
    track_id: str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: str
    topics: List[TopicOut] = []

    class Config:
        from_attributes = True

# Progress Schemas
class TopicProgressUpdate(BaseModel):
    topic_id: str
    status: ProgressStatus
    notes: Optional[str] = None

class ResourceProgressUpdate(BaseModel):
    resource_id: str
    status: ProgressStatus

class ProgressBreakdown(BaseModel):
    commonFoundationPercentage: float
    trackPercentage: float
    thirdYearPercentage: float

class StudentProgressSummary(BaseModel):
    overallPercentage: float
    totalRequiredTopics: int
    completedRequiredTopics: int
    inProgressTopics: int
    pendingTopics: int
    breakdown: ProgressBreakdown
    nextRecommendedTopic: Optional[TopicOut] = None

# Project Schemas
class ProjectCreate(BaseModel):
    id: Optional[str] = None
    topic_id: Optional[str] = None
    title: str
    problem_statement: str
    tech_stack: List[str]
    github_url: Optional[str] = ""
    deployment_url: Optional[str] = ""
    description: str
    completion_notes: Optional[str] = ""
    status: ProjectStatus = ProjectStatus.DRAFT

class ProjectReviewRequest(BaseModel):
    status: ProjectStatus
    feedback: str

class ProjectOut(BaseModel):
    id: str
    student_id: str
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    topic_id: Optional[str] = None
    topic_title: Optional[str] = None
    title: str
    problem_statement: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    deployment_url: Optional[str] = None
    description: str
    completion_notes: Optional[str] = None
    status: ProjectStatus
    created_at: datetime
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewer_feedback: Optional[str] = None

    class Config:
        from_attributes = True
