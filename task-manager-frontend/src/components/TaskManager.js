import React, { useState } from 'react';
import TaskForm from './TaskForm'; // Import TaskForm

const TaskManager = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [isSubmitting, setIsSubmitting] = useState(false); // To track if the form is submitting
  const [errorMessage, setErrorMessage] = useState(''); // To display error messages

  // Handle the task submission (called by TaskForm)
  const handleAddTask = async (task) => {
    setIsSubmitting(true); // Set submitting to true when adding task
    setErrorMessage(''); // Reset error message

    try {
      // Simulate an API call (replace with actual API call if you have one)
      // Example: await axios.post('/api/tasks', task);
      
      // Add the new task to the list of tasks
      setTasks([...tasks, task]);

      setIsSubmitting(false); // Reset submitting to false
    } catch (error) {
      setIsSubmitting(false); // Reset submitting to false
      setErrorMessage('Failed to add task. Please try again!'); // Show error if task submission fails
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      
      {/* Pass props to TaskForm */}
      <TaskForm
        onSubmit={handleAddTask} // Handle adding the task
        isSubmitting={isSubmitting} // Loading state
        errorMessage={errorMessage} // Error message (if any)
      />

      {/* Display the tasks */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
