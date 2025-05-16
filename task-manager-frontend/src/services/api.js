import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Tasks API calls with auth headers
export const fetchTasks = (token) => API.get('/tasks', {
  headers: { Authorization: `Bearer ${token}` },
});

export const createTask = (task, token) => API.post('/tasks', task, {
  headers: { Authorization: `Bearer ${token}` },
});

export const deleteTask = (id, token) => API.delete(`/tasks/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const updateTask = (id, updatedTask, token) => API.put(`/tasks/${id}`, updatedTask, {
  headers: { Authorization: `Bearer ${token}` },
});

// User Authentication
export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (credentials) => API.post('/login', credentials);
