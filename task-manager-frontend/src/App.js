// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { decodeJWT } from './utils/jwtUtils';
import Register from './pages/Register';

// Protected route for normal users
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = decodeJWT(token);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protected route for admins only
function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = decodeJWT(token);

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Redirect user based on role
function RoleBasedRedirect() {
  const token = localStorage.getItem('token');
  const user = decodeJWT(token);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
