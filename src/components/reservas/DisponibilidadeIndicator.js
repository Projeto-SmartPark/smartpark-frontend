import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

export default function DisponibilidadeIndicator({ verificando, disponivel }) {
  if (verificando) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, py: 1 }}>
        <CircularProgress size={20} sx={{ color: '#2A9D8F', mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Verificando disponibilidade...
        </Typography>
      </Box>
    );
  }

  if (!disponivel) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          p: 1.5,
          borderRadius: 1,
          backgroundColor: '#FFF3CD',
          border: '1px solid #FFC107',
        }}
      >
        <WarningIcon sx={{ color: '#FF9800', mr: 1 }} />
        <Typography variant="body2" sx={{ color: '#663C00' }}>
          Vaga indisponível para este horário
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        p: 1.5,
        borderRadius: 1,
        backgroundColor: '#D4EDDA',
        border: '1px solid #28A745',
      }}
    >
      <CheckCircleIcon sx={{ color: '#28A745', mr: 1 }} />
      <Typography variant="body2" sx={{ color: '#155724' }}>
        Vaga disponível para este horário
      </Typography>
    </Box>
  );
}
