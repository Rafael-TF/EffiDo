import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Popover } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

function DayTasksPanel({ tasks, anchorEl, onClose, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (date instanceof Date && isValid(date)) {
      return format(date, "d 'de' MMMM", { locale: es });
    }
    return 'Fecha no disponible';
  };

  const dateToShow = tasks.length > 0 && tasks[0].start ? formatDate(new Date(tasks[0].start)) : 'Fecha no disponible';

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2, maxWidth: 300, maxHeight: 400, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Tareas para el {dateToShow}
        </Typography>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task.resource)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.resource._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={task.title}
                secondary={`Prioridad: ${task.resource.priority}, Estado: ${task.resource.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
}

export default DayTasksPanel;
