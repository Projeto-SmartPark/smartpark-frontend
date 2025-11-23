import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Footer } from '../../components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ElderlyIcon from '@mui/icons-material/Elderly';
import EvStationIcon from '@mui/icons-material/EvStation';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import vagaService from '../../services/vagaService';
import estacionamentoService from '../../services/estacionamentoService';

export default function VagasCliente() {
  const navigate = useNavigate();
  const { estacionamentoId } = useParams();
  const [vagas, setVagas] = useState([]);
  const [estacionamento, setEstacionamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    carregarDados();
  }, [estacionamentoId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [vagasData, estacionamentoData] = await Promise.all([
        vagaService.getVagasByEstacionamento(estacionamentoId),
        estacionamentoService.getEstacionamentoById(estacionamentoId),
      ]);
      setVagas(vagasData);
      setEstacionamento(estacionamentoData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao carregar dados',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const getIconeTipo = (tipo) => {
    switch (tipo) {
      case 'carro':
        return <DirectionsCarIcon />;
      case 'moto':
        return <TwoWheelerIcon />;
      case 'deficiente':
        return <AccessibleIcon />;
      case 'idoso':
        return <ElderlyIcon />;
      case 'eletrico':
        return <EvStationIcon />;
      default:
        return <MoreHorizIcon />;
    }
  };

  const getNomeTipo = (tipo) => {
    const tipos = {
      carro: 'Carro',
      moto: 'Moto',
      deficiente: 'Deficiente',
      idoso: 'Idoso',
      eletrico: 'Elétrico',
      outro: 'Outro',
    };
    return tipos[tipo] || tipo;
  };

  const vagasLivres = vagas.filter((v) => v.disponivel === 'S').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        <Header showLogout />
        <Container sx={{ flexGrow: 1, py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#2A9D8F' }} />
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cliente/estacionamentos')}
          sx={{ mb: 3, color: '#223843' }}
        >
          Voltar
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843', mb: 1 }}>
            {estacionamento?.nome}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {estacionamento?.endereco?.logradouro}, {estacionamento?.endereco?.numero} -{' '}
            {estacionamento?.endereco?.cidade}/{estacionamento?.endereco?.estado}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={`${vagasLivres} vagas livres`}
              sx={{
                backgroundColor: vagasLivres > 0 ? '#2A9D8F' : '#6C757D',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`Total: ${vagas.length} vagas`}
              sx={{
                backgroundColor: '#223843',
                color: 'white',
              }}
            />
          </Box>
        </Box>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        {vagas.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma vaga cadastrada
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {vagas.map((vaga) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={vaga.id_vaga}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: vaga.disponivel === 'S' ? '#ffffff' : '#f5f5f5',
                    border: vaga.disponivel === 'S' ? '2px solid #2A9D8F' : '2px solid #e0e0e0',
                    cursor: vaga.disponivel === 'S' ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    '&:hover': vaga.disponivel === 'S'
                      ? {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        }
                      : {},
                  }}
                  onClick={() => {
                    if (vaga.disponivel === 'S') {
                      // Aqui você pode adicionar a lógica de reserva futuramente
                      setAlert({
                        show: true,
                        message: 'Funcionalidade de reserva em desenvolvimento',
                        severity: 'info',
                      });
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 2,
                      px: 1,
                    }}
                  >
                    <Box
                      sx={{
                        color: vaga.disponivel === 'S' ? '#2A9D8F' : '#6C757D',
                        mb: 1,
                      }}
                    >
                      {vaga.disponivel === 'S' ? (
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      ) : (
                        <BlockIcon sx={{ fontSize: 32 }} />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: vaga.disponivel === 'S' ? '#223843' : '#6C757D',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                      }}
                    >
                      {vaga.identificacao}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        color: vaga.disponivel === 'S' ? '#6C757D' : '#9e9e9e',
                      }}
                    >
                      <Box sx={{ mr: 0.5, display: 'flex', fontSize: 16 }}>{getIconeTipo(vaga.tipo)}</Box>
                      <Typography variant="caption">{getNomeTipo(vaga.tipo)}</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontWeight: 600,
                        color: vaga.disponivel === 'S' ? '#2A9D8F' : '#6C757D',
                      }}
                    >
                      {vaga.disponivel === 'S' ? 'Livre' : 'Ocupada'}
                    </Typography>
                  </CardContent>
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
