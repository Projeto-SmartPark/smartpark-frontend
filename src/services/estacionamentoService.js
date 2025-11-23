import axios from 'axios';
import { BACKEND_API_URL } from '../config/api';
import authService from './authService';

const estacionamentoApi = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para adicionar token
estacionamentoApi.interceptors.request.use(
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

// Interceptor para tratar erros
estacionamentoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const estacionamentoService = {
  // Listar todos os estacionamentos
  getEstacionamentos: async () => {
    try {
      const response = await estacionamentoApi.get('/estacionamentos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estacionamentos', message: 'Erro desconhecido' };
    }
  },

  // Buscar estacionamento por ID
  getEstacionamento: async (id) => {
    try {
      const response = await estacionamentoApi.get(`/estacionamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estacionamento', message: 'Erro desconhecido' };
    }
  },

  // Criar estacionamento
  createEstacionamento: async (data) => {
    try {
      const response = await estacionamentoApi.post('/estacionamentos', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar estacionamento', message: 'Erro desconhecido' };
    }
  },

  // Atualizar estacionamento
  updateEstacionamento: async (id, data) => {
    try {
      const response = await estacionamentoApi.put(`/estacionamentos/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar estacionamento', message: 'Erro desconhecido' };
    }
  },

  // Deletar estacionamento
  deleteEstacionamento: async (id) => {
    try {
      const response = await estacionamentoApi.delete(`/estacionamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar estacionamento', message: 'Erro desconhecido' };
    }
  },
};

export default estacionamentoService;
