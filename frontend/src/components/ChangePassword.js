import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { changePassword } from '../services/api';

function ChangePassword() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    try {
      await changePassword(passwords.current, passwords.new);
      setSuccess('Contraseña cambiada exitosamente');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        name="current"
        label="Contraseña actual"
        type="password"
        id="current-password"
        value={passwords.current}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="new"
        label="Nueva contraseña"
        type="password"
        id="new-password"
        value={passwords.new}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirm"
        label="Confirmar nueva contraseña"
        type="password"
        id="confirm-password"
        value={passwords.confirm}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Cambiar Contraseña
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
    </Box>
  );
}

export default ChangePassword;
