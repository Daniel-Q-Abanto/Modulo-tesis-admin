import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Alert, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarRolPermiso = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol, setRol] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar el rol al editar
  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await AxiosInstance.get(`roles/${id}/`);
        setRol(response.data);
      } catch (err) {
        setError('Error al obtener el rol');
      }
    };
    fetchRol();
  }, [id]);

  // Inicializar el formulario después de obtener los datos
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      rol: '',
      permiso: '',
    },
  });

  // Establecer los valores del formulario cuando los datos estén disponibles
  useEffect(() => {
    if (rol.rol) {
      setValue('rol', rol.rol);
      setValue('permiso', rol.permiso);
    }
  }, [rol, setValue]);

  const onSubmit = async (data) => {
    try {
      // Actualizar los datos del rol
      await AxiosInstance.put(`roles/${id}/`, data);
      setSuccessMessage(`El rol ${data.rol} se actualizó correctamente.`);
      setTimeout(() => navigate('/roles'), 2000);
    } catch (error) {
      setError('Error al actualizar el rol.');
    }
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
      marginTop:-25 
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
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '8px',
          width:800
        }}>
          <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>Editar Rol</Typography>
        </Box>

        {/* Mostrar errores y mensajes de éxito */}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',  // Dos columnas de igual tamaño
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

export default EditarRolPermiso;
