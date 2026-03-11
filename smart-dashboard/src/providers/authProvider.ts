import { AuthProvider } from 'react-admin';
import type { DashboardBreakpointLayouts } from '../types/dashboard';

export type UserRole = 'admin' | 'officer' | 'associate';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  department?: string;
  avatar?: string;
  theme?: ThemeMode;
  dashboardLayouts?: Record<string, DashboardBreakpointLayouts>;
}

type LoginInput = {
  username: string;
  password: string;
};

const API_URL = 'http://localhost:3000';

const credentials: Record<string, { password: string }> = {
  'admin@mas.gov.sg': { password: 'admin123' },
  'officer@mas.gov.sg': { password: 'officer123' },
  'associate@mas.gov.sg': { password: 'associate123' },
};

const fallbackUsers: Record<string, User> = {
  'admin@mas.gov.sg': {
    id: 1,
    username: 'admin',
    email: 'admin@mas.gov.sg',
    role: 'admin',
    fullName: 'System Administrator',
    department: 'IT & Systems',
    avatar: 'https://i.pravatar.cc/150?img=1',
    theme: 'light',
    dashboardLayouts: {},
  },
  'officer@mas.gov.sg': {
    id: 2,
    username: 'officer',
    email: 'officer@mas.gov.sg',
    role: 'officer',
    fullName: 'Technical Officer',
    department: 'Data & Technology',
    avatar: 'https://i.pravatar.cc/150?img=2',
    theme: 'light',
    dashboardLayouts: {},
  },
  'associate@mas.gov.sg': {
    id: 3,
    username: 'associate',
    email: 'associate@mas.gov.sg',
    role: 'associate',
    fullName: 'Technical Associate',
    department: 'Data & Technology',
    avatar: 'https://i.pravatar.cc/150?img=3',
    theme: 'light',
    dashboardLayouts: {},
  },
};

const normalizeTheme = (value: unknown): ThemeMode =>
  value === 'dark' ? 'dark' : 'light';

const emitThemeChanged = () => {
  window.dispatchEvent(new Event('themeChanged'));
};

const emitDashboardLayoutChanged = () => {
  window.dispatchEvent(new Event('dashboardLayoutChanged'));
};

const fetchUserFromServer = async (email: string): Promise<Partial<User> | null> => {
  try {
    const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;

    const users = await response.json();
    if (!Array.isArray(users) || users.length === 0) return null;

    return users[0];
  } catch {
    return null;
  }
};

export const authProvider: AuthProvider = {
  login: async ({ username, password }: LoginInput) => {
    const credential = credentials[username];
    if (!credential || credential.password !== password) {
      throw new Error('Invalid credentials');
    }

    const fallbackUser = fallbackUsers[username];
    const serverUser = await fetchUserFromServer(username);

    const loggedInUser: User = {
      ...fallbackUser,
      ...serverUser,
      email: username,
      theme: normalizeTheme(serverUser?.theme ?? fallbackUser.theme),
      dashboardLayouts: serverUser?.dashboardLayouts ?? fallbackUser.dashboardLayouts ?? {},
    };

    localStorage.setItem('auth', JSON.stringify(loggedInUser));
    localStorage.setItem('role', loggedInUser.role);
    emitThemeChanged();

    return '/';
  },

  logout: async () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('role');
    emitThemeChanged();
    return '/login';
  },

  checkAuth: async () => {
    if (!localStorage.getItem('auth')) {
      const error: any = new Error();
      error.message = false;
      throw error;
    }
  },

  checkError: async ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      localStorage.removeItem('role');
      emitThemeChanged();
      const error: any = new Error();
      error.message = false;
      throw error;
    }
  },

  getPermissions: async () => {
    const role = localStorage.getItem('role');
    if (!role) throw new Error();
    return role;
  },

  getIdentity: async () => {
    const auth = localStorage.getItem('auth');
    if (!auth) throw new Error();

    const user: User = JSON.parse(auth);
    return {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar,
    };
  },
};

export const getCurrentUser = (): User | null => {
  try {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    return JSON.parse(auth) as User;
  } catch {
    return null;
  }
};

export const getCurrentTheme = (): ThemeMode => {
  const user = getCurrentUser();
  if (!user) return 'light';
  return normalizeTheme(user.theme);
};

export const updateCurrentUserInStorage = (updatedFields: Partial<User>) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const updatedUser: User = {
    ...currentUser,
    ...updatedFields,
    theme: normalizeTheme(updatedFields.theme ?? currentUser.theme),
    dashboardLayouts: {
      ...(currentUser.dashboardLayouts ?? {}),
      ...(updatedFields.dashboardLayouts ?? {}),
    },
  };

  localStorage.setItem('auth', JSON.stringify(updatedUser));
  emitThemeChanged();
  emitDashboardLayoutChanged();
};