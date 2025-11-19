"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .models import Category, Condition, ListingStatus


# ========== User Schemas ==========
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    is_verified: bool
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


# ========== Listing Schemas ==========
class ListingBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    price: Decimal = Field(..., gt=0)
    category: Category
    condition: Condition = Condition.USED
    location: str


class ListingCreate(ListingBase):
    images: List[str] = Field(default_factory=list)


class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    price: Optional[Decimal] = Field(None, gt=0)
    category: Optional[Category] = None
    condition: Optional[Condition] = None
    location: Optional[str] = None
    status: Optional[ListingStatus] = None
    images: Optional[List[str]] = None


class ListingResponse(ListingBase):
    id: str
    user_id: str
    status: ListingStatus
    images: List[str]
    views: int
    is_promoted: bool
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ========== Message Schemas ==========
class MessageCreate(BaseModel):
    listing_id: str
    content: str = Field(..., min_length=1, max_length=2000)


class MessageResponse(BaseModel):
    id: str
    listing_id: str
    sender_id: str
    receiver_id: str
    content: str
    is_read: bool
    created_at: datetime
    sender: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ========== Favorite Schema ==========
class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    listing_id: str
    created_at: datetime
    listing: Optional[ListingResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ========== Pagination ==========
class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int
