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

const EliminarRolPermiso = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol, setRol] = useState({});
  const [openDialog, setOpenDialog] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await AxiosInstance.get(`roles/${id}/`);
        setRol(response.data);
      } catch (error) {
        setError('Error al obtener el rol');
      }
    };
    fetchRol();
  }, [id]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`roles/${id}/`);
      navigate('/roles', {
        state: { message: `El rol ${rol.rol} fue eliminado correctamente.` },
      });
    } catch (error) {
      setError('Error al eliminar el rol.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/roles'); // Redirigir a roles cuando se cierre el diálogo
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
        <DialogTitle id="alert-dialog-title">Eliminar Rol</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
            {rol ? (
              <>¿Estás seguro de que deseas eliminar el rol <strong>{rol.rol}</strong>? Esta acción no se puede deshacer.</>
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

export default EliminarRolPermiso;
