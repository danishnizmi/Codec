"""Favorites routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from ..database import get_db
from ..models import User, Favorite, Listing
from ..schemas import FavoriteResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("", response_model=List[FavoriteResponse])
def get_favorites(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's favorite listings"""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()

    return favorites


@router.post("/{listing_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    listing_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a listing to favorites"""
    # Check if listing exists
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.listing_id == listing_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing already in favorites"
        )

    # Create favorite
    favorite = Favorite(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        listing_id=listing_id,
        created_at=datetime.utcnow()
    )

    db.add(favorite)
    db.commit()

    return {"message": "Added to favorites"}


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    listing_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove a listing from favorites"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.listing_id == listing_id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )

    db.delete(favorite)
    db.commit()

    return None
