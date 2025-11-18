# Task Management System - Complete Setup Guide

This is a full-stack task management application with a NestJS backend and React frontend.

> **Note**: For the most up-to-date information, see the main [README.md](./README.md)

## Project Structure

```
Team-Task-Management-App//
├── backend/           # Node.js + NestJS API
│   ├── src/          # Source code
│   ├── package.json
│   └── ...
└── frontend/         # React + TypeScript app
    ├── src/          # Source code
    ├── package.json
    └── ...
```

## Prerequisites

### Option 1: Docker (Recommended - Easiest)

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

### Option 2: Local Development

- Node.js 18+ and npm
- MongoDB (running locally or via Docker)

## Quick Start with Docker (One Command)

The fastest way to get started:

```bash
# Navigate to project root
cd /home/shebl/Team-Task-Management-App/

# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# Seed the database with demo users
docker-compose exec backend npm run seed:prod
```

That's it! The application is now running:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

**Note**: All API routes are prefixed with `/api` (e.g., `/api/auth/login`)

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## Local Development Setup

If you prefer to run without Docker:

### 1. Clone and Navigate

```bash
cd /home/shebl/Team-Task-Management-App/
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)

# Start MongoDB (if using Docker - run from project root)
cd ..
docker-compose up -d mongodb
cd backend

# Run database seeder (creates demo users)
npm run seed

# Start backend server
npm run start:dev
```

Backend will run on `http://localhost:3000`

**Note**: All API routes are prefixed with `/api` (e.g., `/api/auth/login`)

### 3. Setup Frontend

Open a new terminal:

```bash
cd /home/shebl/Team-Task-Management-App//frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access Application

Open your browser to `http://localhost:5173`

## Demo Credentials

### Team Lead (Full Access)
- **Email**: `teamlead1@example.com` (or `teamlead2@example.com`, etc.)
- **Password**: `password123`
- **Can**: Manage users, create/edit/delete tasks, assign tasks

### Member (Limited Access)
- **Email**: `member1@example.com` (or `member2@example.com`, etc.)
- **Password**: `password123`
- **Can**: View assigned tasks, update task status

**Note**: After running the seeder, you'll have multiple team leads and members. Use any of them to login.

## Features Overview

### Authentication
- JWT-based authentication
- Role-based access control (Team Lead / Member)
- Automatic token refresh
- Protected routes

### Team Lead Features
1. **Users Management**
   - View all team members
   - See member details

2. **Tasks Management**
   - Create new tasks
   - Edit existing tasks
   - Delete tasks
   - Assign tasks to members
   - View all tasks in table format

### Member Features
1. **Task Dashboard**
   - View assigned tasks
   - Update task status (Pending → In Progress → Done)
   - Filter tasks by status
   - See task details

## API Documentation

Backend API endpoints are documented in:
```
backend/API_ENDPOINTS_SUMMARY.md
```

## Technology Stack

### Backend
- NestJS (Node.js framework)
- MongoDB (Database)
- Mongoose (ODM - Object Document Mapper)
- JWT (Authentication)
- Winston (Logging)
- Bcrypt (Password hashing)

### Frontend
- React 18
- TypeScript
- React Query / TanStack Query (State management)
- React Router v6 (Routing)
- Axios (HTTP client)
- Vite (Build tool)
- Chakra UI (UI components for searchable select)

## Development Scripts

### Backend
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run seed         # Seed database with demo data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection error:**
- Ensure MongoDB is running
- For Docker: Run `docker-compose up -d mongodb` from project root
- Check `docker-compose.yaml` configuration
- Verify connection string in backend `.env` file (should be `MONGODB_URI`, not `MONGO_URI`)

**Missing demo users:**
```bash
npm run seed
```

### Frontend Issues

**Port 5173 already in use:**
Vite will automatically use the next available port (5174, 5175, etc.)

**API connection error:**
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify API URL in frontend (should use `/api` prefix or full URL)
- In development, check proxy configuration in `vite.config.ts`
- All backend routes are prefixed with `/api` (e.g., `/api/auth/login`)

**Authentication issues:**
- Clear browser localStorage: `localStorage.clear()`
- Refresh page and login again

### General Issues

**Module not found:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

## Project Architecture

