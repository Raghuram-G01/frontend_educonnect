const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    
    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET);
    res.json({ user: result.rows[0], token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Assessment
app.post('/api/assessments', authMiddleware, async (req, res) => {
  try {
    const { title, type, duration, questions, description, testCases } = req.body;
    
    const result = await pool.query(
      'INSERT INTO assessments (teacher_id, title, type, duration, questions, description, test_cases) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title, type, duration, JSON.stringify(questions), description, JSON.stringify(testCases)]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Assessments
app.get('/api/assessments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assessments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Assessment by ID
app.get('/api/assessments/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assessments WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit Assessment
app.post('/api/submissions', authMiddleware, async (req, res) => {
  try {
    const { assessmentId, answers, score, totalMarks, violations, blocked } = req.body;
    
    const result = await pool.query(
      'INSERT INTO submissions (assessment_id, student_id, answers, score, total_marks, violations, blocked) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [assessmentId, req.user.id, JSON.stringify(answers), score, totalMarks, JSON.stringify(violations), blocked]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Submissions (for faculty)
app.get('/api/submissions', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.name as student_name, a.title as assessment_title 
      FROM submissions s 
      JOIN users u ON s.student_id = u.id 
      JOIN assessments a ON s.assessment_id = a.id 
      ORDER BY s.submitted_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Submissions by Student
app.get('/api/submissions/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT s.*, a.title as assessment_title FROM submissions s JOIN assessments a ON s.assessment_id = a.id WHERE s.student_id = $1',
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
