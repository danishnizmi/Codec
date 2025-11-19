"""Listings routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import List, Optional, Dict
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError

from ..database import get_db
from ..models import User, Listing, ListingStatus
from ..schemas import ListingCreate, ListingUpdate, ListingResponse
from ..auth import get_current_active_user
from ..config import settings

router = APIRouter(prefix="/listings", tags=["Listings"])

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)


@router.post("/upload-urls", status_code=status.HTTP_200_OK)
def get_s3_upload_urls(
    file_count: int = Query(..., ge=1, le=10),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, List[Dict[str, str]]]:
    """
    Generate presigned S3 URLs for image uploads.
    Client uploads directly to S3, reducing server bandwidth and CPU.

    Args:
        file_count: Number of upload URLs to generate (1-10)
        current_user: Authenticated user

    Returns:
        Dictionary with upload URLs and file keys
    """
    upload_urls = []

    try:
        for i in range(file_count):
            # Generate unique file key
            file_key = f"listings/{current_user.id}/{uuid.uuid4()}.jpg"

            # Generate presigned POST URL (more secure than PUT)
            presigned_post = s3_client.generate_presigned_post(
                Bucket=settings.S3_BUCKET,
                Key=file_key,
                Fields={
                    "Content-Type": "image/jpeg",
                    "x-amz-server-side-encryption": "AES256"
                },
                Conditions=[
                    {"Content-Type": "image/jpeg"},
                    ["content-length-range", 0, 10485760],  # Max 10MB
                    {"x-amz-server-side-encryption": "AES256"}
                ],
                ExpiresIn=3600  # 1 hour
            )

            upload_urls.append({
                "file_key": file_key,
                "upload_url": presigned_post["url"],
                "fields": presigned_post["fields"],
                "public_url": f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
            })

    except ClientError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate upload URLs: {str(e)}"
        )

    return {"upload_urls": upload_urls}


@router.get("", response_model=List[ListingResponse])
def get_listings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[ListingStatus] = ListingStatus.ACTIVE,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get all listings with filters"""
    query = db.query(Listing)

    # Apply filters
    if status:
        query = query.filter(Listing.status == status)
    if category:
        query = query.filter(Listing.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Listing.title.ilike(search_filter),
                Listing.description.ilike(search_filter)
            )
        )
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    # Order by created_at descending
    query = query.order_by(desc(Listing.created_at))

    # Paginate
    listings = query.offset(skip).limit(limit).all()

    return listings


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    """Get a specific listing by ID"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Increment view count
    listing.views += 1
    db.commit()

    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_data: ListingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new listing"""
    listing = Listing(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=listing_data.title,
        description=listing_data.description,
        price=listing_data.price,
        category=listing_data.category,
        condition=listing_data.condition,
        location=listing_data.location,
        images=listing_data.images,
        status=ListingStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)

    return listing


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: str,
    listing_data: ListingUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a listing"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Check ownership
    if listing.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this listing"
        )

    # Update fields
    update_data = listing_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)

    listing.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(listing)

    return listing


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a listing"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Check ownership
    if listing.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this listing"
        )

    db.delete(listing)
    db.commit()

    return None


@router.get("/user/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's listings"""
    listings = db.query(Listing).filter(
        Listing.user_id == current_user.id
    ).order_by(desc(Listing.created_at)).all()

    return listings
