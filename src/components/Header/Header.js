import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function Header({ showLogout = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
            sx={{
              backgroundColor: '#2A9D8F',
              '&:hover': { backgroundColor: '#248277' },
            }}
            title="Sair"
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
