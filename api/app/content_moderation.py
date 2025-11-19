"""
Content Moderation Service using AWS Bedrock
Filters harmful, offensive, or inappropriate content from user submissions
"""
import json
import logging
from typing import Dict, Optional
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class ContentModerationService:
    """
    Content moderation service using AWS Bedrock AI models.
    Uses Claude 3 Haiku for fast, cost-effective content analysis.
    """

    def __init__(
        self,
        aws_access_key_id: Optional[str] = None,
        aws_secret_access_key: Optional[str] = None,
        region_name: str = "us-east-1"
    ):
        """
        Initialize the content moderation service with AWS Bedrock client.

        Args:
            aws_access_key_id: AWS access key (optional, uses env vars if not provided)
            aws_secret_access_key: AWS secret key (optional, uses env vars if not provided)
            region_name: AWS region for Bedrock service
        """
        try:
            self.bedrock_runtime = boto3.client(
                service_name='bedrock-runtime',
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
                region_name=region_name
            )
            self.model_id = "anthropic.claude-3-haiku-20240307-v1:0"
            logger.info(f"Initialized ContentModerationService with model: {self.model_id}")
        except Exception as e:
            logger.error(f"Failed to initialize AWS Bedrock client: {e}")
            raise

    def _call_bedrock_model(self, prompt: str) -> str:
        """
        Make a call to AWS Bedrock Claude model.

        Args:
            prompt: The prompt to send to the model

        Returns:
            Model response text
        """
        try:
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 200,
                "temperature": 0.0,  # Deterministic responses for content moderation
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }

            response = self.bedrock_runtime.invoke_model(
                modelId=self.model_id,
                body=json.dumps(request_body)
            )

            response_body = json.loads(response['body'].read())
            return response_body['content'][0]['text']

        except ClientError as e:
            logger.error(f"AWS Bedrock API error: {e}")
            # Fail open - if moderation service is down, allow content but log warning
            logger.warning("Content moderation unavailable, allowing content")
            return "APPROVED"
        except Exception as e:
            logger.error(f"Unexpected error calling Bedrock: {e}")
            # Fail open for better user experience
            return "APPROVED"

    def moderate_content(self, title: str, description: str) -> Dict[str, any]:
        """
        Moderate listing content for harmful or inappropriate material.

        Checks for:
        - Hate speech, discrimination, slurs
        - Explicit violence or gore
        - Sexual content or exploitation
        - Illegal activities (drugs, weapons, stolen goods)
        - Scams or fraud
        - Personal information exposure

        Args:
            title: Listing title
            description: Listing description

        Returns:
            Dict with:
                - approved: bool (True if content is safe)
                - reason: str (explanation if rejected)
                - confidence: str (HIGH, MEDIUM, LOW)
        """
        prompt = f"""You are a content moderation system for a cyberpunk-themed online marketplace called CyberBazaar (like Craigslist).

Analyze the following listing submission for harmful, illegal, or inappropriate content.

TITLE: {title}
DESCRIPTION: {description}

REJECT if the content contains:
- Hate speech, discrimination, racial slurs, or bigotry
- Explicit violence, gore, or threats
- Sexual content, pornography, or exploitation
- Illegal items (drugs, weapons, stolen goods, counterfeit items)
- Scams, fraud, or pyramid schemes
- Personal information (SSNs, credit cards, passwords)
- Extreme profanity directed at individuals

APPROVE if:
- It's a legitimate product/service listing
- Uses cyberpunk/sci-fi themed language (this is encouraged!)
- Contains mild profanity as flavor text
- Describes fictional cyberpunk items (cyberware, datashards, etc.)

Respond ONLY in this exact JSON format:
{{
  "decision": "APPROVED" or "REJECTED",
  "reason": "brief explanation",
  "confidence": "HIGH" or "MEDIUM" or "LOW"
}}"""

        try:
            response_text = self._call_bedrock_model(prompt)

            # Parse JSON response
            # Handle cases where model adds markdown code blocks
            response_text = response_text.strip()
            if response_text.startswith("```"):
                # Remove markdown code block formatting
                lines = response_text.split("\n")
                response_text = "\n".join(lines[1:-1])

            response_json = json.loads(response_text)

            decision = response_json.get("decision", "APPROVED").upper()
            reason = response_json.get("reason", "")
            confidence = response_json.get("confidence", "MEDIUM").upper()

            result = {
                "approved": decision == "APPROVED",
                "reason": reason if decision == "REJECTED" else "Content approved",
                "confidence": confidence
            }

            if not result["approved"]:
                logger.info(f"Content REJECTED: {reason} (confidence: {confidence})")

            return result

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse moderation response: {e}")
            logger.error(f"Raw response: {response_text}")
            # Fail open - if we can't parse, allow the content
            return {
                "approved": True,
                "reason": "Moderation parsing error, content allowed",
                "confidence": "LOW"
            }
        except Exception as e:
            logger.error(f"Content moderation error: {e}")
            # Fail open for better user experience
            return {
                "approved": True,
                "reason": "Moderation service unavailable, content allowed",
                "confidence": "LOW"
            }

    def moderate_batch(self, listings: list) -> list:
        """
        Moderate multiple listings in batch.

        Args:
            listings: List of dicts with 'title' and 'description' keys

        Returns:
            List of moderation results in same order
        """
        results = []
        for listing in listings:
            result = self.moderate_content(
                title=listing.get("title", ""),
                description=listing.get("description", "")
            )
            results.append(result)
        return results


# Singleton instance
_moderation_service: Optional[ContentModerationService] = None


def get_moderation_service(
    aws_access_key_id: Optional[str] = None,
    aws_secret_access_key: Optional[str] = None,
    region_name: str = "us-east-1"
) -> ContentModerationService:
    """
    Get or create the content moderation service singleton.

    Args:
        aws_access_key_id: AWS access key (only used on first call)
        aws_secret_access_key: AWS secret key (only used on first call)
        region_name: AWS region (only used on first call)

    Returns:
        ContentModerationService instance
    """
    global _moderation_service

    if _moderation_service is None:
        _moderation_service = ContentModerationService(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )

    return _moderation_service
