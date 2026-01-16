import { AuthProvider } from 'react-admin';

export type UserRole = 'admin' | 'officer' | 'associate';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  department?: string;
  avatar?: string;
}

const users: Record<string, { password: string; user: User }> = {
  'admin@mas.gov.sg': {
    password: 'admin123',
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@mas.gov.sg',
      role: 'admin',
      fullName: 'System Administrator',
      department: 'IT & Systems',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  'officer@mas.gov.sg': {
    password: 'officer123',
    user: {
      id: 2,
      username: 'tofficer',
      email: 'officer@mas.gov.sg',
      role: 'officer',
      fullName: 'Technical Officer',
      department: 'Data & Technology',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  },
  'associate@mas.gov.sg': {
    password: 'associate123',
    user: {
      id: 3,
      username: 'associate',
      email: 'associate@mas.gov.sg',
      role: 'associate',
      fullName: 'Technical Associate',
      department: 'Data & Technology',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  }
};

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const userRecord = users[username];
    if (!userRecord || userRecord.password !== password) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem('auth', JSON.stringify(userRecord.user));
    localStorage.setItem('role', userRecord.user.role);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('role');
    return Promise.resolve();
  },
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      localStorage.removeItem('role');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    const auth = localStorage.getItem('auth');
    return auth ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => {
    const role = localStorage.getItem('role');
    return role ? Promise.resolve(role) : Promise.reject();
  },
  getIdentity: () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) return Promise.reject();
      const user: User = JSON.parse(auth);
      return Promise.resolve({
        id: user.id,
        fullName: user.fullName,
        avatar: user.avatar,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export const getCurrentUser = (): User | null => {
  try {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    return JSON.parse(auth);
  } catch {
    return null;
  }
};