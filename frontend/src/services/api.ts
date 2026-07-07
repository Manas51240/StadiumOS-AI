import { loginSchema, signupSchema, chatSchema } from '../validators';
import { getApiUrl, getAuthHeaders } from './client';

export * from './features';

export const authService = {
  async login(payload: any) {
    const validated = loginSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async signup(payload: any) {
    const validated = signupSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }
};

export const assistantService = {
  async chat(payload: any) {
    const validated = chatSchema.parse(payload);
    const res = await fetch(`${getApiUrl()}/api/v1/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(validated)
    });
    if (!res.ok) throw new Error('Chat request failed');
    return res.json();
  }
};
