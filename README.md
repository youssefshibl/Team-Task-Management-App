# Task Management System

A full-stack task management application with role-based access control, built with NestJS (backend) and React (frontend).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Seeding](#database-seeding)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## 🎯 Overview

This is a complete task management system with two user roles:

- **Team Lead**: Can manage users, create/edit/delete tasks, and assign tasks to team members
- **Member**: Can view assigned tasks and update their status

## ✨ Features

### Authentication
- ✅ JWT-based authentication
- ✅ Role-based access control (Team Lead / Member)
- ✅ Protected routes (frontend and backend)
- ✅ Automatic token management
- ✅ Persistent authentication

### Team Lead Dashboard
- ✅ View all team members
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ Searchable member dropdown when assigning tasks
- ✅ View all tasks in table format

### Member Dashboard
- ✅ View assigned tasks in card layout
- ✅ Update task status (Pending → In Progress → Done)
- ✅ Filter tasks by status
- ✅ See task details and assignment information

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Logging**: Winston
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI**: Custom CSS with modern design
- **UI Components**: Chakra UI (for searchable select)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to run the entire application:

```bash
# Build and start all services
docker-compose up -d

# Seed the database
docker-compose exec backend npm run seed:prod

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

### Option 2: Local Development

#### Prerequisites
- Node.js 18+ and npm
- MongoDB (running locally or via Docker)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start MongoDB (if using Docker)
docker-compose up -d mongodb

# Create .env file (see Environment Variables section)
# Then seed the database
npm run seed

# Start development server
npm run start:dev
```

Backend runs on `http://localhost:3000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🐳 Docker Setup

### Services

The Docker Compose setup includes:

1. **mongodb** - MongoDB database (port 27017)
2. **backend** - NestJS backend API (port 3000)
3. **frontend** - React frontend with Nginx (port 8080)

### Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Seed database
docker-compose exec backend npm run seed:prod

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

For detailed Docker documentation, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## 💻 Development Setup

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Development mode (with hot reload)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Seed database
npm run seed
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
task1/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Authentication module
│   │   │   └── task/        # Task management module
│   │   ├── lib/
│   │   │   ├── entity/      # Database entities
│   │   │   ├── guards/      # Auth guards
│   │   │   ├── decorators/  # Custom decorators
│   │   │   ├── services/    # Shared services
│   │   │   ├── repo/        # Repository pattern
│   │   │   └── filters/     # Exception filters
│   │   ├── seeders/         # Database seeders
│   │   └── main.ts          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── api/             # API client & endpoints
│   │   ├── components/      # React components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS files
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
│
├── docker-compose.yaml       # Docker Compose configuration
├── README.md                 # This file
├── DOCKER_SETUP.md          # Docker documentation
├── SEEDING_IN_DOCKER.md     # Database seeding guide
└── PROJECT_SUMMARY.md       # Project overview
```

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:3000`
- **Docker**: `http://localhost:3000`
- **All routes are prefixed with `/api`**

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "teamlead1@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "teamlead1@example.com",
    "name": "Team Lead 1",
    "role": "team_lead"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Members (Team Lead only)
```http
GET /api/auth/members
Authorization: Bearer <token>
```

#### Get Leaders
```http
GET /api/auth/leaders
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task (Team Lead only)
```http
POST /api/tasks/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Task Name",
  "description": "Task Description",
  "assignedTo": "member-id"
}
```

#### Get All Tasks (Team Lead only)
```http
GET /api/tasks/get-all?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Task by ID (Team Lead only)
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task (Team Lead only)
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Task Name",
  "description": "Updated Description",
  "assignedTo": "member-id"
}
```

#### Delete Task (Team Lead only)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Get Assigned Tasks (Member only)
```http
GET /api/tasks/assigned-to-me?page=1&limit=10
Authorization: Bearer <token>
```

#### Update Task Status (Member only)
```http
PUT /api/tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T12:00:00.000Z"
}
```

For complete API documentation, see [backend/API_ENDPOINTS_SUMMARY.md](./backend/API_ENDPOINTS_SUMMARY.md).

## 🔐 Authentication

### Demo Credentials

#### Team Lead
- **Email**: `teamlead1@example.com`
- **Password**: `password123`

#### Member
- **Email**: `member1@example.com`
- **Password**: `password123`

### How Authentication Works

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically attached to all API requests
5. Backend validates token on protected routes
6. On 401 error, frontend redirects to login

### Protected Routes

**Frontend:**
- `/member` - Requires Member role
- `/leader/*` - Requires Team Lead role

**Backend:**
- All task endpoints require authentication
- Role-based guards enforce permissions

## 🌱 Database Seeding

### Local Development

```bash
cd backend
npm run seed
```

### Docker

```bash
docker-compose exec backend npm run seed:prod
```

### Seeder Configuration

Configure via environment variables:

```env
SEED_LEADERS_COUNT=5        # Number of team leaders
SEED_MEMBERS_COUNT=50       # Number of members
SEED_TASKS_PER_MEMBER=10   # Tasks per member
```

### What Gets Created

- **Team Leaders**: `teamlead1@example.com` through `teamlead{N}@example.com`
- **Team Members**: `member1@example.com` through `member{N}@example.com`
- **Tasks**: Assigned to members with various statuses
- **Password**: All users have password `password123`

The seeder is idempotent - safe to run multiple times.

For detailed seeding instructions, see [SEEDING_IN_DOCKER.md](./SEEDING_IN_DOCKER.md).

## 🔧 Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskdb
# Or for Docker:
# MONGODB_URI=mongodb://admin:admin@mongodb:27017/tasks?authSource=admin

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production

# Server Configuration
PORT=3000

# Seeder Configuration (optional)
SEED_LEADERS_COUNT=5
SEED_MEMBERS_COUNT=50
SEED_TASKS_PER_MEMBER=10
```

### Frontend

Create a `.env` file in the `frontend/` directory (optional):

```env
# API URL (optional - defaults to http://localhost:3000 in dev)
VITE_API_URL=http://localhost:3000
```

For Docker, the frontend automatically uses `/api` proxy.

For complete environment variable documentation, see [backend/ENV_VARIABLES.md](./backend/ENV_VARIABLES.md).

## 🐛 Troubleshooting

### Port Already in Use

**Backend (port 3000):**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
# Or on Linux:
sudo netstat -tulpn | grep :3000
```

**Frontend (port 5173):**
Vite will automatically use the next available port.

**Docker (port 8080):**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :8080
# Or change the port in docker-compose.yaml
```

### MongoDB Connection Issues

**Local:**
- Ensure MongoDB is running: `mongod` or `docker-compose up -d mongodb`
- Check connection string in `.env`

**Docker:**
```bash
# Check MongoDB container
docker-compose ps mongodb
docker-compose logs mongodb
```

### Module Not Found

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

- Clear browser localStorage: Open console → `localStorage.clear()`
- Check token in localStorage: `localStorage.getItem('token')`
- Verify backend is running and accessible
- Check CORS configuration

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild
docker-compose up -d --build

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

**Health check failing:**
- Wait for services to fully start (especially MongoDB)
- Check service logs for errors
- Verify environment variables

## 📖 Documentation

### Main Documentation Files

- **[README.md](./README.md)** - This file (overview and quick reference)
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker setup guide
- **[SEEDING_IN_DOCKER.md](./SEEDING_IN_DOCKER.md)** - Database seeding guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Detailed project overview
- **[FULL_PROJECT_SETUP.md](./FULL_PROJECT_SETUP.md)** - Complete setup instructions

### Backend Documentation

- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[backend/API_ENDPOINTS_SUMMARY.md](./backend/API_ENDPOINTS_SUMMARY.md)** - API endpoints reference
- **[backend/ENV_VARIABLES.md](./backend/ENV_VARIABLES.md)** - Environment variables guide
- **[backend/TESTING.md](./backend/TESTING.md)** - Testing documentation

### Frontend Documentation

- **[frontend/README.md](./frontend/README.md)** - Frontend documentation
- **[frontend/SETUP_GUIDE.md](./frontend/SETUP_GUIDE.md)** - Frontend setup guide
- **[frontend/QUICK_START.md](./frontend/QUICK_START.md)** - Quick start guide

## 🎨 UI Features

- ✅ Modern, responsive design
- ✅ Gradient backgrounds and smooth transitions
- ✅ Color-coded status badges
- ✅ Searchable member dropdown
- ✅ Modal dialogs for task creation/editing
- ✅ Card-based layouts for tasks
- ✅ Table view for task management
- ✅ Mobile-friendly responsive design

## 🚀 Production Deployment

### Backend

1. Set production environment variables
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Run: `npm run start:prod`

### Frontend

1. Update API URL in environment
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, AWS S3, etc.)

### Docker Production

```bash
# Build production images
docker-compose build

# Start services
docker-compose up -d

# Set production environment variables in docker-compose.yaml
```

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the documentation files
3. Check service logs
4. Verify environment variables

---

**Built with ❤️ using NestJS and React**

