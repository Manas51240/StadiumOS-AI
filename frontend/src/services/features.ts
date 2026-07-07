import { alertSchema, incidentSchema, taskSchema } from '../validators';
import { getApiUrl, getAuthHeaders } from './client';

export const dashboardService = {
  async getStats() {
    const res = await fetch(`${getApiUrl()}/api/v1/dashboard/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getReports() {
    const res = await fetch(`${getApiUrl()}/api/v1/reports/`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async createAlert(payload: any) {
    const validated = alertSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/crowd/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  async generateReport(reportType: string) {
    const res = await fetch(`${getApiUrl()}/api/v1/reports/?report_type=${reportType}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  }
};

export const emergencyService = {
  async getIncidents() {
    const res = await fetch(`${getApiUrl()}/api/v1/emergency/incidents`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async reportIncident(payload: any) {
    const validated = incidentSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/emergency/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to report incident');
    return res.json();
  },

  async resolveIncident(id: number) {
    const res = await fetch(`${getApiUrl()}/api/v1/emergency/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    return res.json();
  }
};

export const navigationService = {
  async getNodes() {
    const res = await fetch(`${getApiUrl()}/api/v1/navigation/nodes`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch navigation nodes');
    return res.json();
  },

  async getRoute(startNodeId: number, endNodeId: number) {
    const res = await fetch(`${getApiUrl()}/api/v1/navigation/route?start_node_id=${startNodeId}&end_node_id=${endNodeId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to compute route');
    return res.json();
  }
};

export const volunteerService = {
  async getTasks() {
    const res = await fetch(`${getApiUrl()}/api/v1/volunteer/tasks`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(payload: any) {
    const validated = taskSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/volunteer/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTaskStatus(id: number, status: string) {
    const res = await fetch(`${getApiUrl()}/api/v1/volunteer/tasks/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  }
};
