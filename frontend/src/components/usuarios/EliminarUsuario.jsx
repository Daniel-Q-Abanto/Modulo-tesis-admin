import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const EliminarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await AxiosInstance.get(`usuarios/${id}/`); // Ruta adaptada a tu API
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setError('Error al obtener los datos del usuario.');
      }
    };

    fetchUsuario();
  }, [id]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`usuarios/${id}/`); // Ruta adaptada
      navigate('/usuarios', {
        state: {
          message: `El usuario ${usuario.nombre_usuario} fue eliminado correctamente.`
        }
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar el usuario. Intente nuevamente.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/usuarios');
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: 'blur(3px)' }}
      >
        <DialogTitle id="alert-dialog-title">Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
            {usuario ? (
              <>¿Estás seguro de que deseas eliminar al usuario <strong>{usuario.nombre_usuario}</strong>? Esta acción no se puede deshacer.</>
            ) : (
              'Cargando...'
            )}
          </DialogContentText>
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EliminarUsuario;
