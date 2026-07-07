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

export function useVolunteerTasks() {
  const { apiFetch } = useAuth();

  const getTasks = useCallback(async (): Promise<VolunteerTaskDTO[]> => {
    return apiFetch('/api/v1/volunteer/tasks');
  }, [apiFetch]);

  const createTask = useCallback(async (payload: CreateTaskPayload): Promise<VolunteerTaskDTO> => {
    return apiFetch('/api/v1/volunteer/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }, [apiFetch]);

  const updateTask = useCallback(async (taskId: number, payload: UpdateTaskPayload): Promise<VolunteerTaskDTO> => {
    return apiFetch(`/api/v1/volunteer/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }, [apiFetch]);

  return {
    getTasks,
    createTask,
    updateTask
  };
}
