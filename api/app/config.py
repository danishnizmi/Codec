"""Application configuration using Pydantic Settings"""
from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings"""

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # AWS S3
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: str

    # Deployment
    EC2_PUBLIC_IP: Optional[str] = None

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    # Environment
    ENVIRONMENT: str = "production"

    @property
    def cors_origins_list(self) -> List[str]:
        """
        Parse CORS origins from comma-separated string.
        Automatically includes EC2 IP if configured.
        """
        origins = [origin.strip() for origin in self.CORS_ORIGINS.split(',')]

        # Auto-add EC2 IP to CORS if configured
        if self.EC2_PUBLIC_IP and self.EC2_PUBLIC_IP != "YOUR_EC2_IP":
            ec2_origin = f"http://{self.EC2_PUBLIC_IP}"
            if ec2_origin not in origins:
                origins.append(ec2_origin)

        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
