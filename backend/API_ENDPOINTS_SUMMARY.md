# API Endpoints Summary

Complete list of all available endpoints in the Task Management Backend API.

**Base URL:** `http://localhost:3000`

---

## 📋 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [Task Management Endpoints](#task-management-endpoints)
- [App Endpoints](#app-endpoints)

---

## 🔐 Authentication Endpoints

### 1. Login
```http
POST /auth/login
Content-Type: application/json
```

**Description:** Authenticate user and receive JWT token

**Authentication:** Not required

**Request Body:**
```json
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

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials

---

### 2. Get Members List
```http
GET /auth/members
Authorization: Bearer <token>
```

**Description:** Get list of all member users (Team Lead only)

**Authentication:** Required (Team Lead role)

**Response:**
```json
{
  "message": "Members fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Member 1",
      "email": "member1@example.com"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Member 2",
      "email": "member2@example.com"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not a Team Lead)

---

### 3. Get Leaders List
```http
GET /auth/leaders
Authorization: Bearer <token>
```

**Description:** Get list of all team lead users (Team Lead and Member roles can access)

**Authentication:** Required (Team Lead or Member role)

**Response:**
```json
{
  "message": "Leaders fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Team Lead 1",
      "email": "teamlead1@example.com"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Team Lead 2",
      "email": "teamlead2@example.com"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not authenticated)

---

## 📝 Task Management Endpoints

### 1. Create Task
```http
POST /tasks/create
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Create a new task (Team Lead only)

**Authentication:** Required (Team Lead role)

**Request Body:**
```json
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

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error or task name already exists
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)
- `404` - Assigned user not found

---

### 2. Get All Tasks
```http
GET /tasks/get-all
Authorization: Bearer <token>
```

**Description:** Get all tasks created by the authenticated Team Lead

**Authentication:** Required (Team Lead role)

**Response:**
```json
{
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Task name",
      "description": "Task description",
      "status": "pending",
      "assignedTo": {...},
      "assignedBy": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)

---

### 3. Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

**Description:** Get a specific task by ID (Team Lead only)

**Authentication:** Required (Team Lead role)

**Path Parameters:**
- `id` (string) - Task ID

**Response:**
```json
{
  "message": "Task fetched successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Task name",
    "description": "Task description",
    "status": "pending",
    "assignedTo": {...},
    "assignedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)
- `404` - Task not found

---

### 4. Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Update task details (Team Lead only)

**Authentication:** Required (Team Lead role)

**Path Parameters:**
- `id` (string) - Task ID

**Request Body:** (All fields optional)
```json
{
  "name": "Updated task name",
  "description": "Updated description",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Updated task name",
    "description": "Updated description",
    "status": "pending",
    "assignedTo": {...},
    "assignedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)
- `404` - Task not found or assigned user not found

---

### 5. Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Description:** Delete a task (Team Lead only)

**Authentication:** Required (Team Lead role)

**Path Parameters:**
- `id` (string) - Task ID

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)
- `404` - Task not found

---

### 6. Update Task Status
```http
PUT /tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Update task status (Member only, only for assigned tasks)

**Authentication:** Required (Member role)

**Path Parameters:**
- `id` (string) - Task ID

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Valid Status Values:**
- `pending` - Task is pending
- `in_progress` - Task is in progress
- `done` - Task is completed

**Response:**
```json
{
  "message": "Task status updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Task name",
    "description": "Task description",
    "status": "in_progress",
    "assignedTo": {...},
    "assignedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid status value
- `401` - Unauthorized
- `403` - Forbidden (not a Member or task not assigned to user)
- `404` - Task not found

---

### 7. Get Tasks Assigned to Me
```http
GET /tasks/assigned-to-me
Authorization: Bearer <token>
```

**Description:** Get all tasks assigned to the authenticated member

**Authentication:** Required (Member role)

**Response:**
```json
{
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Task name",
      "description": "Task description",
      "status": "pending",
      "assignedTo": {...},
      "assignedBy": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not a Member)

---

### 8. Get Task Statistics
```http
GET /tasks/statistics
Authorization: Bearer <token>
```

**Description:** Get statistics about tasks created by the authenticated team lead (counts by status)

**Authentication:** Required (Team Lead role)

**Response:**
```json
{
  "message": "Statistics fetched successfully",
  "data": {
    "pending": 5,
    "in_progress": 3,
    "done": 12,
    "total": 20
  }
}
```

**Response Fields:**
- `pending` (number) - Count of tasks with pending status
- `in_progress` (number) - Count of tasks with in_progress status
- `done` (number) - Count of tasks with done status
- `total` (number) - Total number of tasks created by the team lead

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not a Team Lead)

---

## 🏠 App Endpoints

### 1. Health Check
```http
GET /
```

**Description:** Basic health check endpoint

**Authentication:** Not required

**Response:**
```
Hello World!
```

**Status Codes:**
- `200` - Success

---

## 📊 Endpoints Summary Table

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| `POST` | `/auth/login` | ❌ | - | User login |
| `GET` | `/auth/members` | ✅ | Team Lead | Get members list |
| `GET` | `/auth/leaders` | ✅ | Team Lead, Member | Get leaders list |
| `POST` | `/tasks/create` | ✅ | Team Lead | Create task |
| `GET` | `/tasks/get-all` | ✅ | Team Lead | Get all tasks |
| `GET` | `/tasks/:id` | ✅ | Team Lead | Get task by ID |
| `PUT` | `/tasks/:id` | ✅ | Team Lead | Update task |
| `DELETE` | `/tasks/:id` | ✅ | Team Lead | Delete task |
| `PUT` | `/tasks/:id/status` | ✅ | Member | Update task status |
| `GET` | `/tasks/assigned-to-me` | ✅ | Member | Get assigned tasks |
| `GET` | `/tasks/statistics` | ✅ | Team Lead | Get task statistics |
| `GET` | `/` | ❌ | - | Health check |

---

## 🔑 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

1. Login using `/auth/login` endpoint
2. Copy the `token` from the response
3. Include it in the `Authorization` header for subsequent requests

### Role-Based Access

- **Team Lead** (`team_lead`): Can access all task management endpoints
- **Member** (`member`): Can only update task status and view assigned tasks

---

## 📝 Common Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
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

---

## 🚨 Common Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## 📌 Notes

1. **Route Ordering**: Specific routes (like `/tasks/assigned-to-me`) must be defined before parameterized routes (like `/tasks/:id`) to avoid route conflicts.

2. **Task Name Uniqueness**: Task names must be unique across the system.

3. **Status Updates**: Members can only update the status of tasks assigned to them.

4. **User Assignment**: When creating or updating a task, the `assignedTo` field must be a valid MongoDB ObjectId of an existing user.

5. **Password Security**: User passwords are never returned in API responses.

---

## 🔗 Quick Reference

### Team Lead Workflow
1. `POST /auth/login` - Login
2. `GET /auth/members` - View available members
3. `GET /auth/leaders` - View all team leads
4. `GET /tasks/statistics` - View task statistics
5. `POST /tasks/create` - Create task
6. `GET /tasks/get-all` - View all created tasks
7. `GET /tasks/:id` - View specific task
8. `PUT /tasks/:id` - Update task
9. `DELETE /tasks/:id` - Delete task

### Member Workflow
1. `POST /auth/login` - Login
2. `GET /auth/leaders` - View all team leads
3. `GET /tasks/assigned-to-me` - View assigned tasks
4. `PUT /tasks/:id/status` - Update task status

---

**Last Updated:** 2024-01-15

