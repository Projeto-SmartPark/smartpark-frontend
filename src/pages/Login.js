import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Stack, Link } from '@mui/material';
import { AuthCard, Logo, Input, Button, FormLink, SelectInput } from '../components';
import authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !tipoUsuario) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      // Converter tipoUsuario para o formato da API
      const perfil = tipoUsuario === 'cliente' ? 'C' : 'G';

      await authService.login(email, password, perfil);

      // Login bem-sucedido - token salvo no localStorage
      console.log('Login realizado com sucesso!');
    } catch (err) {
      setError('Credenciais incorretas!');
    } finally {
      setLoading(false);
    }
  };

  const tipoUsuarioOptions = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'gestor', label: 'Gestor' },
  ];

  return (
    <AuthCard>
      <Logo title="SmartPark - Login" subtitle="Entre com suas credenciais" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <SelectInput
            label="Tipo de usuário"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            options={tipoUsuarioOptions}
            disabled={loading}
          />

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Stack>

        <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
          <Link
            component="button"
            type="button"
            underline="hover"
            sx={{ color: '#2A9D8F', fontSize: '0.875rem' }}
            onClick={() => navigate('/recuperar-senha')}
            disabled={loading}
          >
            Esqueci minha senha
          </Link>
        </Box>

        <Button type="submit" size="large" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <FormLink
          text="Não tem uma conta?"
          linkText="Cadastre-se"
          onClick={() => navigate('/cadastro')}
        />
      </Box>
    </AuthCard>
  );
}
