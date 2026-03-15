# blog-platform-app
Full-stack blog platform with FastAPI backend and Next.js frontend

## Backend

Backend is implemented with FastAPI under the `backend/` directory.

## Frontend

The frontend is a Next.js (App Router) + TypeScript application located in the `frontend/` directory.

### Running the frontend

1. Ensure the backend API is running on `http://localhost:8000`.
2. In a separate terminal, install frontend dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### Configuration

The frontend uses the following environment variable:

- `NEXT_PUBLIC_API_BASE_URL` – Base URL for the FastAPI backend (defaults to `http://localhost:8000` if not set).

Create a `.env.local` file in the `frontend/` directory if you need to override the default:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
