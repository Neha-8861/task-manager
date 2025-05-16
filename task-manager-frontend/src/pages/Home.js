import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, deleteTask, updateTask } from '../services/api';

import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import LogoutButton from '../components/LogoutButton';

function Home() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    getTasks();
  }, [navigate]);

  const getTasks = async () => {
    try {
      const res = await fetchTasks(token); // ✅ Pass token
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const res = await createTask(task, token); // ✅ Pass token
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id, token); // ✅ Pass token
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdate = async (id, updatedTask) => {
    try {
      const res = await updateTask(id, updatedTask, token); // ✅ Pass token
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md relative">
        <LogoutButton />
        <h1 className="text-3xl font-bold text-center mb-6 text-black">📝 Task Manager</h1>
        <TaskForm onSubmit={handleAddTask} />
        <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default Home;
