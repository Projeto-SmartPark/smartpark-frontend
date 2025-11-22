import axios from 'axios';
import { BACKEND_API_URL } from '../config/api';
import authService from './authService';

const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
backendApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
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
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      authService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exemplos de métodos para consumir o backend
const backendService = {
  // Clientes
  getClientes: async () => {
    try {
      const response = await backendApi.get('/clientes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar clientes', message: 'Erro desconhecido' };
    }
  },

  getCliente: async (id) => {
    try {
      const response = await backendApi.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar cliente', message: 'Erro desconhecido' };
    }
  },

  createCliente: async (data) => {
    try {
      const response = await backendApi.post('/clientes', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar cliente', message: 'Erro desconhecido' };
    }
  },

  updateCliente: async (id, data) => {
    try {
      const response = await backendApi.put(`/clientes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar cliente', message: 'Erro desconhecido' };
    }
  },

  deleteCliente: async (id) => {
    try {
      const response = await backendApi.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar cliente', message: 'Erro desconhecido' };
    }
  },

  // Gestores
  getGestores: async () => {
    try {
      const response = await backendApi.get('/gestores');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar gestores', message: 'Erro desconhecido' };
    }
  },

  getGestor: async (id) => {
    try {
      const response = await backendApi.get(`/gestores/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar gestor', message: 'Erro desconhecido' };
    }
  },

  createGestor: async (data) => {
    try {
      const response = await backendApi.post('/gestores', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar gestor', message: 'Erro desconhecido' };
    }
  },

  updateGestor: async (id, data) => {
    try {
      const response = await backendApi.put(`/gestores/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar gestor', message: 'Erro desconhecido' };
    }
  },

  deleteGestor: async (id) => {
    try {
      const response = await backendApi.delete(`/gestores/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar gestor', message: 'Erro desconhecido' };
    }
  },

  // Usuários
  getUsuarios: async () => {
    try {
      const response = await backendApi.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar usuários', message: 'Erro desconhecido' };
    }
  },
};

export default backendService;
