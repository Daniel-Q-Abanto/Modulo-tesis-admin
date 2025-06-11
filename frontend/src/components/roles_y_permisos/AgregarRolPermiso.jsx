import React, { useState } from 'react';
import { Box, Button, Typography, Alert, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const AgregarRolPermiso = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validación con Yup
  const schema = yup.object({
    rol: yup.string().required('Rol es requerido'),
    permiso: yup.string().required('Permiso es requerido'),
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await AxiosInstance.post('roles/', {
        rol: data.rol,
        permiso: data.permiso,
      });

      setSuccessMessage(`El rol ${data.rol} fue creado exitosamente.`);
      setTimeout(() => navigate('/roles'), 2000);
    } catch (error) {
      setError('Error al crear el rol.');
    }
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
      marginTop: -25,
      
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '900px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
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
          <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>Agregar Nuevo Rol</Typography>
        </Box>

        {/* Mostrar errores y mensajes de éxito */}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // Dos columnas de igual tamaño
            gap: '30px',
            paddingTop: '20px',
          }}>
            <Controller
              name="rol"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Rol"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                />
              )}
            />

            <Controller
              name="permiso"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Permiso"
                  fullWidth
                  select
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontSize: '1rem' }}
                >
                  <MenuItem value="control_total">Control Total</MenuItem>
                  <MenuItem value="limitado">Acceso Limitado</MenuItem>
                </TextField>
              )}
            />
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: '20px' }}>
            <Button variant="contained" color="error" onClick={() => navigate('/roles')}>Cancelar</Button>
            <Button variant="contained" type="submit" sx={{ backgroundColor: '#7279CB' }}>Guardar</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AgregarRolPermiso;
