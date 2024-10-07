import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function TaskForm({ onSubmit, onCancel, initialTask }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "baja",
    status: "pendiente",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setTask({
        ...initialTask,
        dueDate: new Date(initialTask.dueDate),
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
    validate({ [name]: value });
  };

  const handleDateChange = (date) => {
    setTask((prevTask) => ({ ...prevTask, dueDate: date }));
    validate({ dueDate: date });
  };

  const validate = (fieldValues = task) => {
    let tempErrors = { ...errors };
    if ("title" in fieldValues)
      tempErrors.title = fieldValues.title ? "" : "El título es obligatorio.";
    if ("description" in fieldValues)
      tempErrors.description = fieldValues.description
        ? ""
        : "La descripción es obligatoria.";
    if ("dueDate" in fieldValues)
      tempErrors.dueDate =
        fieldValues.dueDate < new Date()
          ? "La fecha de vencimiento no puede ser en el pasado."
          : "";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(task);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Título"
          name="title"
          autoFocus
          value={task.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          aria-label="Título de la tarea"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Descripción"
          name="description"
          multiline
          rows={4}
          value={task.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          autoComplete="off"
          aria-label="Descripción de la tarea"
        />
        <DateTimePicker
          label="Fecha de vencimiento"
          value={task.dueDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="normal"
              error={!!errors.dueDate}
              helperText={errors.dueDate}
              aria-label="Fecha de vencimiento de la tarea"
            />
          )}
        />
        {task.dueDate &&
          task.dueDate >
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) && (
            <Typography color="warning.main">
              Advertencia: La fecha seleccionada es más de un año en el futuro.
            </Typography>
          )}
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">Prioridad</InputLabel>
          <Select
            labelId="priority-label"
            id="priority"
            name="priority"
            value={task.priority}
            label="Prioridad"
            onChange={handleChange}
            aria-label="Prioridad de la tarea"
          >
            <MenuItem value="baja">Baja</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Estado</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={task.status}
            label="Estado"
            onChange={handleChange}
            aria-label="Estado de la tarea"
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en progreso">En progreso</MenuItem>
            <MenuItem value="completada">Completada</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onCancel} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialTask && initialTask._id ? "Actualizar" : "Crear"} Tarea
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskForm;
