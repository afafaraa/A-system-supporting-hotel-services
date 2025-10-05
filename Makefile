# Makefile for hotel services project

.PHONY: build start-backend stop start-frontend run clear-backend

# Build and start the backend service in container
build-backend:
	docker-compose build backend
	docker-compose up backend

# Build and start the MongoDB in container
build-mongo:
	docker-compose build mongo
	docker-compose up -d mongo

# Start the frontend service
start-frontend:
	cd frontend && npm run dev

# Run both backend and frontend services
run:
	docker-compose up -d backend
	cd frontend && npm run dev

# Start backend and db in container
start-backend:
	docker-compose build mongo
	docker-compose up -d mongo
	docker-compose build backend
	docker-compose up backend

# Clean backend containers and volumes
clean-backend:
	docker-compose down -v

