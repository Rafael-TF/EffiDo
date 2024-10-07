import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import TaskList from '../components/TaskList';
import { getAllTasks, deleteTask } from '../services/api';

function TasksPage({ isDemo = false }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!isDemo) {
      loadTasks();
    } else {
      // Cargar tareas de demostración
      setTasks([
        { _id: '1', title: 'Tarea de demo 1', description: 'Esta es una tarea de demostración', priority: 'alta', status: 'pendiente' },
        { _id: '2', title: 'Tarea de demo 2', description: 'Esta es otra tarea de demostración', priority: 'media', status: 'en progreso' },
      ]);
    }
  }, [isDemo]);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (isDemo) {
      setTasks(tasks.filter(task => task._id !== taskId));
    } else {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    // Implementar lógica de edición
    console.log('Editar tarea:', task);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {isDemo ? 'Tareas de Demostración' : 'Mis Tareas'}
      </Typography>
      <TaskList 
        tasks={tasks} 
        onDelete={handleDeleteTask} 
        onEdit={handleEditTask} 
      />
    </Container>
  );
}

export default TasksPage;
