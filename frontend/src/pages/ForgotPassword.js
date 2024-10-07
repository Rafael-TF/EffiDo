import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { forgotPassword } from '../services/api';
import Footer from '../components/Footer';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await forgotPassword(email);
      setMessage('Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.');
    } catch (err) {
      setError('Error al enviar el correo de restablecimiento de contraseña.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Asegura que el contenedor ocupe al menos toda la altura de la pantalla
      }}
    >
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Typography component="h1" variant="h5" sx={{ 
        fontWeight: 700, 
        letterSpacing: '0.1em',
        textAlign: 'center',
        mb: 3
      }}>
        Recuperar Contraseña
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Dirección de correo electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 3, 
            mb: 2,
            borderRadius: '30px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '10px 0',
            backgroundColor: '#1a1a1a',
            '&:hover': {
              backgroundColor: '#333',
            }
          }}
        >
          Enviar enlace de recuperación
        </Button>
      </Box>
    </Container>
    <Footer/>
    </Box>
  );
}

export default ForgotPassword;
