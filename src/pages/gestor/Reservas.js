import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import reservaService from '../../services/reservaService';
import estacionamentoService from '../../services/estacionamentoService';

export default function ReservasGestor() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [estacionamentoSelecionado, setEstacionamentoSelecionado] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    filtrarReservas();
  }, [reservas, estacionamentoSelecionado, statusSelecionado]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [reservasData, estacionamentosData] = await Promise.all([
        reservaService.getReservas(),
        estacionamentoService.getEstacionamentos()
      ]);
      setReservas(reservasData);
      setEstacionamentos(estacionamentosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlert({
        show: true,
        message: 'Erro ao carregar dados. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const filtrarReservas = () => {
    let filtered = [...reservas];

    if (estacionamentoSelecionado) {
      filtered = filtered.filter(reserva => 
        reserva.vaga?.estacionamento?.id_estacionamento === parseInt(estacionamentoSelecionado)
      );
    }

    if (statusSelecionado) {
      filtered = filtered.filter(reserva => reserva.status === statusSelecionado);
    }

    setReservasFiltradas(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    return hora ? hora.slice(0, 5) : '-';
  };

  const getStatusChip = (status) => {
    const statusMap = {
      ativa: { label: 'Ativa', color: 'primary' },
      concluida: { label: 'Concluída', color: 'success' },
      cancelada: { label: 'Cancelada', color: 'error' },
    };
    const statusInfo = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={statusInfo.label} color={statusInfo.color} size="small" />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/gestor/home')}
          sx={{ mb: 3, color: '#223843' }}
          id="btn-voltar-reservas"
          data-testid="btn-voltar-reservas"
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843' }}>
            Gerenciar Reservas
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filtrar por Estacionamento</InputLabel>
              <Select
                value={estacionamentoSelecionado}
                onChange={(e) => setEstacionamentoSelecionado(e.target.value)}
                label="Filtrar por Estacionamento"
                id="select-filtro-estacionamento-reservas"
                data-testid="select-filtro-estacionamento-reservas"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {estacionamentos.map((est) => (
                  <MenuItem key={est.id_estacionamento} value={est.id_estacionamento}>
                    {est.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value)}
                label="Status"
                id="select-filtro-status-reservas"
                data-testid="select-filtro-status-reservas"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="ativa">Ativa</MenuItem>
                <MenuItem value="concluida">Concluída</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Estacionamento</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Vaga</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Cliente</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Veículo</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Data</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Horário Início</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Horário Fim</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nenhuma reserva encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  reservasFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reserva) => (
                    <TableRow key={reserva.id_reserva} hover>
                      <TableCell align="center">{reserva.vaga?.estacionamento?.nome || '-'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{reserva.vaga?.identificacao || '-'}</TableCell>
                      <TableCell align="center">{reserva.cliente?.nome || '-'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{reserva.veiculo?.placa || '-'}</TableCell>
                      <TableCell align="center">{formatarData(reserva.data)}</TableCell>
                      <TableCell align="center">{formatarHora(reserva.hora_inicio)}</TableCell>
                      <TableCell align="center">{formatarHora(reserva.hora_fim)}</TableCell>
                      <TableCell align="center">{getStatusChip(reserva.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={reservasFiltradas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </TableContainer>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
