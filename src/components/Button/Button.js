import React from 'react';
import { Button as MuiButton } from '@mui/material';

function Button({ children, variant = 'contained', fullWidth = true, onClick, type = 'button', ...props }) {
  return (
    <MuiButton
      fullWidth={fullWidth}
      type={type}
      variant={variant}
      onClick={onClick}
      sx={{
        bgcolor: '#2A9D8F',
        color: '#F5F5F5',
        py: 1.5,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        '&:hover': {
          bgcolor: '#238276',
        },
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

export default Button;
