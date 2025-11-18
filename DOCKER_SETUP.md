# Docker Setup Guide

This guide explains how to run the Task Management application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Project Structure

```
Team-Task-Management-App//
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── ...
└── docker-compose.yaml
```

## Services

The Docker Compose setup includes three services:

1. **mongodb** - MongoDB database (port 27017)
2. **backend** - NestJS backend API (port 3000)
3. **frontend** - React frontend with Nginx (port 8080)

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d
```

This command will:
- Build the backend and frontend Docker images
- Start MongoDB, backend, and frontend services
- Create a Docker network for service communication

### 2. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 3. Stop Services

```bash
docker-compose down
```

### 4. Stop and Remove Volumes

```bash
docker-compose down -v
```

**Warning**: This will delete all database data!

## Accessing the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## Environment Variables

### Backend Environment Variables

The backend service uses the following environment variables (set in `docker-compose.yaml`):

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 3000)
- `SEED_LEADERS_COUNT`: Number of leaders to seed (default: 5)
- `SEED_MEMBERS_COUNT`: Number of members to seed (default: 50)
- `SEED_TASKS_PER_MEMBER`: Number of tasks per member (default: 10)

### Frontend Environment Variables

The frontend uses the `VITE_API_URL` environment variable to configure the API endpoint. In Docker, the frontend is configured to use the backend service through nginx proxy at `/api`.

For local development, you can create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## Database Seeding

To seed the database with initial data, you can run:

```bash
# Run seed command in the backend container
docker-compose exec backend npm run seed:prod
```

Or if you prefer to use the compiled JavaScript directly:

```bash
docker-compose exec backend node dist/seeders/seed.js
```

**Note**: The seed command will create:
- Team leaders (default: 5, configurable via `SEED_LEADERS_COUNT`)
- Team members (default: 50, configurable via `SEED_MEMBERS_COUNT`)
- Tasks for each member (default: 10 per member, configurable via `SEED_TASKS_PER_MEMBER`)

All users have the password: `password123`

## Rebuilding Services

If you make changes to the code, rebuild the services:

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build
```

## Development vs Production

### Development

For development, you may want to:
- Mount source code as volumes for hot-reloading
- Use development dependencies
- Enable debug logging

### Production

The current setup is optimized for production:
- Multi-stage builds for smaller images
- Production dependencies only
- Nginx for serving static files
- Health checks for service monitoring

## Troubleshooting

### Services Not Starting

1. Check if ports are already in use:
   ```bash
   # Check port 8080 (frontend)
   lsof -i :8080
   # Or on Linux:
   sudo netstat -tulpn | grep :8080
   # Or on Linux:
   sudo ss -tulpn | grep :8080
   
   # Check port 3000 (backend)
   lsof -i :3000
   
   # Check port 27017 (MongoDB)
   lsof -i :27017
   ```
   
   If a port is in use, you can either:
   - Stop the service using that port
   - Change the port mapping in `docker-compose.yaml` (e.g., change `8080:80` to `8081:80`)

2. Check service logs:
   ```bash
   docker-compose logs [service-name]
   ```

### Database Connection Issues

1. Ensure MongoDB is healthy:
   ```bash
   docker-compose ps mongodb
   ```

2. Check MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

### Frontend Not Connecting to Backend

1. Check if backend is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check nginx configuration in the frontend container:
   ```bash
   docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
   ```

## Health Checks

All services include health checks:

- **MongoDB**: Checks database connectivity
- **Backend**: Checks `/health` endpoint
- **Frontend**: Nginx automatically handles health

## Volumes

- `mongodb_data`: Persistent storage for MongoDB data
- `./backend/logs`: Backend application logs (mounted from host)

## Networks

All services are connected to the `tasks-network` bridge network, allowing them to communicate using service names (e.g., `backend`, `mongodb`, `frontend`).

## Security Notes

⚠️ **Important**: The default `JWT_SECRET` in `docker-compose.yaml` is for development only. For production:

1. Use a strong, random secret key
2. Store secrets in environment files or secret management systems
3. Never commit secrets to version control
4. Use Docker secrets or environment variable files

## Additional Commands

```bash
# Execute command in running container
docker-compose exec backend npm run seed
docker-compose exec frontend ls -la

# View running containers
docker-compose ps

# Restart a specific service
docker-compose restart backend

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

