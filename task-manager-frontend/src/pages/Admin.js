// src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTask } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function Admin() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // track component mounted state
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadTasks = async () => {
      try {
        const res = await fetchTasks(token);
        if (isMounted) setTasks(res.data);
      } catch (err) {
        console.error('Error loading tasks:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteTask(id, token);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await updateTask(id, { completed: !currentStatus }, token);
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen">
      <LogoutButton />
      <h2 className="text-2xl font-bold mb-4">Welcome to the admin dashboard!</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="bg-white p-4 mb-2 rounded shadow">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-700">{task.description}</p>
            <p className="text-sm text-gray-500">{task.completed ? '✅ Completed' : '❌ Incomplete'}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleToggleComplete(task._id, task.completed)}
                className={`px-3 py-1 rounded ${task.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
