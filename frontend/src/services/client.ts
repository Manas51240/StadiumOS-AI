export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('run.app')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('stadium-os-frontend')) {
      return window.location.origin.replace('stadium-os-frontend', 'stadium-os-backend');
    }
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return '';
    }
  }
  return 'http://localhost:8000';
};

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('stadium_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};
