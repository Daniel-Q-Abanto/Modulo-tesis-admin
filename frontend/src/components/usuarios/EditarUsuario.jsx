import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, TextField, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import useBlockNavigation from '../../hooks/useBlockNavigation';

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [usuario, setUsuario] = useState({});

  const defaultValues = {
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    rol_id: '',
  };

  const { handleSubmit, control, setValue } = useForm({ defaultValues });

  useBlockNavigation(true, '¿Estás seguro de cancelar la edición del usuario?');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await AxiosInstance.get(`usuarios/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const user = res.data;

        setUsuario(user);
        setValue('nombre_usuario', user.nombre_usuario);
        setValue('correo', user.correo);
        setValue('contraseña', '');
        setValue('rol_id', user.rol.id_rol);
      } catch (error) {
        console.error('Error al cargar usuario:', error.response || error);
        setError('Error al cargar los datos del usuario.');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await AxiosInstance.get('roles/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setRoles(res.data);
      } catch (error) {
        console.error('Error al cargar roles:', error.response || error);
        setError('Error al cargar los roles.');
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [id, setValue]);

  const submission = async (data) => {
    const updatedData = {
      nombre_usuario: data.nombre_usuario,
      correo: data.correo,
      ...(data.contraseña ? { password: data.contraseña } : {}),
      rol_id: data.rol_id,
    };

    try {
      const response = await AxiosInstance.put(`usuarios/${id}/`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });

      setSuccessMessage(`El usuario ${data.nombre_usuario} se actualizó correctamente.`);
      setError('');
      setTimeout(() => navigate('/usuarios'), 2000);

    } catch (err) {
      console.error('Error al actualizar el usuario:', err);

      if (err.response) {
        setError(`Error: ${err.response.data.detail || 'Verifique los datos.'}`);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Intenta nuevamente más tarde.');
      } else {
        setError('Ocurrió un error inesperado. Verifica los datos.');
      }
    }
  };

  const handleCancel = () => setOpenDialog(true);
  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (confirm) navigate('/usuarios');
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff',
      padding: '20px',
      overflow: 'hidden', 
      marginTop:-25 // Esto elimina la barra de desplazamiento
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '1000px',  // Aumentamos el maxWidth para hacerlo más grande
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}>
        {/* Título con fondo degradado */}
        <Box sx={{
          backgroundImage: 'linear-gradient(to right, rgba(114, 121, 203, 1), rgba(134, 137, 172, 0.8))',
          color: '#fff',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '8px',
          width:800
        }}>
          <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>Editar Usuario</Typography>
        </Box>

        {/* Mensajes de error o éxito */}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleSubmit(submission)}>
          {/* Formulario */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',  // Dos columnas de igual tamaño
            gap: '40px',
            paddingTop: '20px',
          }}>
            <Controller
              name="nombre_usuario"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                />
              )}
            />

            <Controller
              name="correo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Correo"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                />
              )}
            />

            <Controller
              name="contraseña"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Controller
              name="rol_id"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Rol"
                  select
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol}>
                      {`${rol.rol} (${rol.permiso})`}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: '20px' }}>
            <Button variant="contained" color="error" onClick={handleCancel}>Cancelar</Button>
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#7279CB' }}>Guardar</Button>
          </Box>
        </form>

        {/* Diálogo de confirmación */}
        <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Cancelar Edición</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de cancelar la edición del usuario?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)}>No</Button>
            <Button onClick={() => handleDialogClose(true)} autoFocus>Sí</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EditarUsuario;
