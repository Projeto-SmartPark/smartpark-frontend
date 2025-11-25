import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import veiculoService from '../../services/veiculoService';

export default function VeiculosCliente() {
  const navigate = useNavigate();
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [placa, setPlaca] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [dialogExcluir, setDialogExcluir] = useState(false);
  const [veiculoExcluir, setVeiculoExcluir] = useState(null);

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      setLoading(true);
      const data = await veiculoService.getVeiculosPorCliente();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao carregar veículos',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (veiculo) => {
    if (veiculo) {
      setEditingId(veiculo.id_veiculo);
      setPlaca(veiculo.placa);
    } else {
      setEditingId(null);
      setPlaca('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setPlaca('');
  };

  const handleSave = async () => {
    if (!placa.trim()) {
      setAlert({
        show: true,
        message: 'A placa é obrigatória',
        severity: 'error',
      });
      return;
    }

    setSalvando(true);
    try {
      if (editingId) {
        await veiculoService.updateVeiculo(editingId, { placa: placa.toUpperCase() });
        setAlert({
          show: true,
          message: 'Veículo atualizado com sucesso',
          severity: 'success',
        });
      } else {
        await veiculoService.createVeiculo({ placa: placa.toUpperCase() });
        setAlert({
          show: true,
          message: 'Veículo cadastrado com sucesso',
          severity: 'success',
        });
      }
      handleClose();
      carregarVeiculos();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao salvar veículo',
        severity: 'error',
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleAbrirDialogExcluir = (veiculo) => {
    setVeiculoExcluir(veiculo);
    setDialogExcluir(true);
  };

  const handleFecharDialogExcluir = () => {
    setDialogExcluir(false);
    setVeiculoExcluir(null);
  };

  const handleDelete = async () => {
    if (!veiculoExcluir) return;

    try {
      await veiculoService.deleteVeiculo(veiculoExcluir.id_veiculo);
      setAlert({
        show: true,
        message: 'Veículo excluído com sucesso',
        severity: 'success',
      });
      handleFecharDialogExcluir();
      carregarVeiculos();
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao excluir veículo',
        severity: 'error',
      });
    }
  };

  const formatarPlaca = (e) => {
    let valor = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (valor.length > 3) {
      valor = valor.slice(0, 3) + '-' + valor.slice(3, 7);
    }
    setPlaca(valor);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
        <Header showLogout />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#2A9D8F' }} />
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Box sx={{ flex: 1, maxWidth: 1200, width: '100%', mx: 'auto', p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cliente/home')}
          sx={{ mb: 3, color: '#223843' }}
        >
          Voltar
        </Button>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#223843', fontWeight: 600 }}>
            Meus Veículos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: '#2A9D8F',
              '&:hover': { backgroundColor: '#248277' },
            }}
          >
            Adicionar Veículo
          </Button>
        </Box>

        <Card>
          <CardContent>
            {veiculos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Nenhum veículo cadastrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Clique em "Adicionar Veículo" para cadastrar seu primeiro veículo.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#223843' }}>Placa</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#223843' }}>
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {veiculos.map((veiculo) => (
                      <TableRow key={veiculo.id_veiculo} hover>
                        <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{veiculo.placa}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleOpen(veiculo)} sx={{ color: '#2A9D8F', mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleAbrirDialogExcluir(veiculo)} sx={{ color: '#6C757D' }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      <Footer />

      {/* Dialog Adicionar/Editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#223843', color: 'white' }}>
          {editingId ? 'Editar Veículo' : 'Adicionar Veículo'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="Placa"
            fullWidth
            value={placa}
            onChange={formatarPlaca}
            placeholder="ABC-1234"
            inputProps={{ maxLength: 8 }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={salvando} sx={{ color: '#6C757D' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={salvando}
            sx={{
              backgroundColor: '#2A9D8F',
              '&:hover': { backgroundColor: '#248277' },
            }}
          >
            {salvando ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={dialogExcluir} onClose={handleFecharDialogExcluir}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja realmente excluir o veículo <strong>{veiculoExcluir?.placa}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogExcluir} sx={{ color: '#6C757D' }}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
