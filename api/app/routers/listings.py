"""
Listings routes - Anonymous marketplace
No authentication required, content moderation via AWS Bedrock
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import List, Optional, Dict
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
import logging

from ..database import get_db
from ..models import Listing, ListingStatus, Category
from ..schemas import ListingCreate, ListingUpdate, ListingResponse, ModerationResult
from ..content_moderation import get_moderation_service
from ..config import settings

router = APIRouter(prefix="/listings", tags=["Listings"])
logger = logging.getLogger(__name__)

# Initialize S3 client
try:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )
except Exception as e:
    logger.warning(f"S3 client initialization failed: {e}. Image uploads will not work.")
    s3_client = None


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "marketplace": "CyberBazaar",
        "version": "1.0.0",
        "authentication": "disabled",
        "content_moderation": "enabled"
    }


@router.post("/upload-urls", status_code=status.HTTP_200_OK)
def get_s3_upload_urls(
    file_count: int = Query(..., ge=1, le=10)
) -> Dict[str, List[Dict[str, str]]]:
    """
    Generate presigned S3 URLs for image uploads.
    No authentication required - anyone can upload images.

    Args:
        file_count: Number of upload URLs to generate (1-10)

    Returns:
        Dictionary with upload URLs and file keys
    """
    if not s3_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image upload service is currently unavailable"
        )

    upload_urls = []

    try:
        for i in range(file_count):
            # Generate unique file key
            file_key = f"listings/{uuid.uuid4()}.jpg"

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
        logger.error(f"Failed to generate upload URLs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate upload URLs: {str(e)}"
        )

    return {"upload_urls": upload_urls}


@router.get("", response_model=List[ListingResponse])
def get_listings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[Category] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all active listings with optional filters.
    Public endpoint - no authentication required.
    """
    query = db.query(Listing).filter(Listing.status == ListingStatus.ACTIVE)

    # Apply filters
    if category:
        query = query.filter(Listing.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Listing.title.ilike(search_filter),
                Listing.description.ilike(search_filter),
                Listing.seller_name.ilike(search_filter)
            )
        )
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)
    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))

    # Order by created_at descending (newest first)
    query = query.order_by(desc(Listing.created_at))

    # Paginate
    listings = query.offset(skip).limit(limit).all()

    return listings


@router.get("/categories", response_model=List[str])
def get_categories():
    """Get all available categories for the marketplace"""
    return [category.value for category in Category]


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    """
    Get a specific listing by ID.
    Increments view count each time.
    """
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.status == ListingStatus.ACTIVE
    ).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or has been removed"
        )

    # Increment view count
    listing.views += 1
    db.commit()

    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new listing - NO AUTHENTICATION REQUIRED.
    Content is automatically moderated using AWS Bedrock AI.

    Listings with harmful, illegal, or inappropriate content will be rejected.
    """
    # Content moderation check
    try:
        moderation_service = get_moderation_service(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

        moderation_result = moderation_service.moderate_content(
            title=listing_data.title,
            description=listing_data.description
        )

        if not moderation_result["approved"]:
            logger.warning(
                f"Listing rejected by content moderation: {moderation_result['reason']}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "Content moderation failed",
                    "reason": moderation_result["reason"],
                    "confidence": moderation_result["confidence"]
                }
            )

        logger.info(
            f"Listing approved by content moderation (confidence: {moderation_result['confidence']})"
        )

    except HTTPException:
        raise
    except Exception as e:
        # If moderation service fails, log and continue (fail open)
        logger.error(f"Content moderation error: {e}")
        logger.warning("Allowing listing creation due to moderation service failure")

    # Create the listing
    listing = Listing(
        id=str(uuid.uuid4()),
        title=listing_data.title,
        description=listing_data.description,
        price=listing_data.price,
        currency=listing_data.currency,
        category=listing_data.category,
        condition=listing_data.condition,
        location=listing_data.location,
        seller_name=listing_data.seller_name,
        images=listing_data.images,
        status=ListingStatus.ACTIVE,
        views=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)

    logger.info(f"New listing created: {listing.id} by {listing.seller_name}")

    return listing


@router.post("/moderate", response_model=ModerationResult)
def moderate_content(
    title: str = Query(..., min_length=3, max_length=200),
    description: str = Query(..., min_length=10, max_length=5000)
):
    """
    Test content moderation endpoint.
    Check if content would be approved before submitting a listing.
    """
    try:
        moderation_service = get_moderation_service(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

        result = moderation_service.moderate_content(
            title=title,
            description=description
        )

        return ModerationResult(**result)

    except Exception as e:
        logger.error(f"Moderation endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Content moderation service unavailable"
        )


@router.post("/generate-listing")
def generate_listing_ai(
    item_type: str = Query(..., description="What are you selling?"),
    category: Category = Query(..., description="Category"),
    key_details: str = Query(default="", description="Any specific details about the item"),
):
    """
    AI-powered listing generator.
    Helps users create compelling listings with proper descriptions.
    """
    try:
        moderation_service = get_moderation_service(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

        prompt = f"""You are an AI assistant for CyberBazaar, a cyberpunk marketplace in Year 2077.

Generate a compelling listing for the following item:
- Item Type: {item_type}
- Category: {category.value}
- Additional Details: {key_details if key_details else "None provided"}

Create a listing that:
1. Has a catchy, cyberpunk-themed title (max 100 chars)
2. Includes an engaging description (100-300 words)
3. Uses cyberpunk/futuristic language and terminology
4. Mentions condition, features, and why someone should buy it
5. Is professional but fits the 2077 street market vibe

Respond ONLY in this JSON format:
{{
  "title": "your generated title here",
  "description": "your generated description here",
  "suggested_price": 999,
  "suggested_condition": "USED",
  "suggested_location": "Night City District"
}}"""

        # Call Bedrock to generate listing
        import json
        bedrock_runtime = boto3.client(
            service_name='bedrock-runtime',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ],
            "inferenceConfig": {
                "maxTokens": 1000,
                "temperature": 0.8  # Creative but not too random
            }
        }

        response = bedrock_runtime.invoke_model(
            modelId="us.amazon.nova-pro-v1:0",
            body=json.dumps(request_body)
        )

        response_body = json.loads(response['body'].read())
        ai_response = response_body['output']['message']['content'][0]['text']

        # Parse JSON from response
        ai_response = ai_response.strip()
        if ai_response.startswith("```"):
            lines = ai_response.split("\n")
            ai_response = "\n".join(lines[1:-1])

        generated_data = json.loads(ai_response)

        logger.info(f"AI generated listing for: {item_type}")

        return {
            "success": True,
            "generated_title": generated_data.get("title", ""),
            "generated_description": generated_data.get("description", ""),
            "suggested_price": generated_data.get("suggested_price", 0),
            "suggested_condition": generated_data.get("suggested_condition", "USED"),
            "suggested_location": generated_data.get("suggested_location", "Night City"),
        }

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI generation failed - invalid response format"
        )
    except Exception as e:
        logger.error(f"AI listing generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI listing generator unavailable: {str(e)}"
        )


@router.patch("/{listing_id}/mark-sold", response_model=ListingResponse)
def mark_as_sold(listing_id: str, db: Session = Depends(get_db)):
    """
    Mark a listing as sold.
    No authentication required - anyone can mark as sold.
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    listing.status = ListingStatus.SOLD
    listing.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(listing)

    logger.info(f"Listing marked as sold: {listing.id}")

    return listing
