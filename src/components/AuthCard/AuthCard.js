import React from 'react';
import { Box, Card, CardContent, Container } from '@mui/material';

function AuthCard({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F5F5F5',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>{children}</CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AuthCard;
