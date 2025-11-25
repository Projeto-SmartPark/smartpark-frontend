import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function Header({ showLogout = false }) {
  const navigate = useNavigate();
  const [saindo, setSaindo] = useState(false);

  const handleLogout = async () => {
    setSaindo(true);
    await authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#223843', mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          SmartPark
        </Typography>
        {showLogout && (
          <IconButton
            color="inherit"
            onClick={handleLogout}
            disabled={saindo}
            sx={{
              backgroundColor: '#DC3545',
              '&:hover': { backgroundColor: '#C82333' },
              '&.Mui-disabled': { backgroundColor: '#999999' },
            }}
            title="Sair"
          >
            {saindo ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <LogoutIcon />}
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
