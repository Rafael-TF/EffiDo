import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Aquí deberías cargar las tareas del usuario desde tu API
    // Por ejemplo:
    // fetchTasks().then(setTasks);
  }, []);

  const handleCreateTask = (newTask) => {
    // Lógica para crear una nueva tarea
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    // Lógica para actualizar una tarea
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    // Lógica para eliminar una tarea
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Tareas
      </Typography>
      <TaskForm 
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask} 
        initialTask={editingTask}
        onCancel={handleCancelEdit}
      />
      <TaskList 
        tasks={tasks} 
        onDelete={handleDeleteTask} 
        onEdit={handleEditTask} 
      />
    </Container>
  );
}

export default Tasks;
