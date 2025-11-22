import React from 'react';
import { TextField } from '@mui/material';

function Input({ label, type = 'text', value, onChange, placeholder, ...props }) {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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
    />
  );
}

export default Input;
