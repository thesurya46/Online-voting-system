import api from './api';
import { Election, Position, Candidate } from '../types';

export const analyticsService = {
  getElectionStats: async (electionId: string) => {
    const response = await api.get(`/analytics/election/${electionId}/stats`);
    return response.data.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/analytics/system/stats');
    return response.data.data;
  },

  getElectionReport: async (electionId: string) => {
    const response = await api.get(`/analytics/election/${electionId}/report`);
    return response.data.data;
  },

  exportReportAsPDF: async (electionId: string) => {
    const response = await api.get(`/analytics/election/${electionId}/report/pdf`);
    return response.data;
  },

  exportReportAsCSV: async (electionId: string) => {
    const response = await api.get(`/analytics/election/${electionId}/report/csv`);
    return response.data;
  },

  getUserActivityLog: async (limit = 50) => {
    const response = await api.get('/analytics/user/activity-log', { params: { limit } });
    return response.data.data;
  }
};
