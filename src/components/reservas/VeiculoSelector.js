import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function VeiculoSelector({ veiculos, veiculoSelecionado, onChange, onAdicionarVeiculo, loading }) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth disabled={loading}>
        <InputLabel>Veículo</InputLabel>
        <Select
          value={veiculoSelecionado}
          onChange={(e) => onChange(e.target.value)}
          label="Veículo"
          renderValue={(selected) => {
            const veiculo = veiculos.find((v) => v.id_veiculo === selected);
            if (!veiculo) return '';
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DirectionsCarIcon sx={{ mr: 1, color: '#6C757D' }} />
                <Typography>{veiculo.placa}</Typography>
              </Box>
            );
          }}
        >
          {veiculos.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                Nenhum veículo cadastrado
              </Typography>
            </MenuItem>
          ) : (
            veiculos.map((veiculo) => (
              <MenuItem key={veiculo.id_veiculo} value={veiculo.id_veiculo}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: '#6C757D' }} />
                  <Typography>{veiculo.placa}</Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      
      {veiculos.length === 0 && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAdicionarVeiculo}
          sx={{ mt: 1, color: '#2A9D8F', borderColor: '#2A9D8F' }}
        >
          Cadastrar Veículo
        </Button>
      )}
    </Box>
  );
}
