const API_URL = 'https://slot-swapper-backend-pxie.onrender.com' || 'http://localhost:5000/api';

export const api = {
  auth: {
    signup: async (name, email, password) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    login: async (email, password) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
  },
  events: {
    getAll: async (token) => {
      const response = await fetch(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    create: async (token, event) => {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    update: async (token, id, updates) => {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    delete: async (token, id) => {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
  },
  swaps: {
    getSwappableSlots: async (token) => {
      const response = await fetch(`${API_URL}/swaps/swappable-slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    createSwapRequest: async (token, mySlotId, theirSlotId) => {
      const response = await fetch(`${API_URL}/swaps/swap-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mySlotId, theirSlotId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    getIncoming: async (token) => {
      const response = await fetch(`${API_URL}/swaps/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    getOutgoing: async (token) => {
      const response = await fetch(`${API_URL}/swaps/outgoing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    respondToSwap: async (token, requestId, accept) => {
      const response = await fetch(`${API_URL}/swaps/swap-response/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
  },
};
