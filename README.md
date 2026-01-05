# Student Check-In System

A full-stack React + Node.js application for managing student attendance and lesson credits.

## Project Structure

- **client/** - React frontend (Vite)
- **server/** - Node.js/Express backend

## Setup

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd client
npm install
```

## Running the Application

### Start the Backend (Terminal 1)

```bash
cd server
npm run dev
```

Server will run on http://localhost:3001

### Start the Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Client will run on http://localhost:3000

## Features

- View all students with their lesson counts
- Check in students (decreases lesson count by 1)
- Visual indicators for low lesson counts
- Real-time updates via REST API
- Responsive design

## API Endpoints

- `GET /api/students` - Get all students
- `POST /api/students/:id/checkin` - Check in a student
- `PUT /api/students/:id` - Update student lessons
