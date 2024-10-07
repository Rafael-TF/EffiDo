import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { login } from '../services/api';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Footer from '../components/Footer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        navigate('/tasks');
      } else {
        throw new Error('No se recibió token de autenticación');
      }
    } catch (error) {
      setError(error.message);
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
      <Container component="main" maxWidth="xs" sx={{ mt: 8, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.1em',
            mb: 3
          }}>
            Iniciar Sesión
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                }
              }}
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
              Iniciar Sesión
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                ¿No tienes una cuenta? {' '}
                <Link to="/register" style={{ 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: 700,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}>
                  Registrarse
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
                ¿Has olvidado tu contraseña? {' '}
                <Link to="/forgot-password" style={{ 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: 700,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}>
                  Recuperar contraseña
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

export default Login;