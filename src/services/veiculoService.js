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

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

const veiculoService = {
  // Listar veículos do cliente autenticado
  getVeiculosPorCliente: async () => {
    try {
      const response = await api.get('/veiculos/cliente');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar veículos', message: 'Erro desconhecido' };
    }
  },

  // Buscar veículo por ID
  getVeiculoById: async (id) => {
    try {
      const response = await api.get(`/veiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar veículo', message: 'Erro desconhecido' };
    }
  },

  // Criar novo veículo
  createVeiculo: async (data) => {
    try {
      const response = await api.post('/veiculos', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar veículo', message: 'Erro desconhecido' };
    }
  },

  // Atualizar veículo
  updateVeiculo: async (id, data) => {
    try {
      const response = await api.put(`/veiculos/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar veículo', message: 'Erro desconhecido' };
    }
  },

  // Deletar veículo
  deleteVeiculo: async (id) => {
    try {
      const response = await api.delete(`/veiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar veículo', message: 'Erro desconhecido' };
    }
  },
};

export default veiculoService;
