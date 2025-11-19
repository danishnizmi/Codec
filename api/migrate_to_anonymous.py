"""
Database Migration Script: Convert to Anonymous Marketplace
Migrates from authenticated user-based listings to anonymous marketplace

Run with: python -m app.migrate_to_anonymous
"""

from sqlalchemy import create_engine, text
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def migrate():
    """Run database migration"""
    engine = create_engine(settings.DATABASE_URL)

    logger.info("Starting database migration to anonymous marketplace...")

    with engine.connect() as conn:
        try:
            # Drop old tables that are no longer needed
            logger.info("Dropping old tables...")

            drop_tables = [
                "DROP TABLE IF EXISTS favorites CASCADE;",
                "DROP TABLE IF EXISTS messages CASCADE;",
                "DROP TABLE IF EXISTS users CASCADE;",
            ]

            for sql in drop_tables:
                conn.execute(text(sql))
                logger.info(f"Executed: {sql}")

            # Drop old listings table
            conn.execute(text("DROP TABLE IF EXISTS listings CASCADE;"))
            logger.info("Dropped old listings table")

            # Create new listings table with anonymous schema
            create_listings_sql = """
            CREATE TABLE listings (
                id VARCHAR PRIMARY KEY,
                title VARCHAR NOT NULL,
                description TEXT NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                currency VARCHAR DEFAULT 'ED' NOT NULL,
                category VARCHAR NOT NULL,
                condition VARCHAR DEFAULT 'USED',
                status VARCHAR DEFAULT 'ACTIVE' NOT NULL,
                location VARCHAR NOT NULL,
                seller_name VARCHAR NOT NULL,
                images TEXT[],
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_listings_category ON listings(category);
            CREATE INDEX idx_listings_status ON listings(status);
            CREATE INDEX idx_listings_location ON listings(location);
            CREATE INDEX idx_listings_created_at ON listings(created_at);
            """

            for statement in create_listings_sql.split(';'):
                statement = statement.strip()
                if statement:
                    conn.execute(text(statement))
                    logger.info(f"Executed: {statement[:50]}...")

            # Insert sample data
            logger.info("Inserting sample listings...")

            sample_data = """
            INSERT INTO listings (id, title, description, price, currency, category, condition, status, location, seller_name, images, views, created_at, updated_at)
            VALUES
            ('1', 'Arasaka Mk.IV Cyberdeck (Refurbished)', 'Pre-owned Arasaka Mk.IV. Slight neural latency issues but fully jailbroken. Comes with IceBreaker v2.0 pre-installed. Perfect for aspiring netrunners on a budget.', 1200, 'ED', 'HARDWARE', 'USED', 'ACTIVE', 'Night City, Sector 4', 'NetRunner_99', ARRAY['https://picsum.photos/seed/cyberdeck/400/300'], 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('2', 'Kiroshi Optics - Basic Model', 'Standard Kiroshi optics. Cleaned and sterilized. HUD functionality intact. Previous owner... no longer needs them.', 450, 'ED', 'CYBERWARE', 'GOOD', 'ACTIVE', 'Watson', 'RipperDoc_T', ARRAY['https://picsum.photos/seed/eye/400/300'], 128, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('3', 'Yaiba Kusanagi CT-3X Bike', 'The fastest bike on the streets. Custom neon underglow. Engine tuned for max torque. Serious buyers only.', 22000, 'ED', 'VEHICLES', 'LIKE_NEW', 'ACTIVE', 'Westbrook', 'SpeedDemon', ARRAY['https://picsum.photos/seed/bike/400/300'], 234, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('4', 'Encrypted Datashard (Top Secret)', 'Encrypted shard found in a corpo trash bin. High-level encryption. Could be trash, could be credits. Sold as-is.', 5000, 'ED', 'SOFTWARE', 'NEW', 'ACTIVE', 'Pacifica', 'Glitch0', ARRAY['https://picsum.photos/seed/chip/400/300'], 89, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('5', 'Mantis Blades - Street Modified', 'Militech mantis blades with custom mods. Razor sharp, lightning fast. Some wear on the chrome but fully functional. No questions asked.', 3500, 'ED', 'WEAPONS', 'GOOD', 'ACTIVE', 'Kabuki', 'BladeRunner_X', ARRAY['https://picsum.photos/seed/blades/400/300'], 176, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('6', 'Samurai Band Jacket (Replica)', 'High-quality replica of the legendary Samurai band jacket. Chrome detailing, weathered look. Size L. Perfect for cruising the streets in style.', 800, 'ED', 'CLOTHING', 'LIKE_NEW', 'ACTIVE', 'Japantown', 'StyleRunner', ARRAY['https://picsum.photos/seed/jacket/400/300'], 92, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('7', 'Neural Interface Cleaning Service', 'Professional neural interface and cyberware maintenance. 10 years experience. Same-day service available. Keep your chrome running smooth.', 150, 'ED', 'SERVICES', 'NEW', 'ACTIVE', 'City Center', 'DocTech_42', ARRAY['https://picsum.photos/seed/service/400/300'], 58, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

            ('8', 'Vintage 2020s Gaming Console', 'Found this relic in an abandoned apartment. Still works! Comes with controller and some old games. Collectors item.', 250, 'ED', 'MISC', 'FAIR', 'ACTIVE', 'Heywood', 'Salvager_Joe', ARRAY['https://picsum.photos/seed/console/400/300'], 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            """

            conn.execute(text(sample_data))
            logger.info("Sample data inserted successfully")

            # Commit transaction
            conn.commit()

            logger.info("✓ Migration completed successfully!")
            logger.info("CyberBazaar is ready for Year 2077")

        except Exception as e:
            logger.error(f"Migration failed: {e}")
            conn.rollback()
            raise


if __name__ == "__main__":
    migrate()
