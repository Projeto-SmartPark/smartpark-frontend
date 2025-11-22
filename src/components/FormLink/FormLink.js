import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function FormLink({ text, linkText, onClick }) {
  return (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Typography variant="body2" sx={{ color: '#6C757D' }}>
        {text}{' '}
        <Link
          component="button"
          type="button"
          underline="hover"
          sx={{ color: '#2A9D8F', fontWeight: 600 }}
          onClick={onClick}
        >
          {linkText}
        </Link>
      </Typography>
    </Box>
  );
}

export default FormLink;
