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
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import tarifaService from '../../services/tarifaService';
import estacionamentoService from '../../services/estacionamentoService';

export default function TarifasGestor() {
  const navigate = useNavigate();
  const [tarifas, setTarifas] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: 'hora',
    estacionamento_id: '',
    ativa: 'S',
  });
  const [salvando, setSalvando] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [dialogExcluir, setDialogExcluir] = useState(false);
  const [tarifaExcluir, setTarifaExcluir] = useState(null);

  const tiposTarifa = [
    { value: 'segundo', label: 'Por Segundo' },
    { value: 'minuto', label: 'Por Minuto' },
    { value: 'hora', label: 'Por Hora' },
    { value: 'diaria', label: 'Diária' },
    { value: 'mensal', label: 'Mensal' },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [tarifasData, estacionamentosData] = await Promise.all([
        tarifaService.getTarifas(),
        estacionamentoService.getEstacionamentos(),
      ]);
      setTarifas(tarifasData);
      setEstacionamentos(estacionamentosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao carregar dados',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (tarifa) => {
    if (tarifa) {
      setEditingId(tarifa.id_tarifa);
      setFormData({
        nome: tarifa.nome,
        valor: tarifa.valor,
        tipo: tarifa.tipo,
        estacionamento_id: tarifa.estacionamento_id,
        ativa: tarifa.ativa || 'S',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        valor: '',
        tipo: 'hora',
        estacionamento_id: '',
        ativa: 'S',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      nome: '',
      valor: '',
      tipo: 'hora',
      estacionamento_id: '',
      ativa: 'S',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAtivaChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ativa: e.target.checked ? 'S' : 'N',
    }));
  };

  const handleSave = async () => {
    // Validações
    if (!formData.nome.trim()) {
      setAlert({
        show: true,
        message: 'O nome da tarifa é obrigatório',
        severity: 'error',
      });
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) < 0) {
      setAlert({
        show: true,
        message: 'O valor deve ser maior ou igual a zero',
        severity: 'error',
      });
      return;
    }

    if (!formData.estacionamento_id) {
      setAlert({
        show: true,
        message: 'Selecione um estacionamento',
        severity: 'error',
      });
      return;
    }

    setSalvando(true);
    try {
      const dataToSend = {
        ...formData,
        valor: parseFloat(formData.valor),
      };

      if (editingId) {
        await tarifaService.updateTarifa(editingId, dataToSend);
        setAlert({
          show: true,
          message: 'Tarifa atualizada com sucesso',
          severity: 'success',
        });
      } else {
        await tarifaService.createTarifa(dataToSend);
        setAlert({
          show: true,
          message: 'Tarifa cadastrada com sucesso',
          severity: 'success',
        });
      }
      handleClose();
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar tarifa:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao salvar tarifa',
        severity: 'error',
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleAbrirDialogExcluir = (tarifa) => {
    setTarifaExcluir(tarifa);
    setDialogExcluir(true);
  };

  const handleFecharDialogExcluir = () => {
    setDialogExcluir(false);
    setTarifaExcluir(null);
  };

  const handleDelete = async () => {
    if (!tarifaExcluir) return;

    try {
      await tarifaService.deleteTarifa(tarifaExcluir.id_tarifa);
      setAlert({
        show: true,
        message: 'Tarifa excluída com sucesso',
        severity: 'success',
      });
      handleFecharDialogExcluir();
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir tarifa:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao excluir tarifa',
        severity: 'error',
      });
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const obterLabelTipo = (tipo) => {
    const tipoObj = tiposTarifa.find((t) => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  };

  const obterNomeEstacionamento = (id) => {
    const estacionamento = estacionamentos.find((e) => e.id_estacionamento === id);
    return estacionamento ? estacionamento.nome : 'N/A';
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/gestor/home')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Gerenciar Tarifas
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen(null)}
            >
              Nova Tarifa
            </Button>
          </Box>

          {alert.show && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, show: false })}
              sx={{ mb: 3 }}
            >
              {alert.message}
            </Alert>
          )}

          <Card>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : tarifas.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Nenhuma tarifa cadastrada
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Estacionamento</TableCell>
                        <TableCell align="center">Ativa</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tarifas.map((tarifa) => (
                        <TableRow key={tarifa.id_tarifa}>
                          <TableCell>{tarifa.nome}</TableCell>
                          <TableCell>{formatarValor(tarifa.valor)}</TableCell>
                          <TableCell>{obterLabelTipo(tarifa.tipo)}</TableCell>
                          <TableCell>{obterNomeEstacionamento(tarifa.estacionamento_id)}</TableCell>
                          <TableCell align="center">
                            {tarifa.ativa === 'S' ? (
                              <Typography color="success.main">Sim</Typography>
                            ) : (
                              <Typography color="error.main">Não</Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpen(tarifa)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleAbrirDialogExcluir(tarifa)}
                              size="small"
                            >
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
      </Box>
      <Footer />

      {/* Dialog Adicionar/Editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Tarifa' : 'Nova Tarifa'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Valor"
              name="valor"
              type="number"
              value={formData.valor}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              select
              fullWidth
              required
            >
              {tiposTarifa.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Estacionamento"
              name="estacionamento_id"
              value={formData.estacionamento_id}
              onChange={handleChange}
              select
              fullWidth
              required
            >
              {estacionamentos.map((est) => (
                <MenuItem key={est.id_estacionamento} value={est.id_estacionamento}>
                  {est.nome}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativa === 'S'}
                  onChange={handleAtivaChange}
                  color="primary"
                />
              }
              label="Ativa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={salvando}>
            {salvando ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={dialogExcluir} onClose={handleFecharDialogExcluir}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a tarifa{' '}
            <strong>{tarifaExcluir?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogExcluir}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
