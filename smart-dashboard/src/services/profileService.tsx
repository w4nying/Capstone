import { getCurrentUser, updateCurrentUserInStorage } from '../providers/authProvider';

const API_URL = 'http://localhost:3000';

export const saveProfileAvatar = async (avatar: string) => {
  const user = getCurrentUser();
  if (!user) return;

  updateCurrentUserInStorage({ avatar });

  try {
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar }),
    });
  } catch (error) {
    console.error('Failed to save avatar:', error);
  }
};

export const removeProfileAvatar = async () => {
  const user = getCurrentUser();
  if (!user) return;

  updateCurrentUserInStorage({ avatar: '' });

  try {
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar: '' }),
    });
  } catch (error) {
    console.error('Failed to remove avatar:', error);
  }
};