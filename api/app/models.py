"""SQLAlchemy ORM Models - Anonymous Marketplace"""
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Numeric,
    Text, ARRAY, Enum as SQLEnum
)
from datetime import datetime
import enum
from .database import Base


# Enums
class Category(str, enum.Enum):
    CYBERWARE = "CYBERWARE"
    SOFTWARE = "SOFTWARE"
    HARDWARE = "HARDWARE"
    VEHICLES = "VEHICLES"
    WEAPONS = "WEAPONS"
    CLOTHING = "CLOTHING"
    SERVICES = "SERVICES"
    MISC = "MISC"


class Condition(str, enum.Enum):
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    USED = "USED"


class ListingStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    DELETED = "DELETED"


# Models
class Listing(Base):
    """
    Anonymous marketplace listing.
    No user accounts - anyone can post.
    """
    __tablename__ = "listings"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="ED", nullable=False)  # Eurodollars (ED) for cyberpunk theme
    category = Column(SQLEnum(Category), nullable=False, index=True)
    condition = Column(SQLEnum(Condition), default=Condition.USED)
    status = Column(SQLEnum(ListingStatus), default=ListingStatus.ACTIVE, index=True)
    location = Column(String, nullable=False, index=True)
    seller_name = Column(String, nullable=False)  # Anonymous handle like "NetRunner_99"
    images = Column(ARRAY(String), default=[])
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
