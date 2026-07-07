import { useAuth } from '../context/AuthContext';
import { VolunteerTaskDTO } from '../types';

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

  const getTasks = async (): Promise<VolunteerTaskDTO[]> => {
    return apiFetch('/api/v1/volunteer/tasks');
  };

  const createTask = async (payload: CreateTaskPayload): Promise<VolunteerTaskDTO> => {
    return apiFetch('/api/v1/volunteer/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  };

  const updateTask = async (taskId: number, payload: UpdateTaskPayload): Promise<VolunteerTaskDTO> => {
    return apiFetch(`/api/v1/volunteer/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  };

  return {
    getTasks,
    createTask,
    updateTask
  };
}
