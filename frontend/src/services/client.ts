export const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('stadium-os-frontend')) {
      url = window.location.origin.replace('stadium-os-frontend', 'stadium-os-backend');
    }
  }
  return url;
};

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('stadium_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};
