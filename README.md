# MediTrack - Medical Appointment Management System

MediTrack is a comprehensive medical appointment management system that facilitates the interaction between patients and healthcare providers.

## Project Structure

```
MediTrack/
├── backend/          # Spring Boot backend
├── frontend/         # Angular frontend
```

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Security with JWT
- PostgreSQL 15
- Maven

### Frontend
- Angular 15+
- Angular Material
- TypeScript

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- PostgreSQL 15
- Docker

## Getting Started

### Database Setup
```bash
# Start PostgreSQL container
cd backend
docker compose up -d
```

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
The backend server will start on http://localhost:8080

### Frontend Setup
```bash
cd frontend/meditrack
npm install
ng serve
```
The frontend application will be available on http://localhost:4200

## Default Users

The system comes with two pre-configured users:
- Admin: username: "admin", password: "admin123"
- Doctor: username: "doctor", password: "doctor123"

## Security

- All sensitive endpoints are protected with JWT authentication
- Passwords are hashed using BCrypt
- CORS is configured for secure cross-origin communication

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new patient
- POST /api/auth/login - Authenticate user and get JWT token

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Environment Setup

Make sure to set up your environment variables properly. Create a `.env` file in the backend directory with the following variables:
- JWT_SECRET
- DATABASE_URL (if different from default)
- Other sensitive configuration

