"""SQLAlchemy ORM Models"""
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Numeric,
    Text, ARRAY, ForeignKey, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base


# Enums
class Category(str, enum.Enum):
    ELECTRONICS = "ELECTRONICS"
    VEHICLES = "VEHICLES"
    REAL_ESTATE = "REAL_ESTATE"
    JOBS = "JOBS"
    SERVICES = "SERVICES"
    FASHION = "FASHION"
    HOME_GARDEN = "HOME_GARDEN"
    SPORTS = "SPORTS"
    PETS = "PETS"
    BOOKS = "BOOKS"
    TOYS = "TOYS"
    OTHER = "OTHER"


class Condition(str, enum.Enum):
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    USED = "USED"


class ListingStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    EXPIRED = "EXPIRED"
    DELETED = "DELETED"


# Models
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=True, index=True)  # Optional now
    password_hash = Column(String, nullable=True)  # Optional for email-only auth
    full_name = Column(String)
    phone = Column(String)
    avatar_url = Column(String)
    bio = Column(Text)
    location = Column(String)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    verification_code = Column(String)  # 6-digit code
    verification_code_expires = Column(DateTime)  # Expiry time
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime)

    # Relationships
    listings = relationship("Listing", back_populates="user", cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(SQLEnum(Category), nullable=False, index=True)
    condition = Column(SQLEnum(Condition), default=Condition.USED)
    status = Column(SQLEnum(ListingStatus), default=ListingStatus.ACTIVE, index=True)
    location = Column(String, nullable=False, index=True)
    images = Column(ARRAY(String), default=[])
    views = Column(Integer, default=0)
    is_promoted = Column(Boolean, default=False)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="listings")
    messages = relationship("Message", back_populates="listing", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    listing = relationship("Listing", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")
