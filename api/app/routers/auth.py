"""Authentication routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
import uuid
import random
import logging

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse, Token
from ..auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user
)

logger = logging.getLogger(__name__)


# Schemas for email verification
class EmailRequest(BaseModel):
    email: EmailStr


class CodeVerification(BaseModel):
    email: EmailStr
    code: str

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        username=user_data.username,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token"""
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user


@router.post("/send-code", status_code=status.HTTP_200_OK)
def send_verification_code(email_req: EmailRequest, db: Session = Depends(get_db)):
    """
    Send verification code to email.
    Creates user if doesn't exist, or updates existing user's code.
    """
    # Generate 6-digit code
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    # Check if user exists
    user = db.query(User).filter(User.email == email_req.email).first()

    if user:
        # Update existing user's verification code
        user.verification_code = code
        user.verification_code_expires = expires_at
        user.updated_at = datetime.utcnow()
    else:
        # Create new user with verification code
        user = User(
            id=str(uuid.uuid4()),
            email=email_req.email,
            username=email_req.email.split('@')[0] + str(random.randint(1000, 9999)),  # Auto-generate username
            verification_code=code,
            verification_code_expires=expires_at,
            is_verified=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(user)

    db.commit()

    # TODO: In production, send email via SendGrid/SES
    # For now, log the code (visible in Docker logs)
    logger.info(f"🔐 Verification code for {email_req.email}: {code} (expires in 15 minutes)")

    return {
        "message": "Verification code sent! Check server logs for the code.",
        "email": email_req.email,
        "expires_in_minutes": 15
    }


@router.post("/verify-code", response_model=Token)
def verify_code(verification: CodeVerification, db: Session = Depends(get_db)):
    """
    Verify code and return access token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == verification.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verification code sent to this email"
        )

    # Check if code exists
    if not user.verification_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No verification code found. Please request a new code."
        )

    # Check if code expired
    if user.verification_code_expires and user.verification_code_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired. Please request a new code."
        )

    # Verify code
    if user.verification_code != verification.code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification code"
        )

    # Code is valid - mark user as verified and clear the code
    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires = None
    user.last_login_at = datetime.utcnow()
    db.commit()

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    logger.info(f"✅ User {user.email} verified and logged in")

    return {"access_token": access_token, "token_type": "bearer"}
