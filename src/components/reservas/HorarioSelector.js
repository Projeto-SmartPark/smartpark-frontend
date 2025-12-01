import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function HorarioSelector({ dataReserva, horaInicio, duracao, onDataChange, onHoraChange, onDuracaoChange }) {
  const getDataMinima = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Data"
          type="date"
          value={dataReserva}
          onChange={(e) => onDataChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: getDataMinima(),
          }}
          id="input-data-reserva"
          data-testid="input-data-reserva"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Hora de Início"
          type="time"
          value={horaInicio}
          onChange={(e) => onHoraChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          id="input-hora-inicio-reserva"
          data-testid="input-hora-inicio-reserva"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Duração Estimada</InputLabel>
          <Select 
            value={duracao} 
            onChange={(e) => onDuracaoChange(e.target.value)} 
            label="Duração Estimada"
            id="select-duracao-reserva"
            data-testid="select-duracao-reserva"
          >
            <MenuItem value="0.5">30 minutos</MenuItem>
            <MenuItem value="1">1 hora</MenuItem>
            <MenuItem value="2">2 horas</MenuItem>
            <MenuItem value="3">3 horas</MenuItem>
            <MenuItem value="4">4 horas</MenuItem>
            <MenuItem value="6">6 horas</MenuItem>
            <MenuItem value="8">8 horas</MenuItem>
            <MenuItem value="12">12 horas</MenuItem>
            <MenuItem value="24">24 horas</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
