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
  Grid,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import estacionamentoService from '../../services/estacionamentoService';
import authService from '../../services/authService';

export default function ListarEstacionamentos() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    hora_abertura: '',
    hora_fechamento: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    numero: '',
    logradouro: '',
    complemento: '',
  });

  const [telefones, setTelefones] = useState([]);
  const [novoTelefone, setNovoTelefone] = useState({ ddd: '', numero: '' });

  useEffect(() => {
    carregarEstacionamentos();
  }, []);

  const carregarEstacionamentos = async () => {
    try {
      setLoading(true);
      const data = await estacionamentoService.getEstacionamentos();
      setEstacionamentos(data);
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

  const handleOpenDialog = (estacionamento) => {
    if (estacionamento) {
      setEditingId(estacionamento.id_estacionamento);
      setFormData({
        nome: estacionamento.nome,
        capacidade: estacionamento.capacidade.toString(),
        hora_abertura: estacionamento.hora_abertura,
        hora_fechamento: estacionamento.hora_fechamento,
        cep: estacionamento.endereco?.cep || '',
        estado: estacionamento.endereco?.estado || '',
        cidade: estacionamento.endereco?.cidade || '',
        bairro: estacionamento.endereco?.bairro || '',
        numero: estacionamento.endereco?.numero || '',
        logradouro: estacionamento.endereco?.logradouro || '',
        complemento: estacionamento.endereco?.complemento || '',
      });
      setTelefones(estacionamento.telefones || []);
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: '',
        hora_abertura: '08:00:00',
        hora_fechamento: '22:00:00',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        numero: '',
        logradouro: '',
        complemento: '',
      });
      setTelefones([]);
    }
    setNovoTelefone({ ddd: '', numero: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleAddTelefone = () => {
    if (novoTelefone.ddd && novoTelefone.numero) {
      if (telefones.length >= 2) {
        setAlert({
          show: true,
          message: 'Máximo de 2 telefones permitidos',
          severity: 'warning',
        });
        return;
      }
      setTelefones([...telefones, novoTelefone]);
      setNovoTelefone({ ddd: '', numero: '' });
    }
  };

  const handleRemoveTelefone = (index) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Validações básicas
      if (!formData.nome || !formData.capacidade || !formData.hora_abertura || !formData.hora_fechamento) {
        setAlert({
          show: true,
          message: 'Preencha todos os campos obrigatórios',
          severity: 'error',
        });
        return;
      }

      if (telefones.length === 0) {
        setAlert({
          show: true,
          message: 'Adicione pelo menos um telefone',
          severity: 'error',
        });
        return;
      }

      // Obter gestor_id do usuário logado
      const usuario = authService.getUsuario();
      const gestorId = usuario?.id;

      if (!gestorId) {
        setAlert({
          show: true,
          message: 'Erro ao identificar gestor. Faça login novamente.',
          severity: 'error',
        });
        return;
      }

      // Preparar payload
      const payload = {
        nome: formData.nome,
        capacidade: parseInt(formData.capacidade),
        hora_abertura: formData.hora_abertura,
        hora_fechamento: formData.hora_fechamento,
        gestor_id: gestorId,
        endereco: {
          cep: formData.cep.replace(/\D/g, ''),
          estado: formData.estado.toUpperCase(),
          cidade: formData.cidade,
          bairro: formData.bairro,
          numero: formData.numero,
          logradouro: formData.logradouro,
          complemento: formData.complemento || '',
        },
        telefones: telefones.map((tel) => ({
          ddd: tel.ddd.replace(/\D/g, ''),
          numero: tel.numero.replace(/\D/g, ''),
        })),
      };

      if (editingId !== null) {
        await estacionamentoService.updateEstacionamento(editingId, payload);
        setAlert({
          show: true,
          message: 'Estacionamento atualizado com sucesso!',
          severity: 'success',
        });
      } else {
        await estacionamentoService.createEstacionamento(payload);
        setAlert({
          show: true,
          message: 'Estacionamento criado com sucesso!',
          severity: 'success',
        });
      }

      handleCloseDialog();
      carregarEstacionamentos();
    } catch (error) {
      console.error('Erro ao salvar estacionamento:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao salvar estacionamento',
        severity: 'error',
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeletingId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await estacionamentoService.deleteEstacionamento(deletingId);
      setAlert({
        show: true,
        message: 'Estacionamento excluído com sucesso!',
        severity: 'success',
      });
      handleCloseDeleteDialog();
      carregarEstacionamentos();
    } catch (error) {
      console.error('Erro ao excluir estacionamento:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao excluir estacionamento',
        severity: 'error',
      });
      handleCloseDeleteDialog();
    }
  };

  const formatCEP = (value) => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  };

  const formatTelefone = (value) => {
    const telefone = value.replace(/\D/g, '');
    if (telefone.length <= 4) return telefone;
    if (telefone.length <= 9) return `${telefone.slice(0, telefone.length - 4)}-${telefone.slice(-4)}`;
    return `${telefone.slice(0, 5)}-${telefone.slice(5, 9)}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/gestor/home')}
          sx={{ mb: 3, color: '#223843' }}
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843' }}>
            Gerenciar Estacionamentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#2A9D8F', '&:hover': { backgroundColor: '#248277' } }}
          >
            Novo Estacionamento
          </Button>
        </Box>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2A9D8F' }} />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#223843' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nome</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Cidade</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Capacidade</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Horário</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Telefones</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estacionamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum estacionamento cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  estacionamentos.map((est) => (
                    <TableRow key={est.id_estacionamento} hover>
                      <TableCell>{est.nome}</TableCell>
                      <TableCell>{est.endereco?.cidade || '-'}</TableCell>
                      <TableCell>{est.capacidade}</TableCell>
                      <TableCell>
                        {est.hora_abertura?.slice(0, 5)} - {est.hora_fechamento?.slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        {est.telefones?.map((tel, idx) => (
                          <span key={idx}>
                            ({tel.ddd}) {tel.numero}
                            {idx < est.telefones.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(est)} sx={{ color: '#2A9D8F' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(est.id_estacionamento)} sx={{ color: '#6C757D' }}>
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          size="small"
                          onClick={() => navigate(`/gestor/vagas/${est.id_estacionamento}`)}
                          sx={{ ml: 1, color: '#223843' }}
                        >
                          Ver Vagas
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#223843', color: 'white' }}>
            {editingId ? 'Editar Estacionamento' : 'Novo Estacionamento'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mb: 1 }}>
                  Informações Gerais
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome *"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Capacidade *"
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora de Abertura *"
                  type="time"
                  value={formData.hora_abertura}
                  onChange={(e) => setFormData({ ...formData, hora_abertura: e.target.value + ':00' })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora de Fechamento *"
                  type="time"
                  value={formData.hora_fechamento}
                  onChange={(e) => setFormData({ ...formData, hora_fechamento: e.target.value + ':00' })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mt: 2, mb: 1 }}>
                  Endereço
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CEP *"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: formatCEP(e.target.value) })}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Estado *"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cidade *"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bairro *"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Logradouro *"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Número *"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mt: 2, mb: 1 }}>
                  Telefones * (mínimo 1, máximo 2)
                </Typography>
              </Grid>

              {telefones.length > 0 && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    {telefones.map((tel, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography>
                          ({tel.ddd}) {tel.numero}
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemoveTelefone(idx)} sx={{ color: '#6C757D' }}>
                          <RemoveCircleIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="DDD"
                  value={novoTelefone.ddd}
                  onChange={(e) => setNovoTelefone({ ...novoTelefone, ddd: e.target.value.replace(/\D/g, '') })}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número"
                  value={novoTelefone.numero}
                  onChange={(e) =>
                    setNovoTelefone({ ...novoTelefone, numero: formatTelefone(e.target.value) })
                  }
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAddTelefone}
                  disabled={telefones.length >= 2}
                  sx={{
                    height: '56px',
                    borderColor: '#2A9D8F',
                    color: '#2A9D8F',
                    '&:hover': { borderColor: '#248277', backgroundColor: 'rgba(42, 157, 143, 0.1)' },
                  }}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#6C757D' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ backgroundColor: '#2A9D8F', '&:hover': { backgroundColor: '#248277' } }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmação de exclusão */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>Você tem certeza que deseja excluir o estacionamento?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} sx={{ color: '#6C757D' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{ backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Footer />
    </Box>
  );
}
