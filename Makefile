# Makefile for hotel services project

.PHONY: build start-backend stop start-frontend run clear-backend

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

# Cean all containers, volumes, images, and frontend node modules
clean-all:
	docker-compose down -v --rmi all --remove-orphans
	cd frontend && rm -rf node_modules