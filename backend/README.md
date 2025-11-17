# Task Management Backend API

A robust RESTful API built with NestJS for managing tasks with role-based access control. This backend provides authentication, task management, and comprehensive logging capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Logging](#logging)
- [Seeding](#seeding)
- [Testing](#testing)
- [Scripts](#scripts)

## ✨ Features

- 🔐 **JWT-based Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Team Lead and Member roles with different permissions
- 📝 **Task Management** - Full CRUD operations for tasks
- 🔒 **Authorization Guards** - Protected routes with role-based access
- 📊 **Winston Logging** - Comprehensive logging with file and console transports
- ✅ **Input Validation** - Request validation using class-validator
- 🗄️ **MongoDB Integration** - Mongoose ODM for database operations
- 🎯 **Exception Handling** - Global exception filter for consistent error responses
- 🌱 **Database Seeding** - User seeder for initial data

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Logging**: Winston with nest-winston
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (v5 or higher) or MongoDB Atlas account
- **Git**

## 🚀 Installation

1. **Clone the repository** (if not already cloned):
```bash
git clone <repository-url>
cd task1/backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start MongoDB** (if running locally):
```bash
# Using Docker
docker-compose up -d

# Or start MongoDB service manually
```

6. **Seed the database** (optional):
```bash
npm run seed
```

7. **Start the development server**:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/task-management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Environment Variables Description

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |

## 🗄️ Database Setup

### Using Docker Compose

The project includes a `docker-compose.yaml` file for easy MongoDB setup:

```bash
docker-compose up -d
```

This will start MongoDB on port `27017`.

### Manual MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. Ensure MongoDB is running before starting the application

## ▶️ Running the Application

### Development Mode
```bash
npm run start:dev
```
Runs the app in watch mode with hot-reload.

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "teamlead@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "teamlead@example.com",
    "name": "Team Lead",
    "role": "team_lead"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Task (Team Lead Only)
```http
POST /tasks/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication system",
  "assignedTo": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "status": "pending",
    "assignedTo": {...},
    "assignedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Tasks (Team Lead Only)
```http
GET /tasks/get-all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Tasks fetched successfully",
  "data": [...]
}
```

#### Get Task by ID (Team Lead Only)
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task (Team Lead Only)
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated task name",
  "description": "Updated description",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

#### Delete Task (Team Lead Only)
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

#### Update Task Status (Member Only)
```http
PUT /tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Valid Status Values:**
- `pending` - Task is pending
- `in_progress` - Task is in progress
- `Done` - Task is completed

**Note:** Members can only update the status of tasks assigned to them.

#### Get Tasks Assigned to Me (Member Only)
```http
GET /tasks/assigned-to-me
Authorization: Bearer <token>
```

## 🔐 Authentication

### How Authentication Works

1. **Login**: User provides email and password
2. **Token Generation**: Server validates credentials and returns a JWT token
3. **Token Usage**: Client includes token in `Authorization` header for protected routes
4. **Token Validation**: Server validates token and extracts user information

### Role-Based Access Control

The application supports two roles:

- **Team Lead** (`team_lead`):
  - Create, read, update, and delete tasks
  - View all tasks they created
  - Assign tasks to members

- **Member** (`member`):
  - Update status of tasks assigned to them
  - View tasks assigned to them
  - Cannot create, update, or delete tasks

### Using the Auth Guard

Routes are protected using the `@Auth()` decorator:

```typescript
@Get('protected-route')
@Auth({ role: UserRole.TEAM_LEAD })
async protectedRoute(@User() user: IJwtPayload) {
  // Only team leads can access this route
}
```

## 📁 Project Structure

```
src/
├── lib/                    # Shared libraries and utilities
│   ├── base/              # Base repository class
│   ├── config/            # Configuration files (Winston, etc.)
│   ├── decorators/        # Custom decorators (Auth, User)
│   ├── entity/            # Database entities/schemas
│   ├── enums/             # Enumerations (UserRole, TaskStatus)
│   ├── filters/            # Exception filters
│   ├── guards/            # Authentication and authorization guards
│   ├── interfaces/         # TypeScript interfaces
│   ├── repo/              # Repository classes
│   ├── services/          # Shared services (JWT, Password)
│   └── utils/             # Utility classes (Mappers, Validators)
├── modules/                # Feature modules
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.dto.ts
│   │   └── auth.module.ts
│   └── task/              # Task management module
│       ├── task.controller.ts
│       ├── task.dto.ts
│       ├── task.module.ts
│       └── task.service.ts
├── seeders/               # Database seeders
│   ├── seed.ts
│   ├── seeder.module.ts
│   └── user.seeder.ts
├── app.module.ts          # Root application module
└── main.ts                # Application entry point
```

## 📝 Logging

The application uses Winston for comprehensive logging with the following features:

- **Console Transport**: Colorized, formatted logs for development
- **File Transport**: JSON formatted logs saved to files
  - `logs/combined.log` - All logs
  - `logs/error.log` - Error logs only
- **Log Rotation**: Automatic file rotation (5MB max, 5 files)

### Log Levels

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages
- `verbose` - Verbose messages

### Using the Logger

```typescript
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

constructor(
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: Logger,
) {}

this.logger.info('Information message');
this.logger.error('Error message');
this.logger.warn('Warning message');
```

## 🌱 Seeding

The application includes a seeder to populate the database with initial user data.

### Run Seeder

```bash
npm run seed
```

### Seeded Users

The seeder creates the following users:

1. **Team Lead**
   - Email: `teamlead@example.com`
   - Password: `password123`
   - Role: `team_lead`

2. **Member 1**
   - Email: `member1@example.com`
   - Password: `password123`
   - Role: `member`

3. **Member 2**
   - Email: `member2@example.com`
   - Password: `password123`
   - Role: `member`

**Note:** The seeder checks for existing users and skips them to avoid duplicates.

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Generate Test Coverage
```bash
npm run test:cov
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the application for production |
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot-reload |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start in production mode |
| `npm run lint` | Run ESLint and fix issues |
| `npm run format` | Format code using Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate test coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run seed` | Seed the database with initial data |

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **Role-Based Access**: Routes protected with role-based guards
- **Global Exception Filter**: Consistent error handling
- **CORS**: Configured for cross-origin requests (if needed)

## 🐛 Error Handling

The application uses a global exception filter that provides consistent error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/tasks/create",
  "method": "POST",
  "message": ["Validation error messages"],
  "error": "BadRequestException"
}
```

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [JWT.io](https://jwt.io) - JWT token decoder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👤 Author

- **Youssef Shbl** - [GitHub](https://github.com/youssefshibl)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB for the database solution
- All contributors and open-source libraries used in this project

---

**Note**: Make sure to change the `JWT_SECRET` and other sensitive values in production environments!
