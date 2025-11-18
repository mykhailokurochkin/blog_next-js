# Blog Application

A full-stack blog application built with Next.js (frontend) and Node.js/Express (backend) with TypeScript.

## Features

- **Authentication**: User login/logout with JWT tokens
- **Post Management**: Create, read, update, and delete blog posts
- **Admin Dashboard**: Admin interface for managing all posts
- **User Dashboard**: Personal dashboard for authenticated users
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Query (@tanstack/react-query)
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- PostgreSQL database
- JWT authentication

## Project Structure

```
blog_next-js/
├── frontend/          # Next.js frontend application
│   ├── app/           # App router pages and components
│   ├── api/           # API client functions
│   └── context/       # React contexts
├── backend/           # Express backend application
│   ├── src/
│   │   ├── auth/      # Authentication routes and services
│   │   ├── posts/     # Post management routes and services
│   │   └── models/    # Database models
└── README.md
```

## Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog_next-js
```

2. Install dependencies for both frontend and backend:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

4. Configure your environment variables:
- Edit `frontend/.env.local` with your frontend configuration
- Edit `backend/.env` with your database and JWT settings
- **Important**: The `.env.example` files contain default admin credentials. Use these exact values to access admin functionality:
  - Email: `adminemail@gmail.com`
  - Password: `Admin123!`

5. Set up the database:
```bash
cd backend
npm run migrate
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-jwt-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
PORT=4000
NODE_ENV=development
```

## Usage

1. **Login**: Access the application at `/login`
2. **Dashboard**: After login, users are redirected to `/dashboard`
3. **Admin Access**: Admin users can access `/admin` for full post management
4. **Create Posts**: Use the "Create Post" button to add new blog posts
5. **Edit/Delete**: Admin users can edit and delete posts from the admin panel or post details page

## Development

The application uses:
- TypeScript for type safety
- ESLint for code linting
- Git for version control

## License

MIT License
