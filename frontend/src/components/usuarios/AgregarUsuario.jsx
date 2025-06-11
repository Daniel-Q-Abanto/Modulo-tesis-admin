import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, IconButton, InputAdornment, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AgregarUsuario = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    rol_id: '',
  };

  // Validación con Yup
  const schema = yup.object({
    nombre_usuario: yup.string().required('Nombre es requerido'),
    correo: yup.string().email('Correo inválido').required('Correo es requerido'),
    contraseña: yup.string().required('Contraseña es requerida'),
    rol_id: yup.number().required('Rol es requerido'),
  });

  const { handleSubmit, control } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    // Obtener roles
    AxiosInstance.get('roles/')
      .then((res) => setRoles(res.data))
      .catch((err) => {
        console.error('Error al cargar roles:', err);
        setError('No se pudieron cargar los roles.');
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      await AxiosInstance.post('usuarios/', {
        nombre_usuario: data.nombre_usuario,
        correo: data.correo,
        password: data.contraseña,  // Asegúrate de enviar "password"
        rol_id: data.rol_id,
      });

      setSuccessMessage(`El usuario ${data.nombre_usuario} fue creado exitosamente.`);
      setError(''); // Limpiar errores anteriores
      setTimeout(() => {
        navigate('/usuarios', {
          state: { message: successMessage }
        });
      }, 2000);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.detail || 'Verifique los datos ingresados.'}`);
        setSuccessMessage('');
      } else {
        setError('Ocurrió un error inesperado.');
        setSuccessMessage('');
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
      height: '100vh', // Ocupa toda la altura de la pantalla
      backgroundColor: '#fff',  // Cambié el color de fondo a blanco
      padding: '20px',
      overflow: 'hidden',
      marginTop: -25,  // Asegura que no haya scroll
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '900px',  // Ajustamos el maxWidth para hacerlo más grande
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',  // Evita el desbordamiento
      }}>

        {/* Header con fondo degradado */}
        <Box sx={{
          backgroundImage: 'linear-gradient(to right, rgba(114, 121, 203, 1), rgba(134, 137, 172, 0.8))',
          color: '#fff',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          borderRadius: '8px',
          width:800
        }}>
          <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>Agregar Usuario</Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Usamos un Grid para organizar en dos columnas */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',  // Dos columnas de igual tamaño
            gap: '30px',
            paddingTop: '20px',
            overflow: 'visible', // Asegura que no haya overflow
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

        <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Cancelar creación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de cancelar la creación del usuario?
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

export default AgregarUsuario;
