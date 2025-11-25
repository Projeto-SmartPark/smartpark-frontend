import axios from 'axios';
import { BACKEND_API_URL } from '../config/api';
import authService from './authService';

const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
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

const acessoService = {
  // Buscar todos os acessos (gestor)
  getAcessos: async () => {
    try {
      const response = await api.get('/acessos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar acessos:', error);
      throw error;
    }
  },

  // Buscar acessos do cliente autenticado
  getAcessosCliente: async () => {
    try {
      const response = await api.get('/acessos/cliente');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar acessos do cliente:', error);
      throw error;
    }
  },

  // Buscar acesso por ID
  getAcessoById: async (id) => {
    try {
      const response = await api.get(`/acessos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar acesso:', error);
      throw error;
    }
  },

  // Criar novo acesso
  createAcesso: async (acessoData) => {
    try {
      const response = await api.post('/acessos', acessoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar acesso:', error);
      throw error;
    }
  },

  // Atualizar acesso
  updateAcesso: async (id, acessoData) => {
    try {
      const response = await api.put(`/acessos/${id}`, acessoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar acesso:', error);
      throw error;
    }
  },

  // Deletar acesso
  deleteAcesso: async (id) => {
    try {
      const response = await api.delete(`/acessos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar acesso:', error);
      throw error;
    }
  },

  // Pagar acesso
  pagarAcesso: async (id) => {
    try {
      const response = await api.put(`/acessos/${id}`, { pago: 'S' });
      return response.data;
    } catch (error) {
      console.error('Erro ao pagar acesso:', error);
      throw error;
    }
  },
};

export default acessoService;
