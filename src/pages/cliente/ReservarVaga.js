import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Footer } from '../../components';
import { HorarioSelector, DisponibilidadeIndicator, VeiculoSelector } from '../../components/reservas';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ElderlyIcon from '@mui/icons-material/Elderly';
import EvStationIcon from '@mui/icons-material/EvStation';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import vagaService from '../../services/vagaService';
import estacionamentoService from '../../services/estacionamentoService';
import reservaService from '../../services/reservaService';
import veiculoService from '../../services/veiculoService';

export default function ReservarVaga() {
  const navigate = useNavigate();
  const { estacionamentoId, vagaId } = useParams();
  const [vaga, setVaga] = useState(null);
  const [estacionamento, setEstacionamento] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [processando, setProcessando] = useState(false);
  const [verificandoDisponibilidade, setVerificandoDisponibilidade] = useState(false);
  const [disponivel, setDisponivel] = useState(true);
  
  // Campos de horário
  const [dataReserva, setDataReserva] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [duracao, setDuracao] = useState('1');

  useEffect(() => {
    carregarDados();
    // Define data e hora atuais como padrão
    const agora = new Date();
    const dataFormatada = agora.toISOString().split('T')[0];
    const horaFormatada = agora.toTimeString().slice(0, 5);
    setDataReserva(dataFormatada);
    setHoraInicio(horaFormatada);
  }, [estacionamentoId, vagaId]);

  useEffect(() => {
    if (dataReserva && horaInicio && duracao) {
      verificarDisponibilidade();
    }
  }, [dataReserva, horaInicio, duracao]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [vagaData, estacionamentoData, veiculosData] = await Promise.all([
        vagaService.getVagaById(vagaId),
        estacionamentoService.getEstacionamentoById(estacionamentoId),
        veiculoService.getVeiculosPorCliente(),
      ]);
      setVaga(vagaData);
      setEstacionamento(estacionamentoData);
      setVeiculos(veiculosData);
      
      // Seleciona o primeiro veículo automaticamente se houver
      if (veiculosData.length > 0) {
        setVeiculoSelecionado(veiculosData[0].id_veiculo);
      }
      
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

  const verificarDisponibilidade = async () => {
    if (!dataReserva || !horaInicio || !duracao) return;
    
    setVerificandoDisponibilidade(true);
    try {
      const horaFim = calcularHoraFim(horaInicio, parseFloat(duracao));
      const disponibilidade = await reservaService.verificarDisponibilidade(
        vagaId,
        dataReserva,
        `${horaInicio}:00`,
        `${horaFim}:00`
      );
      
      setDisponivel(disponibilidade);
      if (!disponibilidade) {
        setAlert({
          show: true,
          message: 'Vaga indisponível para o horário selecionado. Por favor, escolha outro horário.',
          severity: 'warning',
        });
      } else if (alert.severity === 'warning') {
        setAlert({ show: false, message: '', severity: 'success' });
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setDisponivel(false);
    } finally {
      setVerificandoDisponibilidade(false);
    }
  };

  const calcularHoraFim = (horaInicio, duracao) => {
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const totalMinutos = hora * 60 + minuto + duracao * 60;
    const novaHora = Math.floor(totalMinutos / 60) % 24;
    const novoMinuto = totalMinutos % 60;
    return `${String(novaHora).padStart(2, '0')}:${String(novoMinuto).padStart(2, '0')}`;
  };

  const handleConfirmarReserva = async () => {
    if (!disponivel) {
      setAlert({
        show: true,
        message: 'Não é possível confirmar reserva para horário indisponível.',
        severity: 'error',
      });
      return;
    }

    if (!veiculoSelecionado) {
      setAlert({
        show: true,
        message: 'Selecione um veículo para continuar.',
        severity: 'error',
      });
      return;
    }

    setProcessando(true);
    try {
      const horaFim = calcularHoraFim(horaInicio, parseFloat(duracao));
      
      await reservaService.createReserva({
        vaga_id: parseInt(vagaId),
        veiculo_id: parseInt(veiculoSelecionado),
        data: dataReserva,
        hora_inicio: `${horaInicio}:00`,
        hora_fim: `${horaFim}:00`,
        status: 'ativa',
      });

      setAlert({
        show: true,
        message: 'Reserva confirmada com sucesso!',
        severity: 'success',
      });
      
      setTimeout(() => {
        navigate('/cliente/reservas');
      }, 2000);
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      setAlert({
        show: true,
        message: error.message || 'Erro ao confirmar reserva',
        severity: 'error',
      });
      setProcessando(false);
    }
  };

  const getIconeTipo = (tipo) => {
    switch (tipo) {
      case 'carro':
        return <DirectionsCarIcon sx={{ fontSize: 40 }} />;
      case 'moto':
        return <TwoWheelerIcon sx={{ fontSize: 40 }} />;
      case 'deficiente':
        return <AccessibleIcon sx={{ fontSize: 40 }} />;
      case 'idoso':
        return <ElderlyIcon sx={{ fontSize: 40 }} />;
      case 'eletrico':
        return <EvStationIcon sx={{ fontSize: 40 }} />;
      default:
        return <MoreHorizIcon sx={{ fontSize: 40 }} />;
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

  const getDataHoraFim = () => {
    if (!dataReserva || !horaInicio || !duracao) return '';
    const horaFim = calcularHoraFim(horaInicio, parseFloat(duracao));
    const [ano, mes, dia] = dataReserva.split('-');
    return `${dia}/${mes}/${ano} ${horaFim}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header showLogout />

      <Container sx={{ flexGrow: 1, py: 4, maxWidth: 'md' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/cliente/vagas/${estacionamentoId}`)}
          sx={{ mb: 3, color: '#223843' }}
          id="btn-voltar-reservar-vaga"
          data-testid="btn-voltar-reservar-vaga"
        >
          Voltar
        </Button>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#223843', textAlign: 'center' }}>
          Confirmar Reserva
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </Alert>
        )}

        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, color: '#2A9D8F' }}>
              {vaga && getIconeTipo(vaga.tipo)}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#223843', mb: 3, textAlign: 'center' }}>
              Detalhes da Reserva
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mb: 2 }}>
              Informações do Estacionamento
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Estacionamento:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#223843' }}>
                {estacionamento?.nome}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Endereço:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#223843' }}>
                {estacionamento?.endereco?.logradouro}, {estacionamento?.endereco?.numero} -{' '}
                {estacionamento?.endereco?.bairro}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Vaga:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#223843' }}>
                {vaga?.identificacao}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Tipo de Vaga:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#223843' }}>
                {vaga && getNomeTipo(vaga.tipo)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mb: 2 }}>
              Selecione o Veículo
            </Typography>

            <VeiculoSelector
              veiculos={veiculos}
              veiculoSelecionado={veiculoSelecionado}
              onChange={setVeiculoSelecionado}
              onAdicionarVeiculo={() => navigate('/cliente/veiculos')}
              loading={loading}
            />

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#223843', mb: 2 }}>
              Horário da Reserva
            </Typography>

            <HorarioSelector
              dataReserva={dataReserva}
              horaInicio={horaInicio}
              duracao={duracao}
              onDataChange={setDataReserva}
              onHoraChange={setHoraInicio}
              onDuracaoChange={setDuracao}
            />

            {dataReserva && horaInicio && (
              <DisponibilidadeIndicator
                verificando={verificandoDisponibilidade}
                disponivel={disponivel}
              />
            )}

            <Box sx={{ mb: 2, p: 2, backgroundColor: '#F8F9FA', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Horário de Término Estimado:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#223843' }}>
                {getDataHoraFim()}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: '#2A9D8F',
                  color: 'white',
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                ATIVA
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleConfirmarReserva}
              disabled={processando || !disponivel || verificandoDisponibilidade || !dataReserva || !horaInicio || !veiculoSelecionado}
              sx={{
                backgroundColor: disponivel && !verificandoDisponibilidade && veiculoSelecionado ? '#2A9D8F' : '#6C757D',
                '&:hover': {
                  backgroundColor: disponivel && !verificandoDisponibilidade && veiculoSelecionado ? '#248277' : '#6C757D',
                },
                py: 1.5,
                fontSize: '1.1rem',
              }}
              id="btn-confirmar-reserva"
              data-testid="btn-confirmar-reserva"
            >
              {processando ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : !veiculoSelecionado ? (
                'Selecione um Veículo'
              ) : !disponivel ? (
                'Horário Indisponível'
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
}
