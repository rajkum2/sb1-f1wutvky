import { User } from '../types/dataModel';

export const users: User[] = [
  {
    id: 'PM001',
    role: 'Project Manager',
    email: 'pm@example.com',
    name: 'Alex Johnson'
  },
  {
    id: 'BA001',
    role: 'BA',
    email: 'ba1@example.com',
    name: 'Taylor Smith'
  },
  {
    id: 'BA002',
    role: 'BA',
    email: 'ba2@example.com',
    name: 'Jamie Williams'
  },
  {
    id: 'DEV001',
    role: 'Developer',
    email: 'dev1@example.com',
    name: 'Riley Chen'
  },
  {
    id: 'DEV002',
    role: 'Developer',
    email: 'dev2@example.com',
    name: 'Jordan Patel'
  },
  {
    id: 'STAKE001',
    role: 'Stakeholder',
    email: 'stake1@example.com',
    name: 'Casey Lopez'
  }
];

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const findUsersByRole = (role: User['role']): User[] => {
  return users.filter(user => user.role === role);
};