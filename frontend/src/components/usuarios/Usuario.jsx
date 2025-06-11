import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AxiosInstance from '../Axios';
import { MaterialReactTable } from 'material-react-table';
import Dayjs from 'dayjs';
import { Box, IconButton, Button, Typography, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener usuarios
  const getUsuarios = () => {
    AxiosInstance.get('usuarios/')
      .then((res) => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener usuarios:', err);
        setLoading(false);
        setMessage('Hubo un problema al cargar los usuarios.');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setMessage(null);
        }, 5000);
      });
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  // Mostrar mensajes de estado
  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage(null);
      }, 5000);
    }
  }, [location.state]);

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre_usuario',
      header: 'Nombre',
      size: 150,
    },
    {
      accessorKey: 'correo',
      header: 'Correo',
      size: 220,
    },
    {
      accessorKey: 'rol.rol',
      header: 'Rol',
      size: 100,
    },
    {
      accessorKey: 'rol.permiso',
      header: 'Permiso',
      size: 120,
    },
    {
      accessorFn: (row) => Dayjs(row.fecha_registro).format('DD-MM-YYYY'),
      header: 'Fecha Registro',
      size: 130,
    },
  ], []);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', marginLeft: -12, marginRight: 20 }}>
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to right, rgba(63, 85, 118, 1), rgba(63, 85, 118, 0.6))',
          color: '#fff',
          padding: '12px 16px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5">Usuarios</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundImage: 'linear-gradient(to right, rgba(16, 17, 22, 0.8), rgba(16, 17, 22, 0.6))',
          }}
          onClick={() => navigate('/agregar-usuario')}
        >
          Agregar Usuario
        </Button>
      </Box>

      {showMessage && (
        <Alert severity="error" sx={{ marginBottom: '16px' }}>
          <strong>{message}</strong>
        </Alert>
      )}

      {loading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : (
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable
            columns={columns}
            data={usuarios}
            enableRowActions
            muiTableContainerProps={{ sx: { width: '100%' } }}
            muiTablePaperProps={{ sx: { width: '100%', boxShadow: 'none' } }}
            muiTableBodyCellProps={{ sx: { fontSize: '1rem' } }}
            muiTableHeadCellProps={{ sx: { fontSize: '1.05rem', fontWeight: 'bold' } }}
            renderRowActions={({ row }) => (
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <IconButton
                  sx={{ color: blue[900] }}
                  component={Link}
                  to={`/editar-usuario/${row.original.id_usuario}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  component={Link}
                  to={`/eliminar-usuario/${row.original.id_usuario}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default Usuario;
