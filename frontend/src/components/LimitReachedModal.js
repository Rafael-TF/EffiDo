import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function LimitReachedModal({ isOpen, onClose }) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="limit-reached-modal-title"
      aria-describedby="limit-reached-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography id="limit-reached-modal-title" variant="h6" component="h2" gutterBottom>
          Límite de tareas alcanzado
        </Typography>
        <Typography id="limit-reached-modal-description" sx={{ mt: 2 }}>
          Has alcanzado el límite de 3 tareas en el modo demo. Para crear más tareas, por favor inicia sesión.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cerrar
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            onClick={onClose}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default LimitReachedModal;
