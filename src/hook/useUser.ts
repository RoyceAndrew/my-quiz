
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  createdAt: string;
  rule: boolean;
  quiz: {
    answered: number;
    correct: number;
    score: number;
    time: number;
    wrong: number;
    total: number;
  };
}

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateUser: <K extends keyof User>(key: K, value: User[K]) => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      
      setUser: (user: User) => set({ user }),
      
      setRule: (rule: boolean) => set((state) => ({
        user: state.user ? { ...state.user, rule } : null
      })),
      
      updateUser: (key, value) => set((state) => ({
        user: state.user ? { ...state.user, [key]: value } : null
      })),
      
      logout: () => set({ user: null })
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useUser
