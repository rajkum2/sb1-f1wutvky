import { create } from 'zustand';
import { users, findUserById } from '../mockData/users';
import { User } from '../types/dataModel';

interface AuthState {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isUserRole: (role: User['role']) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  
  login: (userId: string) => {
    const user = findUserById(userId);
    if (user) {
      set({ currentUser: user });
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  },
  
  logout: () => {
    set({ currentUser: null });
  },
  
  isUserRole: (role: User['role']) => {
    const { currentUser } = get();
    return currentUser?.role === role;
  }
}));

// Demo function to switch user roles easily
export const switchUserRole = (role: User['role']) => {
  const roleUser = users.find(user => user.role === role);
  if (roleUser) {
    useAuthStore.getState().login(roleUser.id);
  } else {
    console.error(`No user with role ${role} found`);
  }
};