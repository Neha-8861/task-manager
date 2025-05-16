import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const toggleCompletion = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: !completed,
      });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    })
    .filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Task Manager</h2>

      {/* 🔍 Search Input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🎯 Filter Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {['all', 'completed', 'incomplete'].map(f => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === f
                ? (f === 'completed'
                    ? 'bg-green-600 text-white'
                    : f === 'incomplete'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white')
                : 'bg-gray-200'
            }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* 📋 Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No matching tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li key={task._id} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <strong className="text-lg">{task.title}</strong><br />
                  {task.description && <em className="text-gray-600">{task.description}</em>}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${task.completed ? 'text-green-500' : 'text-red-500'}`}>
                    {task.completed ? '✅ Completed' : '❌ Incomplete'}
                  </span>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => toggleCompletion(task._id, task.completed)}
                  >
                    Mark as {task.completed ? 'Incomplete' : 'Completed'}
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
