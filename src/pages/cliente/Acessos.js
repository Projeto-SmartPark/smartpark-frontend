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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import acessoService from '../../services/acessoService';

export default function AcessosCliente() {
  const navigate = useNavigate();
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [openPagamentoDialog, setOpenPagamentoDialog] = useState(false);
  const [acessoSelecionado, setAcessoSelecionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    carregarAcessos();
  }, []);

  const carregarAcessos = async () => {
    try {
      setLoading(true);
      const data = await acessoService.getAcessosCliente();
      setAcessos(data);
    } catch (error) {
      console.error('Erro ao carregar acessos:', error);
      setAlert({
        show: true,
        message: 'Erro ao carregar acessos. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialogPagamento = (acesso) => {
    setAcessoSelecionado(acesso);
    setOpenPagamentoDialog(true);
  };

  const handleFecharDialogPagamento = () => {
    setOpenPagamentoDialog(false);
    setAcessoSelecionado(null);
  };

  const handleConfirmarPagamento = async () => {
    if (!acessoSelecionado) return;

    try {
      await acessoService.pagarAcesso(acessoSelecionado.id_acesso);
      setAlert({
        show: true,
        message: 'Pagamento realizado com sucesso!',
        severity: 'success',
      });
      handleFecharDialogPagamento();
      carregarAcessos();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Erro ao processar pagamento.',
        severity: 'error',
      });
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
          onClick={() => navigate('/cliente/home')}
          sx={{ mb: 3, color: '#223843' }}
          id="btn-voltar"
          data-testid="btn-voltar"
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#223843' }}>
            Meus Acessos
          </Typography>
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
                {acessos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Nenhum acesso registrado
                    </TableCell>
                  </TableRow>
                ) : (
                  acessos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((acesso) => (
                    <TableRow key={acesso.id_acesso} hover>
                      <TableCell align="center">{acesso.vaga?.estacionamento?.nome || '-'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{acesso.vaga?.identificacao || '-'}</TableCell>
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
                        {acesso.pago === 'N' && parseFloat(acesso.valor_total || 0) > 0 && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAbrirDialogPagamento(acesso)}
                            sx={{
                              ml: 1,
                              backgroundColor: '#2A9D8F',
                              '&:hover': { backgroundColor: '#248277' },
                            }}
                            id={`btn-pagar-acesso-${acesso.id_acesso}`}
                            data-testid={`btn-pagar-acesso-${acesso.id_acesso}`}
                          >
                            Pagar
                          </Button>
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
              count={acessos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </TableContainer>
        )}

        {/* Dialog de confirmação de pagamento */}
        <Dialog open={openPagamentoDialog} onClose={handleFecharDialogPagamento}>
          <DialogTitle sx={{ backgroundColor: '#223843', color: 'white' }}>
            Confirmar Pagamento
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {acessoSelecionado && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Deseja confirmar o pagamento deste acesso?
                </Typography>
                <Box sx={{ backgroundColor: '#F5F5F5', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Estacionamento:</strong> {acessoSelecionado.vaga?.estacionamento?.nome || '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Vaga:</strong> {acessoSelecionado.vaga?.numero || '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Veículo:</strong> {acessoSelecionado.veiculo?.placa || '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Data:</strong> {formatarData(acessoSelecionado.data)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Período:</strong> {formatarHora(acessoSelecionado.hora_inicio)} -{' '}
                    {formatarHora(acessoSelecionado.hora_fim)}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2, color: '#2A9D8F' }}>
                    <strong>Valor Total: R$ {parseFloat(acessoSelecionado.valor_total || 0).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleFecharDialogPagamento} sx={{ color: '#6C757D' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarPagamento}
              variant="contained"
              sx={{ backgroundColor: '#2A9D8F', '&:hover': { backgroundColor: '#248277' } }}
              id="btn-confirmar-pagamento"
              data-testid="btn-confirmar-pagamento"
            >
              Confirmar Pagamento
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Footer />
    </Box>
  );
}
