import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#223843',
        color: 'white',
        py: 2,
        textAlign: 'center',
        mt: 'auto',
        width: '100%',
      }}
    >
      <Typography variant="body2">SmartPark © 2025</Typography>
    </Box>
  );
}
