# EduConnect Backend

## Setup Instructions

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE educonnect;
\c educonnect
```

### 3. Run Schema
```bash
psql -U postgres -d educonnect -f schema.sql
```

### 4. Configure Environment
Edit `.env` file with your PostgreSQL credentials:
```
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/educonnect
JWT_SECRET=your_secret_key
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Start Server
```bash
npm start
```

## API Endpoints

### Auth
- POST `/api/register` - Register new user
- POST `/api/login` - Login user

### Assessments
- POST `/api/assessments` - Create assessment (teacher only)
- GET `/api/assessments` - Get all assessments
- GET `/api/assessments/:id` - Get assessment by ID

### Submissions
- POST `/api/submissions` - Submit assessment (student)
- GET `/api/submissions` - Get all submissions (faculty)
- GET `/api/submissions/student/:studentId` - Get student submissions

## Database Schema

### Users
- id, name, email, password, role, created_at

### Assessments
- id, teacher_id, title, type, duration, questions, description, test_cases, created_at

### Submissions
- id, assessment_id, student_id, answers, score, total_marks, violations, blocked, submitted_at
