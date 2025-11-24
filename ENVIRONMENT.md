# Environment Configuration Guide

This project supports two environments: **Development (dev)** and **Production (prod)**.

## Development Environment

**Characteristics:**
- Frontend runs locally on port 5173 (Vite dev server)
- Backend and MongoDB run in Docker containers
- Backend configured to accept CORS from `http://localhost:5173`
- Hot reload enabled for frontend development

**Commands:**
```bash
# Start backend and MongoDB in containers, then start frontend dev server
make dev

# Or manually:
make dev-up-build     # Start backend + MongoDB with rebuild
make dev-frontend     # Start frontend dev server (separate terminal)

# Stop containers
make dev-down
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- MongoDB: localhost:27017

## Production Environment

**Characteristics:**
- All services (frontend, backend, MongoDB) run in Docker containers
- Frontend served via Nginx on port 80
- Optimized production builds

**Commands:**
```bash
# Start all services in containers
make prod-up-build

# Or use default commands (they point to prod):
make up-build

# Stop containers
make prod-down
# or
make down
```

**Access:**
- Frontend: http://localhost:80
- Backend: http://localhost:8080
- MongoDB: localhost:27017

## Configuration Files

- `docker-compose.dev.yml` - Development environment (no frontend container)
- `docker-compose.prod.yml` - Default file (mirrors prod configuration)

## Environment Variables

The backend automatically receives the correct frontend URL:
- **Dev**: `APP_FRONTEND_URL=http://localhost:5173`
- **Prod**: `APP_FRONTEND_URL=http://localhost:80`

