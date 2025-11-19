.PHONY: help build up down restart logs clean backup restore

help:
	@echo "Marketplace Management Commands:"
	@echo "  make build     - Build all containers"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - View logs (all services)"
	@echo "  make clean     - Remove all containers and volumes"
	@echo "  make backup    - Backup database"
	@echo "  make restore   - Restore database from backup.sql"
	@echo "  make status    - Check service status"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Services starting... Check status with 'make status'"

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

status:
	docker-compose ps

clean:
	docker-compose down -v
	@echo "Warning: All data will be lost!"

backup:
	@echo "Creating database backup..."
	docker-compose exec -T db pg_dump -U postgres marketplace > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created: backup_$$(date +%Y%m%d_%H%M%S).sql"

restore:
	@echo "Restoring database from backup.sql..."
	docker-compose exec -T db psql -U postgres marketplace < backup.sql
	@echo "Database restored"

# Development commands
dev-api:
	cd api && uvicorn app.main:app --reload --host 0.0.0.0 --port 4000

dev-web:
	cd web && npm run dev

install-web:
	cd web && npm install

install-api:
	cd api && pip install -r requirements.txt
