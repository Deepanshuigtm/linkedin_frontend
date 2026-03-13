import axios from 'axios';

// Cloud-ready: Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStatus = async () => {
  const response = await api.get('/api/status');
  return response.data;
};

export const runScript = async (formData) => {
  const response = await api.post('/api/run-script', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const stopScript = async () => {
  const response = await api.post('/api/stop-script');
  return response.data;
};

export const connectWebSocket = (onMessage, onError) => {
  const ws = new WebSocket(`${WS_BASE_URL}/ws/logs`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return ws;
};
