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

const vagaService = {
  // Listar vagas de um estacionamento
  getVagasByEstacionamento: async (estacionamentoId) => {
    try {
      const response = await api.get(`/vagas/estacionamento/${estacionamentoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar vagas', message: 'Erro desconhecido' };
    }
  },

  // Buscar vaga por ID
  getVagaById: async (id) => {
    try {
      const response = await api.get(`/vagas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar vaga', message: 'Erro desconhecido' };
    }
  },

  // Criar nova vaga
  createVaga: async (data) => {
    try {
      const response = await api.post('/vagas', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar vaga', message: 'Erro desconhecido' };
    }
  },

  // Atualizar vaga
  updateVaga: async (id, data) => {
    try {
      const response = await api.put(`/vagas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar vaga', message: 'Erro desconhecido' };
    }
  },

  // Deletar vaga
  deleteVaga: async (id) => {
    try {
      const response = await api.delete(`/vagas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar vaga', message: 'Erro desconhecido' };
    }
  },
};

export default vagaService;
