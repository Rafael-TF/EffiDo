import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 600,
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      width: '100%',
      height: '100%',
      maxHeight: 'none',
      maxWidth: 'none',
      borderRadius: 0,
    },
  },
}));

const ResponsiveTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  maxWidth: 300,
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'none',
  },
}));

function DeleteAccountModal({ open, handleClose, onConfirmDelete, isMobile }) {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirmDelete = () => {
    if (confirmText.toUpperCase() === 'ELIMINAR') {
      onConfirmDelete();
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen={isMobile}
    >
      <DialogTitle id="alert-dialog-title">
        {"¿Estás seguro de que quieres eliminar tu cuenta?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Esta acción es irreversible. Todos tus datos y tareas serán eliminados permanentemente.
        </DialogContentText>
        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            Para confirmar, escribe "ELIMINAR" en el campo de abajo:
          </Typography>
          <ResponsiveTextField
            autoFocus
            margin="dense"
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirmDelete} 
          color="error" 
          disabled={confirmText.toUpperCase() !== 'ELIMINAR'}
        >
          Eliminar Cuenta
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
}

export default DeleteAccountModal;
