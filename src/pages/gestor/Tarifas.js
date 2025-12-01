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
  FormControl,
  InputLabel,
  Select,
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
  const [tarifasFiltradas, setTarifasFiltradas] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [estacionamentoSelecionado, setEstacionamentoSelecionado] = useState('');
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

  useEffect(() => {
    filtrarTarifas();
  }, [tarifas, estacionamentoSelecionado]);

  const filtrarTarifas = () => {
    if (!estacionamentoSelecionado) {
      setTarifasFiltradas(tarifas);
    } else {
      setTarifasFiltradas(
        tarifas.filter(tarifa => 
          tarifa.estacionamento_id === parseInt(estacionamentoSelecionado)
        )
      );
    }
  };

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
      setSalvando(true);
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
    } finally {
      setSalvando(false);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Button
            id="btn-voltar"
            data-testid="btn-voltar"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/gestor/home')}
            sx={{ mb: 3, color: '#223843' }}
          >
            Voltar
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843' }}>
              Gerenciar Tarifas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Filtrar por Estacionamento</InputLabel>
                <Select
                  value={estacionamentoSelecionado}
                  onChange={(e) => setEstacionamentoSelecionado(e.target.value)}
                  label="Filtrar por Estacionamento"
                >
                  <MenuItem value="">
                    <em>Todos os estacionamentos</em>
                  </MenuItem>
                  {estacionamentos.map((est) => (
                    <MenuItem key={est.id_estacionamento} value={est.id_estacionamento}>
                      {est.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                id="btn-nova-tarifa"
                data-testid="btn-nova-tarifa"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen(null)}
                sx={{
                  backgroundColor: '#2A9D8F',
                  '&:hover': { backgroundColor: '#248277' },
                }}
              >
                Nova Tarifa
              </Button>
            </Box>
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#2A9D8F' }} />
            </Box>
          ) : tarifasFiltradas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {estacionamentoSelecionado ? 'Nenhuma tarifa encontrada para este estacionamento' : 'Nenhuma tarifa cadastrada'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Box} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#223843' }}>
                  <TableRow>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Nome</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Valor</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Estacionamento</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Ativa</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tarifasFiltradas.map((tarifa) => (
                    <TableRow key={tarifa.id_tarifa} hover>
                      <TableCell align="center">{tarifa.nome}</TableCell>
                      <TableCell align="center">{formatarValor(tarifa.valor)}</TableCell>
                      <TableCell align="center">{obterLabelTipo(tarifa.tipo)}</TableCell>
                      <TableCell align="center">{obterNomeEstacionamento(tarifa.estacionamento_id)}</TableCell>
                      <TableCell align="center">
                        {tarifa.ativa === 'S' ? (
                          <Typography color="success.main" sx={{ fontWeight: 600 }}>Sim</Typography>
                        ) : (
                          <Typography color="error.main" sx={{ fontWeight: 600 }}>Não</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleOpen(tarifa)}
                          size="small"
                          sx={{ color: '#2A9D8F' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleAbrirDialogExcluir(tarifa)}
                          size="small"
                          sx={{ color: '#DC3545' }}
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
        </Box>
      </Box>
      <Footer />

      {/* Dialog Adicionar/Editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#223843', color: 'white' }}>
          {editingId ? 'Editar Tarifa' : 'Nova Tarifa'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              required
              id="input-nome-tarifa"
              data-testid="input-nome-tarifa"
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
              id="input-valor-tarifa"
              data-testid="input-valor-tarifa"
            />

            <TextField
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              select
              fullWidth
              required
              id="select-tipo-tarifa"
              data-testid="select-tipo-tarifa"
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
              data-testid="select-estacionamento-tarifa"
              SelectProps={{
                id: 'select-estacionamento-tarifa',
                'data-testid': 'select-estacionamento-tarifa-input',
                MenuProps: {
                  'data-testid': 'menu-estacionamento-tarifa',
                }
              }}
            >
              {estacionamentos.map((est) => (
                <MenuItem 
                  key={est.id_estacionamento} 
                  value={est.id_estacionamento}
                  data-testid={`opcao-estacionamento-${est.id_estacionamento}`}
                  data-nome={est.nome}
                >
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={salvando} sx={{ color: '#6C757D' }}>
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
            id="btn-salvar-tarifa"
            data-testid="btn-salvar-tarifa"
          >
            {salvando ? 'Salvando...' : (editingId ? 'Atualizar' : 'Cadastrar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={dialogExcluir} onClose={handleFecharDialogExcluir}>
        <DialogTitle sx={{ backgroundColor: '#DC3545', color: 'white' }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a tarifa{' '}
            <strong>{tarifaExcluir?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleFecharDialogExcluir} disabled={salvando} sx={{ color: '#6C757D' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={salvando}
            startIcon={salvando && <CircularProgress size={16} sx={{ color: 'white' }} />}
            sx={{ 
              backgroundColor: '#DC3545', 
              '&:hover': { backgroundColor: '#C82333' },
              '&.Mui-disabled': { backgroundColor: '#CCCCCC' }
            }}
          >
            {salvando ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
