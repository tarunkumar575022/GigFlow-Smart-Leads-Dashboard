# Smart Leads Dashboard

A full-stack modern Lead Management Dashboard.

## Architecture

This project is separated into a frontend and a backend application:
- **Frontend**: React.js with Vite, written in strict TypeScript. Uses TailwindCSS for styling, React Router for navigation, React Hook Form + Zod for validation, and Zustand for state management.
- **Backend**: Node.js + Express, written in strict TypeScript. Uses MongoDB + Mongoose for data persistence, JWT for authentication, bcryptjs for secure password hashing, and Zod for robust input validation.

## Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- Docker & Docker Compose (optional, for containerized run)

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=super_secret_jwt_key_here
NODE_ENV=development
```

### Frontend
No environment variables required out of the box (uses `http://localhost:5000/api` by default).

## Installation & Setup (Local)

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Running with Docker

You can run the entire application (frontend, backend, and MongoDB) with a single command:

```bash
docker compose up --build
```

- Frontend runs at: `http://localhost:5173`
- Backend runs at: `http://localhost:5000`
- MongoDB runs at: `localhost:27017`

## Features

- **Authentication**: JWT based user registration and login.
- **Role-Based Access Control**: Admin vs Sales permissions.
- **Leads Management**: Full CRUD on leads.
- **Advanced Filtering**: Filter leads by status and source, and search by name/email with a 500ms debounce.
- **Pagination**: Server-side pagination.
- **CSV Export**: Admin capability to export the current filtered table view.

## API Documentation

### Authentication Routes
- `POST /api/auth/register`
  - **Description**: Registers a new user.
  - **Body**: `{ "name", "email", "password", "role" }`

- `POST /api/auth/login`
  - **Description**: Authenticates the user.
  - **Body**: `{ "email", "password" }`
  - **Returns**: JWT token and user metadata.

### Leads Routes (Protected, requires Bearer Token)
- `GET /api/leads`
  - **Description**: Fetches paginated leads.
  - **Query Params**: `search`, `status`, `source`, `sort` (latest/oldest), `page`, `limit` (default 10).

- `POST /api/leads`
  - **Description**: Creates a new lead.
  - **Body**: `{ "name", "email", "status", "source" }`

- `GET /api/leads/:id`
  - **Description**: Fetches a single lead's details by ID.

- `PUT /api/leads/:id`
  - **Description**: Updates an existing lead.

- `DELETE /api/leads/:id`
  - **Description**: Deletes a lead. **Requires Admin privileges**.
