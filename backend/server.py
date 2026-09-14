from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import re
from pydantic import BaseModel, Field, EmailStr, StringConstraints, field_validator
from typing import Annotated, List, Optional
import uuid
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from datetime import datetime, timedelta
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")
security = HTTPBearer()


# ---------------- Models ----------------
class LoginRequest(BaseModel):
    username: str
    password: str


class InquiryCreate(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    email: EmailStr
    country_code: Annotated[str, StringConstraints(strip_whitespace=True, max_length=10)] = "+977"
    phone: Annotated[Optional[str], StringConstraints(strip_whitespace=True, max_length=20)] = ""
    company: Annotated[Optional[str], StringConstraints(strip_whitespace=True, max_length=150)] = ""
    service: Annotated[Optional[str], StringConstraints(strip_whitespace=True, max_length=100)] = ""
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2000)]


class Inquiry(InquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

def validate_image_data_uri(value: Optional[str]) -> Optional[str]:
    if value is None or value == "":
        return value

    # Only allow JPEG, PNG, or WebP data URIs
    if not re.match(r"^data:image/(jpeg|png|webp);base64,", value):
        raise ValueError("Only JPEG, PNG, and WebP images are allowed")

    # Prevent oversized base64 payloads
    if len(value) > 2_000_000:
        raise ValueError("Image is too large")

    return value

class ServiceInput(BaseModel):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=150)]
    desc: Annotated[str, StringConstraints(strip_whitespace=True, max_length=1000)] = ""
    image: Optional[str] = None
    icon: Annotated[Optional[str], StringConstraints(max_length=50)] = None
    order: Optional[int] = 0

    @field_validator("image")
    @classmethod
    def validate_image(cls, value):
        return validate_image_data_uri(value)


class Service(ServiceInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class ExpertiseInput(BaseModel):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=150)]
    image: Optional[str] = None
    order: Optional[int] = 0

    @field_validator("image")
    @classmethod
    def validate_image(cls, value):
        return validate_image_data_uri(value)


class Expertise(ExpertiseInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# ---------------- Auth helpers ----------------
def create_token(username: str) -> str:
    payload = {"sub": username, "exp": datetime.utcnow() + timedelta(minutes=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Kedia and Associates API"}

@api_router.post("/admin/login")
@limiter.limit("5/minute")
async def admin_login(request: Request, req: LoginRequest):
    if req.username == ADMIN_USERNAME and req.password == ADMIN_PASSWORD:
        return {"token": create_token(req.username), "username": req.username}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# Inquiries
@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inp: InquiryCreate):
    if inp.phone and (not inp.phone.isdigit() or len(inp.phone) != 10):
        raise HTTPException(status_code=400, detail="Phone must be exactly 10 digits")
    obj = Inquiry(**inp.dict())
    await db.inquiries.insert_one(obj.dict())
    return obj


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin: str = Depends(verify_admin)):
    docs = await db.inquiries.find().sort("created_at", -1).to_list(1000)
    return [Inquiry(**clean(d)) for d in docs]


@api_router.delete("/inquiries/{iid}")
async def delete_inquiry(iid: str, admin: str = Depends(verify_admin)):
    await db.inquiries.delete_one({"id": iid})
    return {"ok": True}


# Services
@api_router.get("/services", response_model=List[Service])
async def list_services():
    docs = await db.services.find().sort("order", 1).to_list(1000)
    return [Service(**clean(d)) for d in docs]


@api_router.post("/services", response_model=Service)
async def create_service(inp: ServiceInput, admin: str = Depends(verify_admin)):
    obj = Service(**inp.dict())
    await db.services.insert_one(obj.dict())
    return obj


@api_router.put("/services/{sid}", response_model=Service)
async def update_service(sid: str, inp: ServiceInput, admin: str = Depends(verify_admin)):
    existing = await db.services.find_one({"id": sid})
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    data = inp.dict()
    await db.services.update_one({"id": sid}, {"$set": data})
    updated = await db.services.find_one({"id": sid})
    return Service(**clean(updated))


@api_router.delete("/services/{sid}")
async def delete_service(sid: str, admin: str = Depends(verify_admin)):
    await db.services.delete_one({"id": sid})
    return {"ok": True}


# Expertise
@api_router.get("/expertise", response_model=List[Expertise])
async def list_expertise():
    docs = await db.expertise.find().sort("order", 1).to_list(1000)
    return [Expertise(**clean(d)) for d in docs]


@api_router.post("/expertise", response_model=Expertise)
async def create_expertise(inp: ExpertiseInput, admin: str = Depends(verify_admin)):
    obj = Expertise(**inp.dict())
    await db.expertise.insert_one(obj.dict())
    return obj


@api_router.put("/expertise/{eid}", response_model=Expertise)
async def update_expertise(eid: str, inp: ExpertiseInput, admin: str = Depends(verify_admin)):
    existing = await db.expertise.find_one({"id": eid})
    if not existing:
        raise HTTPException(status_code=404, detail="Expertise not found")
    await db.expertise.update_one({"id": eid}, {"$set": inp.dict()})
    updated = await db.expertise.find_one({"id": eid})
    return Expertise(**clean(updated))


@api_router.delete("/expertise/{eid}")
async def delete_expertise(eid: str, admin: str = Depends(verify_admin)):
    await db.expertise.delete_one({"id": eid})
    return {"ok": True}


# ---------------- Seed ----------------
SEED_SERVICES = [
    ("Statutory Audit", "Professional statutory audit support focused on accuracy, compliance and transparent financial reporting.", "ClipboardCheck"),
    ("Internal Audit", "Independent review of internal processes, controls, risks and operational efficiency.", "ShieldCheck"),
    ("Tax Audit", "Tax audit services designed to support compliance and accurate reporting.", "FileCheck2"),
    ("Tax Planning", "Practical tax planning and advisory to help businesses make informed financial decisions.", "Calculator"),
    ("Tax Filing", "Reliable tax preparation and filing support.", "FileText"),
    ("Representation", "Professional representation and assistance in tax and financial matters.", "Scale"),
    ("Bookkeeping", "Organized and accurate bookkeeping to maintain reliable financial records.", "BookOpen"),
    ("Payroll", "Payroll processing and related accounting support.", "Wallet"),
    ("Preparation of Financial Statements", "Preparation and presentation of accurate financial statements for business and reporting needs.", "FileBarChart2"),
    ("Corporate Finance", "Financial advisory support for corporate financial decisions and transactions.", "Building2"),
    ("Valuation", "Business and financial valuation services to support informed decision-making.", "LineChart"),
    ("Consulting", "Business and financial consulting tailored to organizational requirements.", "Lightbulb"),
]

SEED_EXPERTISE = [
    "Audits", "Accounts", "Financial Advisory", "Business Consultancy", "Due Diligence",
    "Tax Assessments", "Banking Advisory", "Corporate Finance", "Valuation", "Tax Planning",
]


@app.on_event("startup")
async def seed_data():
    if await db.services.count_documents({}) == 0:
        for i, (title, desc, icon) in enumerate(SEED_SERVICES):
            await db.services.insert_one(Service(title=title, desc=desc, icon=icon, order=i).dict())
        logger.info("Seeded services")
    if await db.expertise.count_documents({}) == 0:
        for i, title in enumerate(SEED_EXPERTISE):
            await db.expertise.insert_one(Expertise(title=title, order=i).dict())
        logger.info("Seeded expertise")


app.include_router(api_router)

cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
