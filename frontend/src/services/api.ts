import { loginSchema, signupSchema, alertSchema, incidentSchema, taskSchema, chatSchema } from '../validators';

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('stadium-os-frontend')) {
      url = window.location.origin.replace('stadium-os-frontend', 'stadium-os-backend');
    }
  }
  return url;
};

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('stadium_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

export const authService = {
  async login(payload: any) {
    const validated = loginSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async signup(payload: any) {
    const validated = signupSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }
};

export const dashboardService = {
  async getStats() {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/dashboard/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getReports() {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/reports/`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async createAlert(payload: any) {
    const validated = alertSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/crowd/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  async generateReport(reportType: string) {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/reports/?report_type=${reportType}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  }
};

export const emergencyService = {
  async getIncidents() {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/emergency/incidents`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async reportIncident(payload: any) {
    const validated = incidentSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/emergency/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to report incident');
    return res.json();
  },

  async resolveIncident(id: number) {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/emergency/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    return res.json();
  }
};

export const navigationService = {
  async getNodes() {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/navigation/nodes`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch navigation nodes');
    return res.json();
  },

  async getRoute(startNodeId: number, endNodeId: number) {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/navigation/route?start_node_id=${startNodeId}&end_node_id=${endNodeId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to compute route');
    return res.json();
  }
};

export const volunteerService = {
  async getTasks() {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/volunteer/tasks`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(payload: any) {
    const validated = taskSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/volunteer/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTaskStatus(id: number, status: string) {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/volunteer/tasks/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  }
};

export const assistantService = {
  async chat(payload: any) {
    const validated = chatSchema.parse(payload);
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}/api/v1/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Chat request failed');
    return res.json();
  }
};
