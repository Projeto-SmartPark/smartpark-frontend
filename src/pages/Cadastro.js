import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Stack, Divider } from '@mui/material';
import { AuthCard, Logo, Input, Button, FormLink, SelectInput } from '../components';
import authService from '../services/authService';

export default function CadastroPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: '',
    cnpj: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    // Formatar CNPJ enquanto digita
    if (field === 'cnpj') {
      // Remove tudo que não é número
      const apenasNumeros = value.replace(/\D/g, '');
      
      // Aplica a máscara: 00.000.000/0000-00
      let cnpjFormatado = apenasNumeros;
      if (apenasNumeros.length <= 14) {
        cnpjFormatado = apenasNumeros
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      
      setFormData((prev) => ({ ...prev, [field]: cnpjFormatado }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha || !formData.tipoUsuario) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (formData.tipoUsuario === 'gestor' && !formData.cnpj) {
      setError('Por favor, informe o CNPJ');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Converter tipoUsuario para o formato da API
      const perfil = formData.tipoUsuario === 'cliente' ? 'C' : 'G';

      // Remover formatação do CNPJ (enviar apenas números)
      const cnpjApenasNumeros = formData.cnpj ? formData.cnpj.replace(/\D/g, '') : null;

      await authService.register({
        perfil,
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cnpj: cnpjApenasNumeros,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || err.error || 'Erro ao realizar cadastro');
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
      <Logo title="Criar Conta" subtitle="Preencha os dados para se cadastrar" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Cadastro realizado com sucesso! Redirecionando...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <SelectInput
            label="Tipo de usuário"
            value={formData.tipoUsuario}
            onChange={(e) => handleChange('tipoUsuario', e.target.value)}
            options={tipoUsuarioOptions}
            disabled={loading}
            id="select-tipo-usuario"
            data-testid="select-tipo-usuario"
          />

          <Divider sx={{ my: 1 }} />

          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            disabled={loading}
            id="input-nome-cadastro"
            data-testid="input-nome-cadastro"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={loading}
            id="input-email-cadastro"
            data-testid="input-email-cadastro"
          />

          <Input
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={(e) => handleChange('senha', e.target.value)}
            disabled={loading}
            id="input-senha-cadastro"
            data-testid="input-senha-cadastro"
          />

          <Input
            label="Confirmar Senha"
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) => handleChange('confirmarSenha', e.target.value)}
            disabled={loading}
            id="input-confirmar-senha-cadastro"
            data-testid="input-confirmar-senha-cadastro"
          />

          {formData.tipoUsuario === 'gestor' && (
            <>
              <Divider sx={{ my: 1 }} />
              <Input
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
                disabled={loading}
                inputProps={{ maxLength: 18 }}
                id="input-cnpj-cadastro"
                data-testid="input-cnpj-cadastro"
              />
            </>
          )}
        </Stack>

        <Button 
          type="submit" 
          size="large" 
          sx={{ mt: 3 }} 
          disabled={loading}
          id="btn-cadastrar"
          data-testid="btn-cadastrar"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>

        <FormLink 
          text="Já tem uma conta?" 
          linkText="Entrar" 
          onClick={() => navigate('/login')}
          data-testid="link-login"
        />
      </Box>
    </AuthCard>
  );
}
