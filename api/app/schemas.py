"""Pydantic schemas for request/response validation - Anonymous Marketplace"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .models import Category, Condition, ListingStatus


# ========== Listing Schemas ==========
class ListingBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    price: Decimal = Field(..., gt=0)
    currency: str = Field(default="ED", max_length=10)
    category: Category
    condition: Condition = Condition.USED
    location: str = Field(..., min_length=2, max_length=100)
    seller_name: str = Field(..., min_length=2, max_length=50)


class ListingCreate(ListingBase):
    images: List[str] = Field(default_factory=list, max_length=10)


class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=5000)
    price: Optional[Decimal] = Field(None, gt=0)
    category: Optional[Category] = None
    condition: Optional[Condition] = None
    location: Optional[str] = Field(None, min_length=2, max_length=100)
    status: Optional[ListingStatus] = None
    images: Optional[List[str]] = Field(None, max_length=10)


class ListingResponse(ListingBase):
    id: str
    status: ListingStatus
    images: List[str]
    views: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ========== Content Moderation ==========
class ModerationResult(BaseModel):
    approved: bool
    reason: str
    confidence: str


# ========== Pagination ==========
class PaginatedResponse(BaseModel):
    items: List[ListingResponse]
    total: int
    page: int
    size: int
    pages: int
