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

const tarifaService = {
  // Listar todas as tarifas
  getTarifas: async () => {
    try {
      const response = await api.get('/tarifas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar tarifas', message: 'Erro desconhecido' };
    }
  },

  // Buscar tarifa por ID
  getTarifaById: async (id) => {
    try {
      const response = await api.get(`/tarifas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar tarifa', message: 'Erro desconhecido' };
    }
  },

  // Criar nova tarifa
  createTarifa: async (data) => {
    try {
      const response = await api.post('/tarifas', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar tarifa', message: 'Erro desconhecido' };
    }
  },

  // Atualizar tarifa
  updateTarifa: async (id, data) => {
    try {
      const response = await api.put(`/tarifas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar tarifa', message: 'Erro desconhecido' };
    }
  },

  // Deletar tarifa
  deleteTarifa: async (id) => {
    try {
      const response = await api.delete(`/tarifas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar tarifa', message: 'Erro desconhecido' };
    }
  },
};

export default tarifaService;
