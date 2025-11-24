import React from 'react';
import { Card, CardContent, Box, Typography, Button } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ReservaCard({ reserva, onCancelar, onConcluir }) {
  const getStatusDisplay = (status) => {
    const statusMap = {
      ativa: { label: 'ATIVA', color: '#2A9D8F' },
      concluida: { label: 'CONCLUÍDA', color: '#6C757D' },
      cancelada: { label: 'CANCELADA', color: '#D32F2F' },
      expirada: { label: 'EXPIRADA', color: '#FF9800' },
    };
    return statusMap[status] || { label: status.toUpperCase(), color: '#6C757D' };
  };

  const statusInfo = getStatusDisplay(reserva.status);

  const formatarData = (data) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Card
      sx={{
        border: reserva.status === 'ativa' ? '2px solid #2A9D8F' : '1px solid #e0e0e0',
        transition: 'transform 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#223843', flex: 1 }}>
            {reserva.vaga?.estacionamento?.nome || 'Estacionamento'}
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: statusInfo.color,
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {statusInfo.label}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          <LocationOnIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">
            {reserva.vaga?.estacionamento?.endereco?.logradouro},{' '}
            {reserva.vaga?.estacionamento?.endereco?.numero} - {reserva.vaga?.estacionamento?.endereco?.bairro}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LocalParkingIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Vaga: <strong style={{ color: '#223843' }}>{reserva.vaga?.identificacao}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon sx={{ color: '#6C757D', mr: 1, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {formatarData(reserva.data)} - {reserva.hora_inicio?.slice(0, 5)} às {reserva.hora_fim?.slice(0, 5)}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {reserva.status === 'ativa' && (onCancelar || onConcluir) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
            {onCancelar && (
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: '#D32F2F',
                  borderColor: '#D32F2F',
                  '&:hover': {
                    backgroundColor: '#D32F2F',
                    color: 'white',
                    borderColor: '#D32F2F',
                  },
                }}
                onClick={() => onCancelar(reserva.id_reserva)}
              >
                Cancelar
              </Button>
            )}
            {onConcluir && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  backgroundColor: '#2A9D8F',
                  '&:hover': {
                    backgroundColor: '#248277',
                  },
                }}
                onClick={() => onConcluir(reserva.id_reserva)}
              >
                Concluir
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
