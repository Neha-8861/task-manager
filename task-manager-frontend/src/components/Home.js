import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask, updateTask } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LogoutButton from './components/LogoutButton';

function Home() {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const res = await createTask(task);
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdate = async (id, updatedTask) => {
    try {
      const res = await updateTask(id, updatedTask);
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-black">📝 Task Manager</h1>
          <LogoutButton />
        </div>
        <TaskForm onSubmit={handleAddTask} />
        <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default Home;
