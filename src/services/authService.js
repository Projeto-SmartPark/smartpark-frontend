import axios from 'axios';
import { AUTH_API_URL } from '../config/api';

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições protegidas
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar automaticamente no login/cadastro (deixar a página tratar)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
      // Token expirado ou inválido
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções auxiliares para gerenciar token
const saveToken = (token, usuario) => {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

const getUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

const isAuthenticated = () => {
  return !!getToken();
};

// Serviço de autenticação
const authService = {
  // Cadastro
  register: async (data) => {
    try {
      const response = await authApi.post('/auth/register', {
        perfil: data.perfil,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cnpj: data.cnpj || null,
      });

      if (response.data.token) {
        saveToken(response.data.token, response.data.usuario);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao cadastrar', message: 'Erro desconhecido' };
    }
  },

  // Login
  login: async (email, senha, perfil) => {
    try {
      const response = await authApi.post('/auth/login', {
        email,
        senha,
        perfil,
      });

      if (response.data.token) {
        saveToken(response.data.token, response.data.usuario);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer login', message: 'Erro desconhecido' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      removeToken();
      window.location.href = '/login';
    }
  },

  // Obter dados do usuário autenticado
  me: async () => {
    try {
      const response = await authApi.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar usuário', message: 'Erro desconhecido' };
    }
  },

  // Renovar token
  refresh: async () => {
    try {
      const response = await authApi.post('/auth/refresh');
      if (response.data.token) {
        const usuario = getUsuario();
        saveToken(response.data.token, usuario);
      }
      return response.data;
    } catch (error) {
      removeToken();
      throw error.response?.data || { error: 'Erro ao renovar token', message: 'Erro desconhecido' };
    }
  },

  // Funções auxiliares exportadas
  saveToken,
  getToken,
  removeToken,
  getUsuario,
  isAuthenticated,
};

export default authService;
