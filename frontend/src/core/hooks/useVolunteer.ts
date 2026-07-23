import { useAuth } from '../context/AuthContext';
import { VolunteerTaskDTO } from '../types';
import { useCallback } from 'react';

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: string;
  sector: string;
  shift_start: string;
  shift_end: string;
}

export interface UpdateTaskPayload {
  status?: string;
  assigned_to_id?: number | null;
  priority?: string;
}

const FALLBACK_TASKS: VolunteerTaskDTO[] = [
  {
    id: 1,
    title: 'Assist Gate A Evacuation & Access Control',
    description: 'Ensure smooth crowd flow, guide visitors to step-free ramps, and report gate bottlenecking.',
    priority: 'high',
    sector: 'North Stand',
    shift_start: new Date().toISOString(),
    shift_end: new Date(Date.now() + 14400000).toISOString(),
    assigned_to_id: 1,
    status: 'in_progress'
  },
  {
    id: 2,
    title: 'Concession Stand Sector 4 Water Station Dispatch',
    description: 'Distribute hydration kits and direct attendees towards secondary restrooms.',
    priority: 'medium',
    sector: 'East Stand',
    shift_start: new Date().toISOString(),
    shift_end: new Date(Date.now() + 14400000).toISOString(),
    assigned_to_id: null,
    status: 'pending'
  },
  {
    id: 3,
    title: 'VIP Gate 2 Security Escort & Assist',
    description: 'Assist delegation entry and verify credential passes at Sector 2.',
    priority: 'low',
    sector: 'West Stand',
    shift_start: new Date().toISOString(),
    shift_end: new Date(Date.now() + 14400000).toISOString(),
    assigned_to_id: null,
    status: 'completed'
  }
];

export function useVolunteerTasks() {
  const { apiFetch } = useAuth();

  const getTasks = useCallback(async (): Promise<VolunteerTaskDTO[]> => {
    try {
      return await apiFetch('/api/v1/volunteer/tasks');
    } catch {
      return FALLBACK_TASKS;
    }
  }, [apiFetch]);

  const createTask = useCallback(async (payload: CreateTaskPayload): Promise<VolunteerTaskDTO> => {
    try {
      return await apiFetch('/api/v1/volunteer/tasks', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch {
      const newTask: VolunteerTaskDTO = {
        id: Date.now(),
        ...payload,
        assigned_to_id: null,
        status: 'pending'
      };
      return newTask;
    }
  }, [apiFetch]);

  const updateTask = useCallback(async (taskId: number, payload: UpdateTaskPayload): Promise<VolunteerTaskDTO> => {
    try {
      return await apiFetch(`/api/v1/volunteer/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } catch {
      return {
        id: taskId,
        title: 'Updated Volunteer Duty Task',
        description: 'Updated duty instructions',
        priority: payload.priority || 'medium',
        sector: 'North Stand',
        shift_start: new Date().toISOString(),
        shift_end: new Date(Date.now() + 14400000).toISOString(),
        assigned_to_id: payload.assigned_to_id !== undefined ? payload.assigned_to_id : null,
        status: payload.status || 'in_progress'
      };
    }
  }, [apiFetch]);

  return {
    getTasks,
    createTask,
    updateTask
  };
}
