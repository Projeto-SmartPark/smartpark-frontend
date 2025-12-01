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
import acessoService from '../../services/acessoService';
import estacionamentoService from '../../services/estacionamentoService';

export default function AcessosGestor() {
  const navigate = useNavigate();
  const [acessos, setAcessos] = useState([]);
  const [acessosFiltrados, setAcessosFiltrados] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [estacionamentoSelecionado, setEstacionamentoSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    filtrarAcessos();
  }, [acessos, estacionamentoSelecionado]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [acessosData, estacionamentosData] = await Promise.all([
        acessoService.getAcessos(),
        estacionamentoService.getEstacionamentos()
      ]);
      setAcessos(acessosData);
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

  const filtrarAcessos = () => {
    if (!estacionamentoSelecionado) {
      setAcessosFiltrados(acessos);
    } else {
      setAcessosFiltrados(
        acessos.filter(acesso => 
          acesso.vaga?.estacionamento?.id_estacionamento === parseInt(estacionamentoSelecionado)
        )
      );
    }
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/gestor/home')}
          sx={{ mb: 3, color: '#223843' }}
          id="btn-voltar-acessos"
          data-testid="btn-voltar-acessos"
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843' }}>
            Gerenciar Acessos
          </Typography>
          
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Filtrar por Estacionamento</InputLabel>
            <Select
              value={estacionamentoSelecionado}
              onChange={(e) => setEstacionamentoSelecionado(e.target.value)}
              label="Filtrar por Estacionamento"
              id="select-filtro-estacionamento-acessos"
              data-testid="select-filtro-estacionamento-acessos"
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
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Entrada</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Saída</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Tarifa</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Valor Total</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acessosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      Nenhum acesso registrado
                    </TableCell>
                  </TableRow>
                ) : (
                  acessosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((acesso) => (
                    <TableRow key={acesso.id_acesso} hover>
                      <TableCell align="center">{acesso.vaga?.estacionamento?.nome || '-'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{acesso.vaga?.identificacao || '-'}</TableCell>
                      <TableCell align="center">{acesso.cliente?.nome || '-'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{acesso.veiculo?.placa || '-'}</TableCell>
                      <TableCell align="center">{formatarData(acesso.data)}</TableCell>
                      <TableCell align="center">{formatarHora(acesso.hora_inicio)}</TableCell>
                      <TableCell align="center">{formatarHora(acesso.hora_fim)}</TableCell>
                      <TableCell align="center">
                        {acesso.tarifa ? (
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            R$ {parseFloat(acesso.tarifa.valor || 0).toFixed(2).replace('.', ',')}/{acesso.tarifa.tipo.charAt(0).toUpperCase() + acesso.tarifa.tipo.slice(1)}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#2A9D8F', fontWeight: 600 }}>
                        R$ {parseFloat(acesso.valor_total || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {acesso.pago === 'S' ? (
                          <Chip label="Pago" color="success" size="small" />
                        ) : (
                          <Chip label="Pendente" color="warning" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={acessosFiltrados.length}
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
