import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Footer } from '../../components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import vagaService from '../../services/vagaService';
import estacionamentoService from '../../services/estacionamentoService';

export default function GerenciarVagas() {
  const navigate = useNavigate();
  const { estacionamentoId } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [estacionamento, setEstacionamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    identificacao: '',
    tipo: 'carro',
    disponivel: true,
  });

  const tiposVaga = [
    { value: 'carro', label: 'Carro' },
    { value: 'moto', label: 'Moto' },
    { value: 'deficiente', label: 'Deficiente' },
    { value: 'idoso', label: 'Idoso' },
    { value: 'eletrico', label: 'Elétrico' },
    { value: 'outro', label: 'Outro' },
  ];

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

  const handleOpenDialog = (vaga) => {
    if (vaga) {
      setEditingId(vaga.id_vaga);
      setFormData({
        identificacao: vaga.identificacao,
        tipo: vaga.tipo || 'carro',
        disponivel: vaga.disponivel === 'S',
      });
    } else {
      setEditingId(null);
      setFormData({
        identificacao: '',
        tipo: 'carro',
        disponivel: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeletingId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingId(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.identificacao) {
        setAlert({
          show: true,
          message: 'Preencha a identificação da vaga',
          severity: 'error',
        });
        return;
      }

      if (!formData.tipo) {
        setAlert({
          show: true,
          message: 'Selecione o tipo da vaga',
          severity: 'error',
        });
        return;
      }

      const payload = {
        identificacao: formData.identificacao,
        tipo: formData.tipo,
        disponivel: formData.disponivel ? 'S' : 'N',
        estacionamento_id: parseInt(estacionamentoId),
      };

      if (editingId !== null) {
        await vagaService.updateVaga(editingId, payload);
        setAlert({
          show: true,
          message: 'Vaga atualizada com sucesso!',
          severity: 'success',
        });
      } else {
        await vagaService.createVaga(payload);
        setAlert({
          show: true,
          message: 'Vaga criada com sucesso!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao salvar vaga',
        severity: 'error',
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setExcluindo(true);
      await vagaService.deleteVaga(deletingId);
      setAlert({
        show: true,
        message: 'Vaga excluída com sucesso!',
        severity: 'success',
      });
      handleCloseDeleteDialog();
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao excluir vaga',
        severity: 'error',
      });
      handleCloseDeleteDialog();
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/gestor/estacionamentos')}
          sx={{ mb: 3, color: '#223843' }}
        >
          Voltar
        </Button>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#223843' }}>
          Vagas do Estacionamento: {estacionamento?.nome || 'Carregando...'}
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#2A9D8F', '&:hover': { backgroundColor: '#248277' } }}
          >
            Nova Vaga
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2A9D8F' }} />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#223843' }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Identificação</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vagas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhuma vaga cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  vagas.map((vaga) => (
                    <TableRow key={vaga.id_vaga} hover>
                      <TableCell align="center">{vaga.identificacao}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: '#223843',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        >
                          {tiposVaga.find((t) => t.value === vaga.tipo)?.label || vaga.tipo}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: vaga.disponivel === 'S' ? '#2A9D8F' : '#6C757D',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        >
                          {vaga.disponivel === 'S' ? 'Livre' : 'Ocupada'}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleOpenDialog(vaga)} sx={{ color: '#2A9D8F' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(vaga.id_vaga)} sx={{ color: '#6C757D' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog de cadastro/edição */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#223843', color: 'white' }}>
            {editingId ? 'Editar Vaga' : 'Nova Vaga'}
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Identificação"
              value={formData.identificacao}
              onChange={(e) => setFormData({ ...formData, identificacao: e.target.value })}
              sx={{ mb: 3 }}
              placeholder="Ex: A-01, B-15"
              required
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="tipo-label">Tipo da Vaga</InputLabel>
              <Select
                labelId="tipo-label"
                value={formData.tipo}
                label="Tipo da Vaga"
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                {tiposVaga.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.disponivel}
                  onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#2A9D8F',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#2A9D8F',
                    },
                  }}
                />
              }
              label={formData.disponivel ? 'Livre' : 'Ocupada'}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} disabled={salvando} sx={{ color: '#6C757D' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={salvando}
              startIcon={salvando && <CircularProgress size={16} sx={{ color: 'white' }} />}
              sx={{ 
                backgroundColor: '#2A9D8F', 
                '&:hover': { backgroundColor: '#248277' },
                '&.Mui-disabled': { backgroundColor: '#CCCCCC' }
              }}
            >
              {salvando ? 'Salvando...' : (editingId ? 'Atualizar' : 'Salvar')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmação de exclusão */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>Você tem certeza que deseja excluir esta vaga?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={excluindo} sx={{ color: '#6C757D' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              disabled={excluindo}
              startIcon={excluindo && <CircularProgress size={16} sx={{ color: 'white' }} />}
              sx={{ 
                backgroundColor: '#dc3545', 
                '&:hover': { backgroundColor: '#c82333' },
                '&.Mui-disabled': { backgroundColor: '#CCCCCC' }
              }}
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Footer />
    </Box>
  );
}
