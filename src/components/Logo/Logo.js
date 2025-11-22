import React from 'react';
import { Box, Typography } from '@mui/material';

function Logo({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#223843', fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: '#6C757D' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default Logo;
