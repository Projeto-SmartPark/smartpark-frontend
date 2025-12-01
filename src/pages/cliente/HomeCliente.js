import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HistoryIcon from '@mui/icons-material/History';

export default function HomeCliente() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#223843', textAlign: 'center' }}>
          Bem-vindo ao SmartPark
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ height: 250, width: '100%', maxWidth: 350, margin: '0 auto' }}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate('/cliente/estacionamentos')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  id="card-estacionamentos-cliente"
                  data-testid="card-estacionamentos-cliente"
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <LocalParkingIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Listar Estacionamentos
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ height: 250, width: '100%', maxWidth: 350, margin: '0 auto' }}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate('/cliente/reservas')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  id="card-reservas-cliente"
                  data-testid="card-reservas-cliente"
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <BookmarksIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Minhas Reservas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ height: 250, width: '100%', maxWidth: 350, margin: '0 auto' }}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate('/cliente/veiculos')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  id="card-veiculos-cliente"
                  data-testid="card-veiculos-cliente"
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <DirectionsCarIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Meus Veículos
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ height: 250, width: '100%', maxWidth: 350, margin: '0 auto' }}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate('/cliente/acessos')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  id="card-acessos-cliente"
                  data-testid="card-acessos-cliente"
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Meus Acessos
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
