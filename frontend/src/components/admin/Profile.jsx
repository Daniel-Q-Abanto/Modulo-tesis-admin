import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Box, Typography, Container, Avatar,
  CircularProgress, MenuItem, Alert
} from '@mui/material';
import axios from 'axios';
import authService from '../../services/authService';

const Profile = () => {
  const [adminData, setAdminData] = useState({
    id: '',  // IMPORTANTE para guardar imagen por usuario
    nombre_usuario: '',
    correo: '',
    rol: '',
    permiso: '',
    imagen: '',
    password: '',
    confirmPassword: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const roles = [
    { id: 1, rol: 'Administrador', permiso: 'Control Total' },
    { id: 2, rol: 'Trabajador', permiso: 'Acceso Limitado' },
    { id: 3, rol: 'Cliente', permiso: 'Ninguno' }
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user?.access) return;

        const response = await axios.get('http://127.0.0.1:8000/me/', {
          headers: { Authorization: `Bearer ${user.access}` }
        });

        const userData = response.data;
        setAdminData({
          id: userData.id,
          nombre_usuario: userData.nombre_usuario,
          correo: userData.correo,
          rol: userData.rol,
          permiso: userData.permiso,
          imagen: userData.imagen || '',
          password: '',
          confirmPassword: ''
        });
        setOriginalData(userData);

        const storedImage = localStorage.getItem(`userImage_${userData.id}`);
        if (storedImage) {
          setImagePreview(storedImage);
        } else {
          setImagePreview(userData.imagen || '');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del perfil', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      localStorage.setItem(`userImage_${adminData.id}`, imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminData.password !== adminData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const formData = new FormData();
    formData.append('nombre_usuario', adminData.nombre_usuario);
    formData.append('correo', adminData.correo);
    formData.append('rol', adminData.rol);
    formData.append('permiso', adminData.permiso);
    if (imageFile) formData.append('imagen', imageFile);
    if (adminData.password) formData.append('password', adminData.password);

    try {
      const user = authService.getCurrentUser();
      await axios.put('http://127.0.0.1:8000/me/', formData, {
        headers: { Authorization: `Bearer ${user.access}` }
      });

      setIsEditing(false);
      setMessage('Datos actualizados con éxito');
      setSeverity('success');

      setAdminData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      setOriginalData({ ...adminData, password: '', confirmPassword: '' });

      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      setMessage('Error al actualizar el perfil');
      setSeverity('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleCancel = () => {
    setAdminData({ ...originalData, password: '', confirmPassword: '' });
    setIsEditing(false);
    const storedImage = localStorage.getItem(`userImage_${originalData.id}`);
    setImagePreview(storedImage || originalData.imagen || '');
  };

  const handleRoleChange = (e) => {
    const selectedRole = roles.find(r => r.id === parseInt(e.target.value));
    if (selectedRole) {
      setAdminData(prev => ({
        ...prev,
        rol: selectedRole.id,
        permiso: selectedRole.permiso
      }));
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar alt="Imagen de perfil" src={imagePreview || adminData.imagen} sx={{ width: 100, height: 100 }} />
        <Typography component="h1" variant="h5">Perfil</Typography>
        {message && <Alert severity={severity} sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            value={adminData.nombre_usuario}
            onChange={handleInputChange}
            name="nombre_usuario"
            disabled={!isEditing}
            required
          />
          <TextField
            label="Correo"
            fullWidth
            margin="normal"
            value={adminData.correo}
            onChange={handleInputChange}
            name="correo"
            disabled={!isEditing}
            required
          />
          <TextField
            select
            label="Rol"
            fullWidth
            margin="normal"
            value={adminData.rol}
            onChange={handleRoleChange}
            name="rol"
            disabled
            required
          >
            {roles.map(role => (
              <MenuItem key={role.id} value={role.id}>
                {role.rol}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Permiso"
            fullWidth
            margin="normal"
            value={adminData.permiso}
            name="permiso"
            disabled
          />
          <TextField
            label="Contraseña"
            fullWidth
            margin="normal"
            type="password"
            value={adminData.password}
            onChange={handleInputChange}
            name="password"
            disabled={!isEditing}
          />
          <TextField
            label="Confirmar Contraseña"
            fullWidth
            margin="normal"
            type="password"
            value={adminData.confirmPassword}
            onChange={handleInputChange}
            name="confirmPassword"
            disabled={!isEditing}
          />
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Subir Imagen
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {!isEditing && (
            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
              Editar Mis Datos
            </Button>
          )}

          {isEditing && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" type="submit">
                Guardar Cambios
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancelar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
