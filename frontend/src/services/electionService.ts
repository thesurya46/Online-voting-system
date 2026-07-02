import api from './api';
import { Election, Position, Candidate } from '../types';

export const electionService = {
  getElections: async (page = 1, limit = 10) => {
    const response = await api.get('/elections', {
      params: { page, limit }
    });
    return response.data.data;
  },

  getElection: async (id: string) => {
    const response = await api.get<Election>(`/elections/${id}`);
    return response.data.data;
  },

  createElection: async (data: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  }) => {
    const response = await api.post<Election>('/elections', data);
    return response.data.data;
  },

  updateElection: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      status?: string;
    }
  ) => {
    const response = await api.put<Election>(`/elections/${id}`, data);
    return response.data.data;
  },

  deleteElection: async (id: string) => {
    await api.delete(`/elections/${id}`);
  }
};
