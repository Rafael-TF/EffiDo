import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Button, CircularProgress } from '@mui/material';
import { verifyEmail } from '../services/api';

function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        // console.log('Intentando verificar con token:', token);
        const response = await verifyEmail(token);
        if (response && response.message) {
          setStatus('success');
          setMessage(response.message);
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
          }
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } catch (error) {
        // console.error('Error detallado de verificación:', error);
        setStatus('error');
        setMessage(error.message || 'Error desconocido al verificar el email');
      }
    };
    verify();
  }, [token]);

  const handleContinue = () => {
    navigate('/login');
  };

  if (status === 'verifying') {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {status === 'success' ? 'Verificación Exitosa' : 'Error de Verificación'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          onClick={handleContinue}
          sx={{ mt: 3 }}
        >
          {status === 'success' ? 'Ir a iniciar sesión' : 'Volver a intentar'}
        </Button>
      </Box>
    </Container>
  );
}

export default VerifyEmail;