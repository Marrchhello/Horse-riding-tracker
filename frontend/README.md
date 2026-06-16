# Horse Training Planner Frontend

This is the frontend implementation for the Horse Training Planner API, built with React, TypeScript, and Tailwind CSS.

## Features Implemented
- **Authentication**: JWT-based secure login and registration.
- **Responsive Layout**: Tailwind CSS ensures the application works smoothly on mobile and desktop devices.
- **Pagination & Filtering**: The `/trainings` page uses a custom-built backend endpoint (`/api/trainings/search`) to support navigating through pages and filtering by Status and Trainer.
- **API Integration**: Connects logically with the FastAPI backend, demonstrating interactions with endpoints like horses, trainers, and trainings.
- **Form Protection**: Implemented native HTML validation attributes alongside React state management.

## Prerequisites
- Node.js (v18 or newer recommended)
- Running instance of the FastAPI backend

## Configuration
The frontend communicates with the backend API via the `VITE_API_URL` environment variable. By default, it expects the backend to be running at `http://localhost:3000/api` or `http://127.0.0.1:8000/api` (the FastApi default port is usually 8000).

To configure the API URL, create a `.env` file in the root of the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

*Note: The backend must have CORS enabled for the frontend URL (e.g., `http://localhost:5173`). The provided `main.py` is configured with `allow_origins=["*"]`.*

## Running the Application

### Option A: Using Docker (Recommended)
You can run both the frontend and backend simultaneously using Docker Compose. Make sure Docker Desktop is running, then simply navigate to the root of the project (one level above this `frontend` directory) and run:

```bash
docker-compose up --build
```
This will:
- Build and start the FastAPI backend on `http://localhost:3000`
- Build and serve the React frontend (via Nginx) on `http://localhost:5173`

You can then access the application at **http://localhost:5173**.

---

### Option B: Running Locally without Docker

#### 1. Install Dependencies
Open your terminal, navigate to the `frontend` directory, and run:

```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

This will launch Vite's development server. Open the provided local URL (typically `http://localhost:5173`) in your web browser.

### 3. Build for Production
To compile the TypeScript code and bundle the React application:

```bash
npm run build
```
The output will be available in the `dist` directory.
