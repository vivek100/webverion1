import { supabase } from '../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeader() {
  const session = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session.data.session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export const api = {
  async get(endpoint: string) {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async connectWebSocket(projectId: string) {
    const session = await supabase.auth.getSession();
    const ws = new WebSocket(
      `ws://localhost:8000/ws?token=${session.data.session?.access_token}&project_id=${projectId}`
    );

    // Add connection event handlers
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return ws;
  }
}; 