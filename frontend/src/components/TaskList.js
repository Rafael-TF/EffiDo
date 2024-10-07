import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, IconButton, Chip, Divider, FormControl, InputLabel, Select, MenuItem, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function TaskList({ tasks, onDelete, onEdit, isDemo, onAddTask }) {
  const [filter, setFilter] = useState('all');

  if (tasks.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, mt: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="light">
          {isDemo ? "¡Bienvenido a la demostración!" : "¡Tu lista de tareas está vacía!"}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {isDemo 
            ? "Comienza creando tu primera tarea de prueba." 
            : "Es un buen momento para empezar a organizar tus actividades."}
        </Typography>
      </Paper>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return '#FF4D4F';
      case 'media': return '#FAAD14';
      case 'baja': return '#52C41A';
      default: return '#1890FF';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada': return '#52C41A';
      case 'en progreso': return '#1890FF';
      case 'pendiente': return '#FAAD14';
      default: return '#D9D9D9';
    }
  };

  const handleEditTask = (task) => {
    onEdit({
      _id: task._id,
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      priority: task.priority || 'baja',
      status: task.status || 'pendiente'
    });
  };

  const handleDelete = (taskId) => {
    onDelete(taskId);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getCompletedPercentage = () => {
    const completedTasks = tasks.filter(task => task.status === 'completada').length;
    return (completedTasks / tasks.length) * 100;
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <Box>
      {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="filter-label">Filtrar por</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filtrar por"
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="completada">Completadas</MenuItem>
            <MenuItem value="pendiente">Pendientes</MenuItem>
            <MenuItem value="en progreso">En progreso</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ width: '50%' }}>
          <Typography variant="body2" color="text.secondary">Progreso general</Typography>
          <LinearProgress variant="determinate" value={getCompletedPercentage()} />
        </Box>
      </Box> */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} key={task.id || task._id}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 4,
                transition: 'all 0.3s',
                border: `1px solid ${isOverdue(task.dueDate) ? 'red' : '#f0f0f0'}`,
                '&:hover': {
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" component="div" fontWeight="medium" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: { xs: 'none', sm: 'block' } }}>
                    {task.description}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleEditTask(task)} sx={{ color: 'primary.main', mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(task.id || task._id)} sx={{ color: 'error.main' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                <Chip 
                  label={task.priority}
                  size="small"
                  sx={{ 
                    bgcolor: getPriorityColor(task.priority),
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2
                  }}
                />
                <Chip 
                  label={task.status}
                  size="small"
                  sx={{ 
                    bgcolor: getStatusColor(task.status),
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2
                  }}
                />
                {task.dueDate && (
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: es })}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TaskList;