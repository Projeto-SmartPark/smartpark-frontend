import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';

export default function HomeGestor() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#223843', textAlign: 'center' }}>
          Painel do Gestor
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
                  onClick={() => navigate('/gestor/estacionamentos')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ManageAccountsIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Gerenciar Estacionamentos
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
                  onClick={() => navigate('/gestor/tarifas')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AttachMoneyIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Gerenciar Tarifas
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
                  onClick={() => navigate('/gestor/acessos')}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 80, color: '#2A9D8F', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#223843', lineHeight: 1.2 }}>
                      Gerenciar Acessos
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
