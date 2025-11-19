"""Messages routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from typing import List
import uuid
from datetime import datetime

from ..database import get_db
from ..models import User, Message, Listing
from ..schemas import MessageCreate, MessageResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message about a listing"""
    # Get listing and validate
    listing = db.query(Listing).filter(Listing.id == message_data.listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Can't message your own listing
    if listing.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot message your own listing"
        )

    # Create message
    message = Message(
        id=str(uuid.uuid4()),
        listing_id=message_data.listing_id,
        sender_id=current_user.id,
        receiver_id=listing.user_id,
        content=message_data.content,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


@router.get("", response_model=List[MessageResponse])
def get_messages(
    listing_id: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get messages for current user"""
    query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    )

    if listing_id:
        query = query.filter(Message.listing_id == listing_id)

    messages = query.order_by(desc(Message.created_at)).all()

    return messages


@router.put("/{message_id}/read", response_model=MessageResponse)
def mark_message_read(
    message_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark a message as read"""
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Only receiver can mark as read
    if message.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to mark this message as read"
        )

    message.is_read = True
    message.read_at = datetime.utcnow()
    db.commit()
    db.refresh(message)

    return message
