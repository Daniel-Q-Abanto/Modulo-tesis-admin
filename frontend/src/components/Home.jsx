import React from 'react';
import { Box, Typography, Button, Grid, Paper, Card, CardContent, CardActions, CardMedia } from '@mui/material';

const Home = () => {
  const features = [
    {
      title: 'Diseños Personalizados',
      description: 'Crea tus propios diseños únicos con ayuda de nuestra IA generativa.',
      image: './src/images/primero.png',
    },
    {
      title: 'Vista Previa en Tiempo Real',
      description: 'Visualiza cómo quedará tu producto final antes de ordenarlo.',
      image: './src/images/segundo.png',
    },
    {
      title: 'Órdenes Simplificadas',
      description: 'Realiza tus pedidos con facilidad y seguimiento en línea.',
      image: './src/images/tercero.png',
    },
    {
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está siempre disponible para ayudarte con cualquier duda.',
      image: './src/images/cuarto.png',
    },
    {
      title: 'Entrega Rápida',
      description: 'Recibe tus productos en el menor tiempo posible, sin sorpresas.',
      image: './src/images/quinto.png',
    },
    {
      title: 'Diseños Exclusivos',
      description: 'Accede a diseños exclusivos creados especialmente para ti.',
      image: './src/images/sexto.png',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#fff', height: '100%', maxWidth: 20000, width: 1270, marginLeft: -39, marginRight: -38 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Bienvenido al Panel de Administración - SELTA
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'lighter', color: '#777' }}>
          Gestión completa de usuarios, diseños, órdenes y más
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#5c6bc0',
            '&:hover': { backgroundColor: '#3f4f84' },
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '0.9rem',
          }}
          href="/historiales"
        >
          Ir a los Prompts
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                height: '340px',
                width: '350px',
                transition: 'transform 0.3s ease-in-out', // Animación de transformación
                '&:hover': {
                  transform: 'scale(1.05)', // Agrandar al pasar el mouse
                },
              }}
            >
              <CardMedia
                component="img"
                height="225"
                image={item.image}
                alt={item.title}
                sx={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
              />
              <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" href="/productos" sx={{ backgroundColor: '#5c6bc0', color: '#fff', borderRadius: '20px', fontSize: '0.8rem' }}>
                  Ver más
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Why SELTA Section */}
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          ¿Por qué SELTA?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Tecnología IA
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Utilizamos inteligencia artificial para generar diseños únicos al instante.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Gestión Integral
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Administra usuarios, roles, diseños, pedidos y más desde un solo panel.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Experiencia Ágil
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Interfaz moderna y fluida que optimiza tu productividad.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
