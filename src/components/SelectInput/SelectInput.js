import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function SelectInput({ label, value, onChange, options, ...props }) {
  return (
    <FormControl
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: '#2A9D8F',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2A9D8F',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#2A9D8F',
        },
      }}
      {...props}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectInput;
