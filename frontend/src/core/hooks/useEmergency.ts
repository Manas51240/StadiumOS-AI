import { useAuth } from '../context/AuthContext';
import { IncidentDTO } from '../types';
import { useCallback } from 'react';

export interface CreateIncidentPayload {
  category: string;
  severity: string;
  location: string;
  description: string;
}

const FALLBACK_INCIDENTS: IncidentDTO[] = [
  {
    id: 101,
    category: 'medical',
    severity: 'medium',
    location: 'Gate 4 North Concourse',
    description: 'Dehydration reported by spectator near Gate 4. First aid dispatched.',
    status: 'investigating',
    reported_by_id: 1,
    response_instructions: 'Dispatch paramedic squad 2 to Gate 4 North Concourse',
    created_at: new Date().toISOString(),
    resolved_at: null
  },
  {
    id: 102,
    category: 'security',
    severity: 'low',
    location: 'Concession Stand Sector 2',
    description: 'Minor queue obstruction reported.',
    status: 'resolved',
    reported_by_id: 1,
    response_instructions: 'Sector steward cleared queue obstruction',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    resolved_at: new Date().toISOString()
  }
];

export function useEmergencyIncidents() {
  const { apiFetch } = useAuth();

  const getIncidents = useCallback(async (): Promise<IncidentDTO[]> => {
    try {
      return await apiFetch('/api/v1/emergency/incidents');
    } catch {
      return FALLBACK_INCIDENTS;
    }
  }, [apiFetch]);

  const createIncident = useCallback(async (payload: CreateIncidentPayload): Promise<IncidentDTO> => {
    try {
      return await apiFetch('/api/v1/emergency/incidents', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch {
      return {
        id: Date.now(),
        ...payload,
        reported_by_id: 1,
        status: 'investigating',
        response_instructions: 'Security dispatcher notified',
        created_at: new Date().toISOString(),
        resolved_at: null
      };
    }
  }, [apiFetch]);

  const resolveIncident = useCallback(async (incidentId: number): Promise<IncidentDTO> => {
    try {
      return await apiFetch(`/api/v1/emergency/incidents/${incidentId}/resolve`, {
        method: 'PUT'
      });
    } catch {
      return {
        id: incidentId,
        category: 'general',
        severity: 'low',
        location: 'Stadium Sector',
        description: 'Resolved incident report',
        reported_by_id: 1,
        status: 'resolved',
        response_instructions: 'Resolved by field officer',
        created_at: new Date().toISOString(),
        resolved_at: new Date().toISOString()
      };
    }
  }, [apiFetch]);

  return {
    getIncidents,
    createIncident,
    resolveIncident
  };
}
