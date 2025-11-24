import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import { ReservaCard } from '../../components/reservas';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import reservaService from '../../services/reservaService';

export default function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConcluirOpen, setDialogConcluirOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [concluindo, setConcluindo] = useState(false);

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      setLoading(true);
      const data = await reservaService.getReservasPorCliente();
      setReservas(data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialogCancelar = (reservaId) => {
    setReservaSelecionada(reservaId);
    setDialogOpen(true);
  };

  const handleAbrirDialogConcluir = (reservaId) => {
    setReservaSelecionada(reservaId);
    setDialogConcluirOpen(true);
  };

  const handleFecharDialog = () => {
    setDialogOpen(false);
    setReservaSelecionada(null);
  };

  const handleFecharDialogConcluir = () => {
    setDialogConcluirOpen(false);
    setReservaSelecionada(null);
  };

  const handleCancelarReserva = async () => {
    if (!reservaSelecionada) return;

    try {
      setCancelando(true);
      await reservaService.cancelarReserva(reservaSelecionada);
      handleFecharDialog();
      carregarReservas();
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      alert(error.message || 'Erro ao cancelar reserva');
    } finally {
      setCancelando(false);
    }
  };

  const handleConcluirReserva = async () => {
    if (!reservaSelecionada) return;

    try {
      setConcluindo(true);
      await reservaService.concluirReserva(reservaSelecionada);
      handleFecharDialogConcluir();
      carregarReservas();
    } catch (error) {
      console.error('Erro ao concluir reserva:', error);
      alert(error.message || 'Erro ao concluir reserva');
    } finally {
      setConcluindo(false);
    }
  };

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
          onClick={() => navigate('/cliente/home')}
          sx={{ mb: 3, color: '#223843' }}
        >
          Voltar
        </Button>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#223843' }}>
          Minhas Reservas
        </Typography>

        {reservas.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma reserva encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Você ainda não possui reservas.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {reservas.map((reserva) => (
              <Grid item xs={12} md={6} key={reserva.id_reserva}>
                <Box sx={{ height: '100%' }}>
                  <ReservaCard 
                    reserva={reserva} 
                    onCancelar={handleAbrirDialogCancelar}
                    onConcluir={handleAbrirDialogConcluir}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleFecharDialog}>
        <DialogTitle>Cancelar Reserva</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja cancelar esta reserva?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog} disabled={cancelando}>
            Não
          </Button>
          <Button
            onClick={handleCancelarReserva}
            variant="contained"
            color="error"
            disabled={cancelando}
          >
            {cancelando ? <CircularProgress size={24} /> : 'Sim, Cancelar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogConcluirOpen} onClose={handleFecharDialogConcluir}>
        <DialogTitle>Concluir Reserva</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja concluir esta reserva?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogConcluir} disabled={concluindo}>
            Não
          </Button>
          <Button
            onClick={handleConcluirReserva}
            variant="contained"
            sx={{ backgroundColor: '#2A9D8F', '&:hover': { backgroundColor: '#248277' } }}
            disabled={concluindo}
          >
            {concluindo ? <CircularProgress size={24} /> : 'Sim, Concluir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
