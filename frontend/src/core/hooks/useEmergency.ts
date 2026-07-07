import { useAuth } from '../context/AuthContext';
import { IncidentDTO } from '../types';

export interface CreateIncidentPayload {
  category: string;
  severity: string;
  location: string;
  description: string;
}

export function useEmergencyIncidents() {
  const { apiFetch } = useAuth();

  const getIncidents = async (): Promise<IncidentDTO[]> => {
    return apiFetch('/api/v1/emergency/incidents');
  };

  const createIncident = async (payload: CreateIncidentPayload): Promise<IncidentDTO> => {
    return apiFetch('/api/v1/emergency/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  };

  const resolveIncident = async (incidentId: number): Promise<IncidentDTO> => {
    return apiFetch(`/api/v1/emergency/incidents/${incidentId}/resolve`, {
      method: 'PUT'
    });
  };

  return {
    getIncidents,
    createIncident,
    resolveIncident
  };
}
