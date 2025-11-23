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

const reservaService = {
  // Listar reservas do cliente autenticado
  getReservasPorCliente: async () => {
    try {
      const response = await api.get('/reservas/cliente');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar reservas', message: 'Erro desconhecido' };
    }
  },

  // Buscar reserva por ID
  getReservaById: async (id) => {
    try {
      const response = await api.get(`/reservas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar reserva', message: 'Erro desconhecido' };
    }
  },

  // Verificar disponibilidade de vaga
  verificarDisponibilidade: async (vagaId, data, horaInicio, horaFim) => {
    try {
      const response = await api.post('/reservas/verificar-disponibilidade', {
        vaga_id: vagaId,
        data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
      });
      return response.data.disponivel;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao verificar disponibilidade', message: 'Erro desconhecido' };
    }
  },

  // Criar nova reserva
  createReserva: async (data) => {
    try {
      const response = await api.post('/reservas', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar reserva', message: 'Erro desconhecido' };
    }
  },

  // Cancelar reserva
  cancelarReserva: async (id) => {
    try {
      const response = await api.put(`/reservas/${id}/cancelar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao cancelar reserva', message: 'Erro desconhecido' };
    }
  },
};

export default reservaService;
