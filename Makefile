# Makefile for hotel services project

.PHONY: build start-backend stop start-frontend run clear-backend dev prod

# DEV ENVIRONMENT COMMANDS (frontend on port 5173, no frontend container)
dev-up:
	docker-compose -f docker-compose.dev.yml up -d

dev-up-build:
	docker-compose -f docker-compose.dev.yml up -d --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-frontend:
	cd frontend && npm run dev

dev: dev-up-build dev-frontend

# PROD ENVIRONMENT COMMANDS (frontend on port 80, all in containers)
prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-up-build:
	docker-compose -f docker-compose.prod.yml up -d --build

prod-down:
	docker-compose -f docker-compose.prod.yml down

# Default prod commands
up: prod-up

up-build: prod-up-build

down: prod-down

# Build and start the backend service in container
run-backend-only:
	docker-compose build backend
	docker-compose up backend

# Build and start the MongoDB in container
run-mongo-only:
	docker-compose build mongo
	docker-compose up -d mongo

# Start the frontend service
start-frontend:
	cd frontend && npm run dev

# Start backend and db in container
start-backend: run-mongo-only run-backend-only

# Run both backend and frontend services
run: start-backend start-frontend

# Clean backend containers and volumes
clean-backend:
	docker-compose down -v --rmi all --remove-orphans

# Clean db
clean-mongo:
	docker-compose down -v --remove-orphans mongo

# Clean all containers, volumes, images, and frontend node modules (works for both dev and prod)
clean-all:
	docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
	docker-compose -f docker-compose.prod.yml down -v --rmi all --remove-orphans
	docker-compose down -v --rmi all --remove-orphans
	cd frontend && rm -rf node_modules