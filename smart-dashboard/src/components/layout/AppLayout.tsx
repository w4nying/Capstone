import { useEffect, useState } from 'react';
import {
  AppBar,
  Layout,
  LayoutProps,
  TitlePortal,
  useLogout,
} from 'react-admin';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  getCurrentTheme,
  getCurrentUser,
  ThemeMode,
  updateCurrentUserInStorage,
} from '../../providers/authProvider';

type CustomAppBarProps = {
  onThemeChange: (mode: ThemeMode) => void;
} & Record<string, unknown>;

const CustomAppBar = ({ onThemeChange, ...props }: CustomAppBarProps) => {
  const logout = useLogout();
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMode(getCurrentTheme());
  }, []);

  const toggleTheme = async () => {
    const user = getCurrentUser();
    if (!user || isSaving) return;

    const previousMode = mode;
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';

    setMode(newMode);
    onThemeChange(newMode);
    updateCurrentUserInStorage({ theme: newMode });
    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newMode }),
      });

      if (!response.ok) {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      setMode(previousMode);
      onThemeChange(previousMode);
      updateCurrentUserInStorage({ theme: previousMode });
      console.error('Unable to save theme preference:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppBar {...props}>
      <TitlePortal />
      <Box sx={{ flex: 1 }} />

      <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
        <IconButton color="inherit" onClick={toggleTheme} disabled={isSaving}>
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>

      <Button
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={() => logout()}
        sx={{ ml: 1, textTransform: 'none' }}
      >
        Logout
      </Button>
    </AppBar>
  );
};

type AppLayoutProps = LayoutProps & {
  onThemeChange: (mode: ThemeMode) => void;
};

export const AppLayout = ({ onThemeChange, ...props }: AppLayoutProps) => (
  <Layout
    {...props}
    appBar={(appBarProps) => (
      <CustomAppBar {...appBarProps} onThemeChange={onThemeChange} />
    )}
  />
);