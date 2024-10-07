import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { resetPassword } from '../services/api';
import { useSpring, animated } from 'react-spring';

function LoadingScreen({ message }) {
  const props = useSpring({
    to: { opacity: 1, transform: 'scale(1)' },
    from: { opacity: 0, transform: 'scale(0.8)' },
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.div style={{
      ...props,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(240, 240, 240, 0.9)',
      zIndex: 9999,
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1a1a1a', textAlign: 'center' }}>
        {message}
      </Typography>
      <CircularProgress size={60} thickness={4} sx={{ color: '#1a1a1a' }} />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 500, color: '#1a1a1a' }}>
        Redirigiendo...
      </Typography>
    </animated.div>
  );
}

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await resetPassword(token, password);
      console.log('Respuesta del servidor:', response);
      setMessage('Contraseña modificada con éxito');
      setIsLoading(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <Container maxWidth="sm">
      {isLoading && <LoadingScreen message="Contraseña modificada con éxito" />}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mt: 4 }}>
        Restablecer contraseña
      </Typography>
      {message && !isLoading && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Nueva contraseña"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar nueva contraseña"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: '#1a1a1a',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Restablecer contraseña
        </Button>
      </Box>
    </Container>
  );
}

export default ResetPassword;
