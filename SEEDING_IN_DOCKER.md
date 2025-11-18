# Seeding Database in Docker

This guide explains how to seed the database when running the application in Docker containers.

## Quick Start

After starting your Docker containers, run:

```bash
docker-compose exec backend npm run seed:prod
```

## Alternative Methods

### Method 1: Using npm script (Recommended)
```bash
docker-compose exec backend npm run seed:prod
```

### Method 2: Direct node command
```bash
docker-compose exec backend node dist/seeders/seed.js
```

### Method 3: Interactive shell
```bash
# Enter the backend container
docker-compose exec backend sh

# Then run the seed command
npm run seed:prod
# Or
node dist/seeders/seed.js

# Exit the container
exit
```

## What Gets Seeded

The seeder creates:

1. **Team Leaders** (default: 5)
   - Emails: `teamlead1@example.com` through `teamlead5@example.com`
   - Password: `password123`
   - Role: `team_lead`

2. **Team Members** (default: 50)
   - Emails: `member1@example.com` through `member50@example.com`
   - Password: `password123`
   - Role: `member`

3. **Tasks** (default: 10 per member)
   - Assigned to members
   - Assigned by leaders (distributed evenly)
   - Statuses: `pending`, `in_progress`, `done` (distributed evenly)

## Configuration

You can configure the seeder by setting environment variables in `docker-compose.yaml`:

```yaml
environment:
  SEED_LEADERS_COUNT: 5      # Number of leaders
  SEED_MEMBERS_COUNT: 50     # Number of members
  SEED_TASKS_PER_MEMBER: 10  # Tasks per member
```

After changing these values, restart the backend container:

```bash
docker-compose restart backend
```

Then run the seed command again.

## Troubleshooting

### Error: Cannot find module

If you get a module not found error, make sure:
1. The backend container is running: `docker-compose ps backend`
2. The build completed successfully: `docker-compose logs backend`
3. Rebuild if needed: `docker-compose up -d --build backend`

### Error: Connection refused

If you get a MongoDB connection error:
1. Check if MongoDB is running: `docker-compose ps mongodb`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Ensure MongoDB is healthy: `docker-compose ps mongodb` should show "healthy"

### Seeder is idempotent

The seeder is safe to run multiple times. It will:
- Skip existing users (by email)
- Skip existing tasks (by name)
- Only create new data

## Example Output

When the seeder runs successfully, you should see:

```
=== Starting Database Seeding ===
Starting user seeding...
User seeding completed! Created 5 leaders and 50 members.
Starting task seeding...
Task seeding completed! Created 500 tasks.
=== Database Seeding Completed Successfully ===
```

## Verify Seeded Data

You can verify the seeded data by:

1. **Check backend logs:**
   ```bash
   docker-compose logs backend | grep -i seed
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - Login with any seeded user (e.g., `teamlead1@example.com` / `password123`)

3. **Check MongoDB directly:**
   ```bash
   docker-compose exec mongodb mongosh -u admin -p admin --authenticationDatabase admin
   ```
   Then in MongoDB shell:
   ```javascript
   use tasks
   db.users.countDocuments()
   db.tasks.countDocuments()
   ```

