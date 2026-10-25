from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, EmailStr
import enum

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

# 1. MongoDB User Document Model
class MongoUser(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    password_hash: str
    role: UserRole = UserRole.STUDENT
    full_name: str
    status: AccountStatus = AccountStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# 2. MongoDB Student Profile Document Model
class MongoStudentProfile(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    roll_number: str
    college: str = "Apex Institute of Technology"
    department: str
    current_year: EngineeringYear = EngineeringYear.YEAR_1
    track_id: SpecializationTrack = SpecializationTrack.COMMON
    profile_image: Optional[str] = None
    github_url: Optional[str] = None
    last_active_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# 3. MongoDB Track Document Model
class MongoTrack(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    code: str
    description: Optional[str] = None

# 4. MongoDB Year Document Model
class MongoYear(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    year_number: int
    description: Optional[str] = None

# 5. MongoDB Category Document Model
class MongoCategory(BaseModel):
    id: str = Field(..., alias="_id")
    year_id: str
    track_id: str
    name: str
    description: Optional[str] = None
    order: int = 1

# 6. MongoDB Topic Document Model
class MongoTopic(BaseModel):
    id: str = Field(..., alias="_id")
    category_id: str
    year_id: str
    track_id: str
    title: str
    slug: str
    description: str
    learning_objectives: List[str] = []
    estimated_duration_minutes: int = 120
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    is_required: bool = True
    is_published: bool = True
    order: int = 1
    suggested_project: Optional[str] = None

# 7. MongoDB Resource Document Model
class MongoResource(BaseModel):
    id: str = Field(..., alias="_id")
    topic_id: str
    title: str
    description: str
    type: ResourceType = ResourceType.DOCUMENTATION
    url: str
    duration_minutes: int = 60
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    display_order: int = 1
    published: bool = True
    is_sample: bool = True

# 8. MongoDB Student Topic Progress Document Model
class MongoTopicProgress(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    topic_id: str
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# 9. MongoDB Student Resource Progress Document Model
class MongoResourceProgress(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    resource_id: str
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# 10. MongoDB Project Document Model
class ProjectHistoryItem(BaseModel):
    date: datetime = Field(default_factory=datetime.utcnow)
    action: str
    status: str
    notes: Optional[str] = None
    by: str

class MongoProject(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    topic_id: Optional[str] = None
    title: str
    problem_statement: str
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    deployment_url: Optional[str] = None
    description: str
    completion_notes: Optional[str] = None
    status: ProjectStatus = ProjectStatus.DRAFT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewer_id: Optional[str] = None
    reviewer_feedback: Optional[str] = None
    history: List[ProjectHistoryItem] = []

# 11. MongoDB Activity Log Document Model
class MongoActivityLog(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    type: str
    description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
