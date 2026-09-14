from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError

import os
import logging
from pathlib import Path
import re
import uuid
import jwt

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    StringConstraints,
    field_validator,
)

from typing import Annotated, List, Optional
from datetime import datetime, timedelta

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


# --------------------------------------------------
# Logging
# --------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


# --------------------------------------------------
# Environment configuration
# --------------------------------------------------

ROOT_DIR = Path(__file__).parent

# Loads backend/.env locally.
# On Render, environment variables are loaded automatically.
load_dotenv(ROOT_DIR / ".env")


mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

JWT_SECRET = os.getenv("JWT_SECRET")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000",
)


if not mongo_url:
    raise RuntimeError("MONGO_URL environment variable is missing")

if not db_name:
    raise RuntimeError("DB_NAME environment variable is missing")

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET environment variable is missing")

if not ADMIN_USERNAME:
    raise RuntimeError("ADMIN_USERNAME environment variable is missing")

if not ADMIN_PASSWORD:
    raise RuntimeError("ADMIN_PASSWORD environment variable is missing")


# --------------------------------------------------
# MongoDB connection
# --------------------------------------------------

client = AsyncIOMotorClient(
    mongo_url,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=10000,
)

db = client[db_name]


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Kedia and Associates API",
    version="1.0.0",
)


# --------------------------------------------------
# Rate limiting
# --------------------------------------------------

limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)


# --------------------------------------------------
# Router and authentication
# --------------------------------------------------

api_router = APIRouter(prefix="/api")

security = HTTPBearer()


# --------------------------------------------------
# Models
# --------------------------------------------------

class LoginRequest(BaseModel):
    username: str
    password: str


class InquiryCreate(BaseModel):
    name: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=100,
        ),
    ]

    email: EmailStr

    country_code: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            max_length=10,
        ),
    ] = "+977"

    phone: Annotated[
        Optional[str],
        StringConstraints(
            strip_whitespace=True,
            max_length=20,
        ),
    ] = ""

    company: Annotated[
        Optional[str],
        StringConstraints(
            strip_whitespace=True,
            max_length=150,
        ),
    ] = ""

    service: Annotated[
        Optional[str],
        StringConstraints(
            strip_whitespace=True,
            max_length=100,
        ),
    ] = ""

    message: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=2000,
        ),
    ]


class Inquiry(InquiryCreate):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )


def validate_image_data_uri(
    value: Optional[str],
) -> Optional[str]:

    if value is None or value == "":
        return value

    # Only allow JPEG, PNG, or WebP data URIs
    if not re.match(
        r"^data:image/(jpeg|png|webp);base64,",
        value,
    ):
        raise ValueError(
            "Only JPEG, PNG, and WebP images are allowed"
        )

    # Prevent oversized base64 payloads
    if len(value) > 2_000_000:
        raise ValueError("Image is too large")

    return value


class ServiceInput(BaseModel):
    title: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=150,
        ),
    ]

    desc: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            max_length=1000,
        ),
    ] = ""

    image: Optional[str] = None

    icon: Annotated[
        Optional[str],
        StringConstraints(max_length=50),
    ] = None

    order: Optional[int] = 0

    @field_validator("image")
    @classmethod
    def validate_image(cls, value):
        return validate_image_data_uri(value)


class Service(ServiceInput):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )


class ExpertiseInput(BaseModel):
    title: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=150,
        ),
    ]

    image: Optional[str] = None

    order: Optional[int] = 0

    @field_validator("image")
    @classmethod
    def validate_image(cls, value):
        return validate_image_data_uri(value)


class Expertise(ExpertiseInput):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )


# --------------------------------------------------
# Authentication helpers
# --------------------------------------------------

def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=30),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256",
    )


