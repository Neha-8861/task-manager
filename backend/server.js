// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Models
const Task = require('./models/Task');
const User = require('./models/User');

// Config
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ----------- New Admin Middleware -----------
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }
  next();
};

// ----------------------------
// Authentication Routes
// ----------------------------

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ----------------------------
// Admin Users Route (admin only)
// ----------------------------
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ----------------------------
// Task Routes (CRUD)
// ----------------------------

// GET all tasks (public)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('user', 'username');
    res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create task (protected)
app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      user: req.user.userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task (protected, only owner)
app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task (protected, only owner)
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ----------------------------
// Admin Panel Route
// ----------------------------
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ----------------------------
// Connect to MongoDB and Start Server
// ----------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
