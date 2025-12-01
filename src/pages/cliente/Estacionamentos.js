import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import estacionamentoService from '../../services/estacionamentoService';

export default function ListarEstacionamentosCliente() {
  const navigate = useNavigate();
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    carregarEstacionamentos();
  }, []);

  const carregarEstacionamentos = async () => {
    try {
      setLoading(true);
      const data = await estacionamentoService.getEstacionamentos();
      
      // Adiciona informação de vagas livres para cada estacionamento
      const estacionamentosComVagas = data.map((est) => {
        // Conta vagas disponíveis (assumindo que existe um array de vagas)
        const vagasLivres = est.vagas?.filter((v) => v.disponivel === 'S').length || 0;
        return {
          ...est,
          vagasLivres,
        };
      });

      setEstacionamentos(estacionamentosComVagas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar estacionamentos:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao carregar estacionamentos',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const formatarHorario = (hora) => {
    if (!hora) return '';
    return hora.slice(0, 5); // Pega apenas HH:MM
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cliente/home')}
          sx={{ mb: 3, color: '#223843' }}
          id="btn-voltar-estacionamentos-cliente"
          data-testid="btn-voltar-estacionamentos-cliente"
        >
          Voltar
        </Button>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#223843' }}>
          Estacionamentos Disponíveis
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2A9D8F' }} />
          </Box>
        ) : estacionamentos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum estacionamento disponível no momento
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {estacionamentos.map((est) => (
              <Grid item xs={12} md={6} lg={4} key={est.id_estacionamento}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#223843', mb: 2 }}>
                      {est.nome}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {est.endereco?.cidade || 'Cidade não informada'} - {est.endereco?.estado || ''}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {est.endereco?.logradouro}, {est.endereco?.numero}
                        {est.endereco?.bairro && ` - ${est.endereco.bairro}`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalParkingIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Capacidade: {est.capacidade} vagas
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatarHorario(est.hora_abertura)} - {formatarHorario(est.hora_fechamento)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor:
                          est.vagasLivres > est.capacidade * 0.2 ? '#2A9D8F' : est.vagasLivres > 0 ? '#CEB290' : '#6C757D',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {est.vagasLivres > 0 ? `${est.vagasLivres} vagas livres` : 'Lotado'}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/cliente/vagas/${est.id_estacionamento}`)}
                      sx={{
                        backgroundColor: '#223843',
                        '&:hover': { backgroundColor: '#1a2c35' },
                      }}
                      disabled={est.vagasLivres === 0}
                      id={`btn-ver-vagas-${est.id_estacionamento}`}
                      data-testid={`btn-ver-vagas-${est.id_estacionamento}`}
                    >
                      {est.vagasLivres > 0 ? 'Ver Vagas' : 'Sem Vagas'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
