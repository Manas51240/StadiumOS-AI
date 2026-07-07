import { useAuth } from '../context/AuthContext';
import { IncidentDTO } from '../types';
import { useCallback } from 'react';

export interface CreateIncidentPayload {
  category: string;
  severity: string;
  location: string;
  description: string;
}

export function useEmergencyIncidents() {
  const { apiFetch } = useAuth();

  const getIncidents = useCallback(async (): Promise<IncidentDTO[]> => {
    return apiFetch('/api/v1/emergency/incidents');
  }, [apiFetch]);

  const createIncident = useCallback(async (payload: CreateIncidentPayload): Promise<IncidentDTO> => {
    return apiFetch('/api/v1/emergency/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }, [apiFetch]);

  const resolveIncident = useCallback(async (incidentId: number): Promise<IncidentDTO> => {
    return apiFetch(`/api/v1/emergency/incidents/${incidentId}/resolve`, {
      method: 'PUT'
    });
  }, [apiFetch]);

  return {
    getIncidents,
    createIncident,
    resolveIncident
  };
}
