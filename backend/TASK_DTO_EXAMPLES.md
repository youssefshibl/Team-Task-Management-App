# Task DTO Examples

This document provides examples of how to use the Task DTOs in API requests.

## Task Status Enum Values

```typescript
enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'Done'
}
```

---

## 1. CreateTaskDto

**Endpoint:** `POST /tasks`  
**Authorization:** Team Lead only  
**Content-Type:** `application/json`

### Request Body Example

```json
{
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication system with login and registration endpoints",
  "assignedTo": "507f1f77bcf86cd799439011"
}
```

### Valid Example (cURL)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Implement user authentication",
    "description": "Add JWT-based authentication system with login and registration endpoints",
    "assignedTo": "507f1f77bcf86cd799439011"
  }'
```

### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication system with login and registration endpoints",
  "status": "pending",
  "assignedTo": "507f1f77bcf86cd799439011",
  "assignedBy": "507f1f77bcf86cd799439010",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Validation Rules

- `name`: Required, must be a non-empty string
- `description`: Required, must be a non-empty string
- `assignedTo`: Required, must be a valid MongoDB ObjectId

### Error Examples

**Missing required field:**
```json
{
  "statusCode": 400,
  "message": ["name should not be empty"],
  "error": "BadRequestException"
}
```

**Invalid MongoDB ObjectId:**
```json
{
  "statusCode": 400,
  "message": ["assignedTo must be a mongodb id"],
  "error": "BadRequestException"
}
```

---

## 2. UpdateTaskDto

**Endpoint:** `PUT /tasks/:id`  
**Authorization:** Team Lead only  
**Content-Type:** `application/json`

### Request Body Example

All fields are optional. You can update one or more fields:

```json
{
  "name": "Implement user authentication - Updated",
  "description": "Add JWT-based authentication with refresh tokens",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

### Partial Update Examples

**Update only name:**
```json
{
  "name": "Updated task name"
}
```

**Update only description:**
```json
{
  "description": "Updated task description"
}
```

**Update only assignedTo:**
```json
{
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

**Update multiple fields:**
```json
{
  "name": "New task name",
  "description": "New description",
  "assignedTo": "507f1f77bcf86cd799439014"
}
```

### Valid Example (cURL)

```bash
curl -X PUT http://localhost:3000/tasks/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Implement user authentication - Updated",
    "description": "Add JWT-based authentication with refresh tokens"
  }'
```

### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Implement user authentication - Updated",
  "description": "Add JWT-based authentication with refresh tokens",
  "status": "pending",
  "assignedTo": "507f1f77bcf86cd799439011",
  "assignedBy": "507f1f77bcf86cd799439010",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### Validation Rules

- `name`: Optional, if provided must be a non-empty string
- `description`: Optional, if provided must be a non-empty string
- `assignedTo`: Optional, if provided must be a valid MongoDB ObjectId

---

## 3. UpdateTaskStatusDto

**Endpoint:** `PUT /tasks/:id/status`  
**Authorization:** Member only (must be assigned to the task)  
**Content-Type:** `application/json`

### Request Body Example

```json
{
  "status": "in_progress"
}
```

### Valid Status Values

- `"pending"` - Task is pending
- `"in_progress"` - Task is in progress
- `"Done"` - Task is completed

### Example Requests

**Change status to in_progress:**
```json
{
  "status": "in_progress"
}
```

**Change status to completed:**
```json
{
  "status": "Done"
}
```

**Change status back to pending:**
```json
{
  "status": "pending"
}
```

### Valid Example (cURL)

```bash
curl -X PUT http://localhost:3000/tasks/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "in_progress"
  }'
```

### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Implement user authentication",
  "description": "Add JWT-based authentication system",
  "status": "in_progress",
  "assignedTo": "507f1f77bcf86cd799439011",
  "assignedBy": "507f1f77bcf86cd799439010",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Validation Rules

- `status`: Required, must be one of: `"pending"`, `"in_progress"`, `"Done"`

### Error Examples

**Invalid status value:**
```json
{
  "statusCode": 400,
  "message": ["status must be one of the following values: pending, in_progress, Done"],
  "error": "BadRequestException"
}
```

**Member not assigned to task:**
```json
{
  "statusCode": 403,
  "message": ["You are not authorized to update this task status"],
  "error": "ForbiddenException"
}
```

---

## Complete API Workflow Examples

### 1. Team Lead Creates a Task

```bash
# 1. Login as Team Lead
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teamlead@example.com",
    "password": "password123"
  }'

# Response contains JWT token
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { ... }
# }

# 2. Create Task (using token from step 1)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Fix bug in authentication",
    "description": "Users cannot login with special characters in password",
    "assignedTo": "507f1f77bcf86cd799439011"
  }'
```

### 2. Member Updates Task Status

```bash
# 1. Login as Member
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member1@example.com",
    "password": "password123"
  }'

# 2. Update task status to in_progress
curl -X PUT http://localhost:3000/tasks/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MEMBER_JWT_TOKEN" \
  -d '{
    "status": "in_progress"
  }'

# 3. Update task status to completed
curl -X PUT http://localhost:3000/tasks/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MEMBER_JWT_TOKEN" \
  -d '{
    "status": "Done"
  }'
```

### 3. Team Lead Updates Task Details

```bash
curl -X PUT http://localhost:3000/tasks/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEAM_LEAD_JWT_TOKEN" \
  -d '{
    "name": "Fix critical bug in authentication",
    "description": "Users cannot login with special characters. Priority: High",
    "assignedTo": "507f1f77bcf86cd799439013"
  }'
```

---

## TypeScript/JavaScript Examples

### Using Fetch API

```typescript
// Create Task
const createTask = async (taskData: CreateTaskDto, token: string) => {
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Implement user authentication',
      description: 'Add JWT-based authentication system',
      assignedTo: '507f1f77bcf86cd799439011'
    })
  });
  
  return await response.json();
};

// Update Task Status
const updateTaskStatus = async (taskId: string, status: TaskStatus, token: string) => {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  
  return await response.json();
};
```

### Using Axios

```typescript
import axios from 'axios';

// Create Task
const createTask = async (taskData: CreateTaskDto, token: string) => {
  const response = await axios.post(
    'http://localhost:3000/tasks',
    {
      name: 'Implement user authentication',
      description: 'Add JWT-based authentication system',
      assignedTo: '507f1f77bcf86cd799439011'
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};

// Update Task Status
const updateTaskStatus = async (taskId: string, status: TaskStatus, token: string) => {
  const response = await axios.put(
    `http://localhost:3000/tasks/${taskId}/status`,
    { status },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};
```

---

## Notes

1. **MongoDB ObjectId Format**: The `assignedTo` field must be a valid MongoDB ObjectId (24 character hex string)
2. **Authentication**: All endpoints require a valid JWT token in the Authorization header
3. **Role-Based Access**: 
   - Team Leads can create, read, update, and delete tasks
   - Members can only update the status of tasks assigned to them
4. **Status Values**: The status enum uses `"Done"` (not `"completed"`) for completed tasks
5. **Validation**: All DTOs use class-validator decorators for automatic validation

