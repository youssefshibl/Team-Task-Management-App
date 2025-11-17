# Environment Variables

This document describes all environment variables used in the Task Management Backend.

## Required Variables

### MongoDB Configuration
```env
MONGODB_URI=mongodb://localhost:27017/taskdb
```
- **Description**: MongoDB connection string
- **Default**: None (required)
- **Example**: `mongodb://localhost:27017/taskdb`

### JWT Configuration
```env
JWT_SECRET=your-secret-key-here-change-in-production
```
- **Description**: Secret key for JWT token generation
- **Default**: None (required)
- **Example**: `my-super-secret-jwt-key-12345`

## Optional Variables

### Server Configuration
```env
PORT=3000
```
- **Description**: Port number for the server
- **Default**: `3000`
- **Example**: `3000`, `8080`

## Seeder Configuration

These variables control the database seeding process when running `npm run seed`.

### Number of Leaders
```env
SEED_LEADERS_COUNT=5
```
- **Description**: Number of team leaders to create during seeding
- **Default**: `5`
- **Example**: `5`, `10`, `20`

### Number of Members
```env
SEED_MEMBERS_COUNT=50
```
- **Description**: Number of members to create during seeding
- **Default**: `50`
- **Example**: `50`, `100`, `200`

### Tasks Per Member
```env
SEED_TASKS_PER_MEMBER=10
```
- **Description**: Number of tasks to create for each member
- **Default**: `10`
- **Example**: `10`, `20`, `50`

**Note**: Tasks will be distributed with different statuses (pending, in_progress, done) evenly across each member's tasks.

## Example .env File

Create a `.env` file in the `backend` directory with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskdb

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production

# Server Configuration
PORT=3000

# Seeder Configuration
SEED_LEADERS_COUNT=5
SEED_MEMBERS_COUNT=50
SEED_TASKS_PER_MEMBER=10
```

## Usage

1. Copy the example above to create your `.env` file
2. Update the values according to your environment
3. Run `npm run seed` to populate the database with test data

## Seeder Behavior

- **Leaders**: Created with emails `teamlead1@example.com` through `teamlead{N}@example.com`
- **Members**: Created with emails `member1@example.com` through `member{N}@example.com`
- **Password**: All users have password `password123`
- **Tasks**: Each member gets tasks assigned by different leaders (distributed evenly)
- **Task Status**: Tasks are distributed with statuses: pending, in_progress, done (evenly)

## Notes

- If users already exist (by email), they will be skipped
- If tasks already exist (by name), they will be skipped
- The seeder is idempotent - you can run it multiple times safely