def verify_admin(
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = jwt.decode(
            creds.credentials,
            JWT_SECRET,
            algorithms=["HS256"],
        )

        username = payload.get("sub")

        if not username:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        return username

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


# --------------------------------------------------
# MongoDB helper
# --------------------------------------------------

def clean(doc: dict) -> dict:
    if doc is None:
        return {}

    doc.pop("_id", None)
    return doc


# --------------------------------------------------
# Health-check routes
# --------------------------------------------------

@app.get("/")
async def health_check():
    return {
        "status": "ok",
        "message": "Kedia and Associates backend is running",
    }


@api_router.get("/")
async def api_root():
    return {
        "message": "Kedia and Associates API",
    }


# --------------------------------------------------
# Admin login
# --------------------------------------------------

@api_router.post("/admin/login")
@limiter.limit("5/minute")
async def admin_login(
    request: Request,
    req: LoginRequest,
):
    if (
        req.username == ADMIN_USERNAME
        and req.password == ADMIN_PASSWORD
    ):
        return {
            "token": create_token(req.username),
            "username": req.username,
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials",
    )


# --------------------------------------------------
# Inquiries
# --------------------------------------------------

@api_router.post(
    "/inquiries",
    response_model=Inquiry,
)
async def create_inquiry(
    inp: InquiryCreate,
):
    if inp.phone:
        if not inp.phone.isdigit() or len(inp.phone) != 10:
            raise HTTPException(
                status_code=400,
                detail="Phone must be exactly 10 digits",
            )

    obj = Inquiry(**inp.model_dump())

    await db.inquiries.insert_one(
        obj.model_dump()
    )

    return obj


@api_router.get(
    "/inquiries",
    response_model=List[Inquiry],
)
async def list_inquiries(
    admin: str = Depends(verify_admin),
):
    docs = await db.inquiries.find().sort(
        "created_at",
        -1,
    ).to_list(1000)

    return [
        Inquiry(**clean(doc))
        for doc in docs
    ]


@api_router.delete("/inquiries/{iid}")
async def delete_inquiry(
    iid: str,
    admin: str = Depends(verify_admin),
):
    await db.inquiries.delete_one(
        {"id": iid}
    )

    return {
        "ok": True,
    }


# --------------------------------------------------
# Services
# --------------------------------------------------

@api_router.get(
    "/services",
    response_model=List[Service],
)
async def list_services():
    docs = await db.services.find().sort(
        "order",
        1,
    ).to_list(1000)

    return [
        Service(**clean(doc))
        for doc in docs
    ]


@api_router.post(
    "/services",
    response_model=Service,
)
async def create_service(
    inp: ServiceInput,
    admin: str = Depends(verify_admin),
):
    obj = Service(**inp.model_dump())

    await db.services.insert_one(
        obj.model_dump()
    )

    return obj


@api_router.put(
    "/services/{sid}",
    response_model=Service,
)
async def update_service(
    sid: str,
    inp: ServiceInput,
    admin: str = Depends(verify_admin),
):
    existing = await db.services.find_one(
        {"id": sid}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    data = inp.model_dump()

    await db.services.update_one(
        {"id": sid},
        {"$set": data},
    )

    updated = await db.services.find_one(
        {"id": sid}
    )

    return Service(**clean(updated))


@api_router.delete("/services/{sid}")
async def delete_service(
    sid: str,
    admin: str = Depends(verify_admin),
):
    await db.services.delete_one(
        {"id": sid}
    )

    return {
        "ok": True,
    }


# --------------------------------------------------
# Expertise
# --------------------------------------------------

@api_router.get(
    "/expertise",
    response_model=List[Expertise],
)
async def list_expertise():
    docs = await db.expertise.find().sort(
        "order",
        1,
    ).to_list(1000)

    return [
        Expertise(**clean(doc))
        for doc in docs
    ]


@api_router.post(
    "/expertise",
    response_model=Expertise,
)
async def create_expertise(
    inp: ExpertiseInput,
    admin: str = Depends(verify_admin),
):
    obj = Expertise(**inp.model_dump())

    await db.expertise.insert_one(
        obj.model_dump()
    )

    return obj


@api_router.put(
    "/expertise/{eid}",
    response_model=Expertise,
)
async def update_expertise(
    eid: str,
    inp: ExpertiseInput,
    admin: str = Depends(verify_admin),
):
    existing = await db.expertise.find_one(
        {"id": eid}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Expertise not found",
        )

    await db.expertise.update_one(
        {"id": eid},
        {
            "$set": inp.model_dump()
        },
    )

    updated = await db.expertise.find_one(
        {"id": eid}
    )

    return Expertise(**clean(updated))


@api_router.delete("/expertise/{eid}")
async def delete_expertise(
    eid: str,
    admin: str = Depends(verify_admin),
):
    await db.expertise.delete_one(
        {"id": eid}
    )

    return {
        "ok": True,
    }


# --------------------------------------------------
# Seed data
# --------------------------------------------------

SEED_SERVICES = [
    (
        "Statutory Audit",
        "Professional statutory audit support focused on accuracy, compliance and transparent financial reporting.",
        "ClipboardCheck",
    ),
    (
        "Internal Audit",
        "Independent review of internal processes, controls, risks and operational efficiency.",
        "ShieldCheck",
    ),
    (
        "Tax Audit",
        "Tax audit services designed to support compliance and accurate reporting.",
        "FileCheck2",
    ),
    (
        "Tax Planning",
        "Practical tax planning and advisory to help businesses make informed financial decisions.",
        "Calculator",
    ),
    (
        "Tax Filing",
        "Reliable tax preparation and filing support.",
        "FileText",
    ),
    (
        "Representation",
        "Professional representation and assistance in tax and financial matters.",
        "Scale",
    ),
    (
        "Bookkeeping",
        "Organized and accurate bookkeeping to maintain reliable financial records.",
        "BookOpen",
    ),
    (
        "Payroll",
        "Payroll processing and related accounting support.",
        "Wallet",
    ),
    (
        "Preparation of Financial Statements",
        "Preparation and presentation of accurate financial statements for business and reporting needs.",
        "FileBarChart2",
    ),
    (
        "Corporate Finance",
        "Financial advisory support for corporate financial decisions and transactions.",
        "Building2",
    ),
    (
        "Valuation",
        "Business and financial valuation services to support informed decision-making.",
        "LineChart",
    ),
    (
        "Consulting",
        "Business and financial consulting tailored to organizational requirements.",
        "Lightbulb",
    ),
]


SEED_EXPERTISE = [
    "Audits",
    "Accounts",
    "Financial Advisory",
    "Business Consultancy",
    "Due Diligence",
    "Tax Assessments",
    "Banking Advisory",
    "Corporate Finance",
    "Valuation",
    "Tax Planning",
]


# --------------------------------------------------
# Startup and shutdown
# --------------------------------------------------

@app.on_event("startup")
async def startup_event():
    try:
        # Confirm MongoDB connectivity
        await client.admin.command("ping")
        logger.info("Connected to MongoDB successfully")

        # Seed services
        if await db.services.count_documents({}) == 0:
            for i, (title, desc, icon) in enumerate(
                SEED_SERVICES
            ):
                service = Service(
                    title=title,
                    desc=desc,
                    icon=icon,
                    order=i,
                )

                await db.services.insert_one(
                    service.model_dump()
                )

            logger.info("Seeded services")

        # Seed expertise
        if await db.expertise.count_documents({}) == 0:
            for i, title in enumerate(
                SEED_EXPERTISE
            ):
                expertise = Expertise(
                    title=title,
                    order=i,
                )

                await db.expertise.insert_one(
                    expertise.model_dump()
                )

            logger.info("Seeded expertise")

    except PyMongoError as error:
        logger.exception(
            "MongoDB connection failed: %s",
            error,
        )
        raise


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("MongoDB connection closed")


# --------------------------------------------------
# CORS
# --------------------------------------------------

allow_origins = [
    origin.strip()
    for origin in CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


# --------------------------------------------------
# Register router
# --------------------------------------------------

app.include_router(api_router)