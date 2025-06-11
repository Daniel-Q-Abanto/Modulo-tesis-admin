import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Container, Paper } from '@mui/material';

const teamMembers = [
  {
    name: 'Daniel Quispe',
    role: 'FullStack Developer',
    image: '/src/images/daniel.jpg',
    description: 'Desarrollador FullStack, responsable de la integración de IA generativa y la plataforma web.',
  },
  {
    name: 'Rafael Arce',
    role: 'Diseñador UX/UI',
    image: '/src/images/rafael.jpg',
    description: 'Diseñador UX/UI, asegura que la experiencia del usuario en nuestra plataforma sea intuitiva y funcional.',
  },
];

const About = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Introducción */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#3A3A3A' }}>
            Sobre Nosotros
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#777', lineHeight: 1.6 }}>
            En Selta, nuestra misión es ofrecer una plataforma de diseño personalizada mediante inteligencia artificial. 
            Permitiendo a nuestros usuarios crear productos únicos como polos, tazas, y más, con un simple clic. Nuestra 
            visión es democratizar la personalización y facilitar la creación de productos exclusivos de forma accesible para todos.
          </Typography>
        </Box>

        {/* Misión y Visión */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, backgroundColor: '#e3f2fd', borderRadius: '8px', boxShadow: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#1A73E8', fontWeight: 'bold' }}>
                Nuestra Misión
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Democratizar el acceso al diseño personalizado con IA, permitiendo a cualquiera crear y recibir productos únicos
                en pocos pasos.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, backgroundColor: '#f1f8e9', borderRadius: '8px', boxShadow: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#388E3C', fontWeight: 'bold' }}>
                Nuestra Visión
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Ser la plataforma líder en Latinoamérica para la personalización de productos con IA, destacando la innovación
                y la creatividad individual.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Equipo */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ color: '#1A73E8', fontWeight: 'bold' }}>
            Nuestro Equipo
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, borderRadius: '12px', maxWidth: '300px' }}>
                  <CardMedia component="img" height="200" image={member.image} alt={member.name} sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} />
                  <CardContent>
                    <Typography variant="h5" sx={{ color: '#333' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777', marginTop: 2 }}>
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
