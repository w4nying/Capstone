import { getCurrentUser, updateCurrentUserInStorage } from '../providers/authProvider';
import type { DashboardBreakpointLayouts } from '../types/dashboard';

const API_URL = 'http://localhost:3000';

export const getSavedDashboardLayouts = (
  dashboardKey: string
): DashboardBreakpointLayouts | undefined => {
  const user = getCurrentUser();
  return user?.dashboardLayouts?.[dashboardKey];
};

export const saveDashboardLayouts = async (
    dashboardKey: string,
    layouts: DashboardBreakpointLayouts
    ): Promise<void> => {
    const user = getCurrentUser();
    if (!user) return;

    const nextDashboardLayouts: Record<string, DashboardBreakpointLayouts> = {
    ...(user.dashboardLayouts ?? {}),
    [dashboardKey]: layouts,
    };

    updateCurrentUserInStorage({
    dashboardLayouts: nextDashboardLayouts,
    });

    await fetch(`${API_URL}/users/${user.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        dashboardLayouts: nextDashboardLayouts,
    }),
    });
};

export const resetDashboardLayouts = async (dashboardKey: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) return;

  const nextDashboardLayouts: Record<string, DashboardBreakpointLayouts> = {
    ...(user.dashboardLayouts ?? {}),
  };

  delete nextDashboardLayouts[dashboardKey];

  updateCurrentUserInStorage({
    dashboardLayouts: nextDashboardLayouts,
  });

  try {
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dashboardLayouts: nextDashboardLayouts,
      }),
    });
  } catch (error) {
    console.error('Failed to reset dashboard layout:', error);
  }
};