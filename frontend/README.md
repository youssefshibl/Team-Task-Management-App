# Task Management Frontend

A modern React application for task management with role-based access control (Team Lead and Member views).

## Features

### Authentication
- Login page for both Team Lead and Member roles
- JWT-based authentication
- Automatic token refresh and session management
- Protected routes based on user roles

### Team Lead Features
- **Users Tab**: View all team members
- **Tasks Tab**: 
  - View all tasks in a table format
  - Create new tasks with assignment
  - Edit existing tasks
  - Delete tasks
  - Assign tasks to team members

### Member Features
- View tasks assigned to them
- Update task status (Pending, In Progress, Done)
- Filter tasks by status

## Tech Stack

- **React 18+** - UI Library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Vite** - Build tool

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

This will generate optimized production files in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Axios configuration
│   ├── auth.ts       # Authentication API
│   └── tasks.ts      # Tasks API
├── components/       # Reusable components
│   ├── ProtectedRoute.tsx
│   ├── TaskModal.tsx
│   ├── TasksTab.tsx
│   └── UsersTab.tsx
├── context/          # React Context
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Login.tsx
│   ├── MemberDashboard.tsx
│   └── LeaderDashboard.tsx
├── styles/           # CSS files
│   ├── index.css
│   ├── Login.css
│   ├── MemberDashboard.css
│   ├── LeaderDashboard.css
│   ├── TasksTab.css
│   └── UsersTab.css
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Environment Configuration

The application is configured to proxy API requests to `http://localhost:3000`. To change the backend URL:

1. Update `vite.config.ts` for development proxy
2. Update `src/api/client.ts` for production API URL

## Demo Credentials

### Team Lead
- Email: `teamlead@example.com`
- Password: `password123`

### Member
- Email: `member1@example.com`
- Password: `password123`

## Features Overview

### Login Page
- Modern UI with gradient background
- Email and password validation
- Error handling with user-friendly messages
- Auto-redirect based on user role

### Member Dashboard
- Grid view of assigned tasks
- Status badge indicators (Pending, In Progress, Done)
- Status update dropdown for each task
- Task filtering by status
- Responsive design

### Leader Dashboard
- Sidebar navigation
- **Users Tab**: Display all team members with avatars
- **Tasks Tab**: 
  - Comprehensive table view
  - Add Task button opens modal
  - Edit icon for each task
  - Delete icon with confirmation
  - Modal form for creating/editing tasks
  - Assign tasks to team members

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

