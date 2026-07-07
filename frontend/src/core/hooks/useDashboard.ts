import { useAuth } from '../context/AuthContext';
import { OperationReportDTO, CrowdAlertDTO } from '../types';
import { useCallback } from 'react';

export interface CommandCenterStats {
  crowd_safety_index: string;
  active_alerts_count: number;
  unresolved_incidents_count: number;
  volunteers_on_shift: number;
  carbon_offset_kg: number;
  sustainability_status: string;
}

export function useDashboard() {
  const { apiFetch } = useAuth();

  const getStats = useCallback(async (): Promise<CommandCenterStats> => {
    return apiFetch('/api/v1/dashboard/stats');
  }, [apiFetch]);

  const getReports = useCallback(async (): Promise<OperationReportDTO[]> => {
    return apiFetch('/api/v1/reports');
  }, [apiFetch]);

  const createCrowdAlert = useCallback(async (payload: {
    sector: string;
    congestion_level: string;
    spectator_count: number;
    capacity: number;
    message: string;
  }): Promise<CrowdAlertDTO> => {
    return apiFetch('/api/v1/crowd/alerts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }, [apiFetch]);

  const generateReport = useCallback(async (reportType: string): Promise<OperationReportDTO> => {
    return apiFetch(`/api/v1/reports/generate?report_type=${reportType}`, {
      method: 'POST'
    });
  }, [apiFetch]);

  return {
    getStats,
    getReports,
    createCrowdAlert,
    generateReport
  };
}
