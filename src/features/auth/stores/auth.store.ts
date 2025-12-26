import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Me } from '@/types';

type AuthState = {
  token?: string;
  user?: Me;
  setSession: (token: string, user: Me) => void;
  updateUser: (user: Partial<Me>) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setSession: (token, user) => {
        localStorage.setItem('auth-token', token);
        set({ token, user });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : undefined,
        })),
      clear: () => {
        localStorage.removeItem('auth-token');
        set({ token: undefined, user: undefined });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

// Helpers para uso fora de componentes
export const getToken = () => useAuthStore.getState().token;
export const getUser = () => useAuthStore.getState().user;
export const clearSession = () => useAuthStore.getState().clear();
