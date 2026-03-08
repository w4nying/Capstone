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
} & Record<string, any>;

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
        headers: { 'Content-Type': 'application/json' },
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
    <AppBar
      {...props}
      toolbar={false}
      sx={{
        '& .RaAppBar-toolbar': {
          minHeight: { xs: 64, md: 72 },
          px: { xs: 1.5, sm: 2, md: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        },
      }}
    >
      <TitlePortal />
      <Box sx={{ flex: 1 }} />

      <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>

      <Button
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={() => logout()}
        sx={{
          ml: 0.5,
          borderRadius: '14px',
          px: { xs: 1, sm: 1.5 },
          minWidth: 'auto',
          whiteSpace: 'nowrap',
        }}
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
    sx={{
      '& .RaLayout-appFrame': {
        backgroundColor: '#f8fafc',
        width: '100%',
      },
      '& .RaLayout-content': {
        backgroundColor: '#f8fafc',
        width: '100%',
        overflowX: 'hidden',
      },
      '& .RaLayout-main': {
        backgroundColor: '#f8fafc',
        width: '100%',
        overflowX: 'hidden',
      },

      /* fixes navbar covering content */
      '& .RaLayout-contentWithSidebar': {
        paddingTop: { xs: '64px', md: '72px' },
      },

      /* page spacing */
      '& .RaLayout-content > div': {
        padding: { xs: 2, sm: 2.5, md: 3 },
      },

      '& .RaSidebar-root': {
        borderRight: '1px solid #e5e7eb',
      },
      '& .RaMenuItemLink-root': {
        borderRadius: '14px',
        margin: '4px 8px',
      },
      '& .RaMenuItemLink-active': {
        backgroundColor: '#eef2f7',
        color: '#111827',
        fontWeight: 700,
      },
    }}
  />
);