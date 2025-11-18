# Task Management System - Complete Setup Guide

This is a full-stack task management application with a Node.js backend and React frontend.

## Project Structure

```
task1/
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

- Node.js 18+ and npm
- MongoDB (running locally or via Docker)

## Complete Setup

### 1. Clone and Navigate

```bash
cd /home/shebl/task1
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Start MongoDB (if using Docker)
docker-compose up -d

# Run database seeder (creates demo users)
npm run seed

# Start backend server
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd /home/shebl/task1/frontend

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
- **Email**: `teamlead@example.com`
- **Password**: `password123`
- **Can**: Manage users, create/edit/delete tasks, assign tasks

### Member (Limited Access)
- **Email**: `member1@example.com`
- **Password**: `password123`
- **Can**: View assigned tasks, update task status

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
- TypeORM (ORM)
- JWT (Authentication)
- Winston (Logging)

### Frontend
- React 18
- TypeScript
- React Query (State management)
- React Router v6 (Routing)
- Axios (HTTP client)
- Vite (Build tool)

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
- Check `docker-compose.yaml` configuration
- Verify connection string in backend

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
- Verify proxy configuration in `vite.config.ts`

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
│   ├── entity/        # Database entities
│   ├── guards/        # Auth guards
│   ├── decorators/    # Custom decorators
│   └── services/      # Shared services
└── main.ts            # Entry point
```

### Frontend Architecture
```
src/
├── api/               # API client & endpoints
├── components/        # Reusable components
├── context/           # React Context (Auth)
├── pages/             # Page components
├── styles/            # CSS files
├── types/             # TypeScript types
└── App.tsx            # Main app component
```

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: Bcrypt for password security
3. **Role-Based Access**: Separate permissions for Team Lead/Member
4. **Protected Routes**: Client-side route protection
5. **Auth Guards**: Server-side endpoint protection
6. **CORS**: Configured for security

## API Endpoints Summary

### Authentication
- `POST /auth/login` - User login
- `GET /auth/members` - Get team members (Team Lead only)

### Tasks
- `POST /tasks/create` - Create task (Team Lead)
- `GET /tasks/get-all` - Get all tasks (Team Lead)
- `GET /tasks/:id` - Get task by ID (Team Lead)
- `PUT /tasks/:id` - Update task (Team Lead)
- `DELETE /tasks/:id` - Delete task (Team Lead)
- `GET /tasks/assigned-to-me` - Get assigned tasks (Member)
- `PUT /tasks/:id/status` - Update task status (Member)

## Production Deployment

### Backend
1. Build: `npm run build`
2. Deploy `dist/` folder to your server
3. Set environment variables
4. Run: `npm run start:prod`

### Frontend
1. Update API URL in `src/api/client.ts`
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, etc.)

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## Testing the Application

### As Team Lead:
1. Login with team lead credentials
2. Navigate to Users tab → See all members
3. Navigate to Tasks tab → Click "Add Task"
4. Fill form and assign to a member
5. Edit or delete tasks

### As Member:
1. Login with member credentials
2. View assigned tasks
3. Change task status using dropdown
4. Filter tasks by status

## Additional Resources

- [Backend API Documentation](./backend/API_ENDPOINTS_SUMMARY.md)
- [Frontend Setup Guide](./frontend/SETUP_GUIDE.md)
- [Frontend Quick Start](./frontend/QUICK_START.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser/server console logs
4. Ensure all dependencies are installed

---

Built with ❤️ using NestJS and React

