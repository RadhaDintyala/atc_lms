from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

class MongoDBManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

mongo_manager = MongoDBManager()

async def connect_to_mongo():
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    mongo_manager.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        maxPoolSize=50,
        minPoolSize=10,
        serverSelectionTimeoutMS=5000,
    )
    mongo_manager.db = mongo_manager.client[settings.MONGO_DB_NAME]
    print(f"Connected to MongoDB database: {settings.MONGO_DB_NAME}")

    # Ensure Indexes for performance and uniqueness constraints
    await init_mongo_indexes()

async def close_mongo_connection():
    if mongo_manager.client:
        mongo_manager.client.close()
        print("Closed MongoDB connection.")

async def init_mongo_indexes():
    db = mongo_manager.db
    # 1. users: unique email
    await db.users.create_index("email", unique=True)
    
    # 2. student_profiles: unique roll_number, index on user_id
    await db.student_profiles.create_index("roll_number", unique=True)
    await db.student_profiles.create_index("user_id", unique=True)
    await db.student_profiles.create_index("current_year")
    await db.student_profiles.create_index("track_id")

    # 3. curriculum_topics: unique slug, index on category_id, year_id, track_id
    await db.topics.create_index("slug", unique=True)
    await db.topics.create_index([("year_id", 1), ("track_id", 1)])
    await db.topics.create_index("category_id")

    # 4. resources: index on topic_id, display_order
    await db.resources.create_index([("topic_id", 1), ("display_order", 1)])

    # 5. student_topic_progress: compound unique index (student_id + topic_id)
    await db.student_topic_progress.create_index(
        [("student_id", 1), ("topic_id", 1)],
        unique=True
    )

    # 6. student_resource_progress: compound unique index (student_id + resource_id)
    await db.student_resource_progress.create_index(
        [("student_id", 1), ("resource_id", 1)],
        unique=True
    )

    # 7. projects: index on student_id and status
    await db.projects.create_index([("student_id", 1), ("status", 1)])

    # 8. activity_logs: index on student_id and timestamp
    await db.activity_logs.create_index([("student_id", 1), ("timestamp", -1)])

def get_mongo_db() -> AsyncIOMotorDatabase:
    return mongo_manager.db
