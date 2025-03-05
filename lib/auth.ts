import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  initAuth: () => Promise<void>;
}

const API_URL = 'https://localhost/';

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    const token = localStorage.getItem('token');
      
    if (token) {
      try {
        const response = await fetch(`${API_URL}api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          set({ token, user, isAuthenticated: true, isLoading: false });
          return;
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }

    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      set({ token: data.token });
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('token');
  },

  register: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      set({ token: data.token, user: data.user, isAuthenticated: true });
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
}));