### Backend Architecture
```
src/
├── modules/
│   ├── auth/          # Authentication module
│   └── task/          # Task management module
├── lib/
│   ├── entity/         # Database entities
│   ├── guards/         # Auth guards
│   ├── decorators/     # Custom decorators
│   ├── services/       # Shared services
│   ├── repo/           # Repository pattern
│   ├── filters/        # Exception filters
│   └── utils/          # Utility functions
├── seeders/            # Database seeders
└── main.ts             # Entry point
```

### Frontend Architecture
```
src/
├── api/                # API client & endpoints
├── components/         # Reusable components
│   ├── TaskModal.tsx   # Task create/edit modal
│   ├── SearchableSelect.tsx  # Searchable dropdown
│   └── ...
├── context/            # React Context (Auth)
├── pages/              # Page components
├── styles/             # CSS files
├── types/              # TypeScript types
└── App.tsx             # Main app component
```

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: Bcrypt for password security
3. **Role-Based Access**: Separate permissions for Team Lead/Member
4. **Protected Routes**: Client-side route protection
5. **Auth Guards**: Server-side endpoint protection
6. **CORS**: Configured for security

## API Endpoints Summary

**Base URL**: `http://localhost:3000`  
**All routes are prefixed with `/api`**

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/members` - Get team members (Team Lead only)
- `GET /api/auth/leaders` - Get team leaders

### Tasks
- `POST /api/tasks/create` - Create task (Team Lead)
- `GET /api/tasks/get-all` - Get all tasks (Team Lead)
- `GET /api/tasks/:id` - Get task by ID (Team Lead)
- `PUT /api/tasks/:id` - Update task (Team Lead)
- `DELETE /api/tasks/:id` - Delete task (Team Lead)
- `GET /api/tasks/assigned-to-me` - Get assigned tasks (Member)
- `PUT /api/tasks/:id/status` - Update task status (Member)

### Health Check
- `GET /api/health` - Health check endpoint

For complete API documentation, see [backend/API_ENDPOINTS_SUMMARY.md](./backend/API_ENDPOINTS_SUMMARY.md)

## Production Deployment

### Option 1: Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Seed database
docker-compose exec backend npm run seed:prod
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

### Option 2: Manual Deployment

#### Backend
1. Set production environment variables
2. Build: `npm run build`
3. Deploy `dist/` folder to your server
4. Run: `npm run start:prod`

#### Frontend
1. Update API URL in environment or `src/api/client.ts`
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, AWS S3, etc.)

## Environment Variables

### Backend (.env)

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

### Frontend (.env)

Create a `.env` file in the `frontend/` directory (optional):

```env
# API URL (optional - defaults to http://localhost:3000 in dev)
VITE_API_URL=http://localhost:3000
```

For Docker, the frontend automatically uses `/api` proxy through nginx.

For detailed environment variable documentation, see [backend/ENV_VARIABLES.md](./backend/ENV_VARIABLES.md)

## Testing the Application

### As Team Lead:
1. Login with team lead credentials (e.g., `teamlead1@example.com` / `password123`)
2. Navigate to Users tab → See all members
3. Navigate to Tasks tab → Click "Add Task"
4. Fill form and assign to a member (use searchable dropdown)
5. Edit or delete tasks
6. View all tasks in table format

### As Member:
1. Login with member credentials (e.g., `member1@example.com` / `password123`)
2. View assigned tasks in card layout
3. Change task status using dropdown (Pending → In Progress → Done)
4. Filter tasks by status
5. See task details and who assigned it

## Additional Resources

### Main Documentation
- **[README.md](./README.md)** - Main project overview and quick reference
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker setup guide
- **[SEEDING_IN_DOCKER.md](./SEEDING_IN_DOCKER.md)** - Database seeding guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Detailed project overview

### Backend Documentation
- [Backend README](./backend/README.md) - Backend API documentation
- [API Endpoints Summary](./backend/API_ENDPOINTS_SUMMARY.md) - Complete API reference
- [Environment Variables](./backend/ENV_VARIABLES.md) - Environment configuration guide
- [Testing Documentation](./backend/TESTING.md) - Testing guide

### Frontend Documentation
- [Frontend README](./frontend/README.md) - Frontend documentation
- [Frontend Setup Guide](./frontend/SETUP_GUIDE.md) - Detailed setup instructions
- [Frontend Quick Start](./frontend/QUICK_START.md) - Quick start guide

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser/server console logs
4. Ensure all dependencies are installed

---

Built with ❤️ using NestJS and React

