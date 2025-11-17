# Task Management Frontend - Setup Guide

This guide will help you set up and run the Task Management Frontend application.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Backend API** running on `http://localhost:3000`

## Quick Start

### 1. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 2. Start Backend API

Make sure your backend API is running on `http://localhost:3000`. If you're using the provided backend:

```bash
cd ../backend
npm install
npm run start:dev
```

### 3. Start Frontend Development Server

In the frontend directory:

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` in your browser.

## Login Credentials

### Team Lead Account
- **Email**: `teamlead@example.com`
- **Password**: `password123`
- **Access**: Full access to Users and Tasks management

### Member Account
- **Email**: `member1@example.com`
- **Password**: `password123`
- **Access**: View and update assigned tasks only

## Application Features

### For Team Leads:
1. **Users Tab**:
   - View all team members
   - See member details (name, email)

2. **Tasks Tab**:
   - View all tasks in a table
   - Create new tasks by clicking "Add Task"
   - Edit tasks by clicking the edit icon
   - Delete tasks by clicking the delete icon
   - Assign tasks to team members

### For Members:
1. **Dashboard**:
   - View all assigned tasks
   - Update task status (Pending → In Progress → Done)
   - Filter tasks by status
   - See task details (description, assigned by, created date)

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client and endpoints
│   │   ├── client.ts   # Axios configuration with interceptors
│   │   ├── auth.ts     # Authentication API calls
│   │   └── tasks.ts    # Tasks API calls
│   ├── components/     # Reusable components
│   │   ├── ProtectedRoute.tsx  # Route protection HOC
│   │   ├── TaskModal.tsx       # Add/Edit task modal
│   │   ├── TasksTab.tsx        # Leader tasks view
│   │   └── UsersTab.tsx        # Leader users view
│   ├── context/        # React Context providers
│   │   └── AuthContext.tsx     # Authentication state
│   ├── pages/          # Page components
│   │   ├── Login.tsx           # Login page
│   │   ├── MemberDashboard.tsx # Member view
│   │   └── LeaderDashboard.tsx # Leader view
│   ├── styles/         # CSS files
│   │   ├── index.css          # Global styles
│   │   ├── Login.css
│   │   ├── MemberDashboard.css
│   │   ├── LeaderDashboard.css
│   │   ├── TasksTab.css
│   │   └── UsersTab.css
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Vite types
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── README.md           # Documentation
```

## API Configuration

The application is configured to communicate with the backend API at `http://localhost:3000`.

### Development
The Vite proxy is configured in `vite.config.ts` to forward `/api` requests to `http://localhost:3000`.

### Production
Update the `API_BASE_URL` in `src/api/client.ts` to point to your production backend URL.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.).

### Backend Connection Issues
1. Ensure the backend is running on `http://localhost:3000`
2. Check the browser console for CORS errors
3. Verify the backend has CORS enabled

### Authentication Issues
1. Clear browser localStorage: `localStorage.clear()`
2. Refresh the page
3. Try logging in again

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Development Workflow

### Making Changes
1. Edit files in the `src/` directory
2. Changes will hot-reload automatically
3. Check the browser console for errors

### Adding New Dependencies
```bash
npm install <package-name>
```

### Type Checking
TypeScript will check types during development. To run a full type check:
```bash
npx tsc --noEmit
```

## Production Build

### Build the Application
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy
The `dist/` directory contains static files that can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Nginx/Apache

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. **React Query Caching**: Data is cached automatically, reducing API calls
2. **Code Splitting**: Routes are lazy-loaded for faster initial load
3. **Production Build**: Always use production build for deployment

## Security Notes

1. JWT tokens are stored in localStorage
2. Authentication interceptor adds tokens to all API requests
3. Protected routes redirect unauthorized users to login
4. Role-based access control enforced on frontend and backend

## Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the backend logs
3. Review the API endpoints in `backend/API_ENDPOINTS_SUMMARY.md`
4. Ensure backend and frontend are on compatible versions

## Next Steps

After setup, you can:
1. Log in as Team Lead and create some tasks
2. Log in as Member and update task statuses
3. Explore the UI and test all features
4. Customize styles in the `src/styles/` directory
5. Add new features or modify existing ones

## Additional Resources

- [React Documentation](https://react.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

---

Happy coding! 🚀

