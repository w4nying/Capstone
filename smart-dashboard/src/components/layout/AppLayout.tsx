import { useEffect, useState } from 'react';
import {
  AppBar,
  Layout,
  LayoutProps,
  TitlePortal,
  useLogout,
} from 'react-admin';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  getCurrentTheme,
  getCurrentUser,
  ThemeMode,
  updateCurrentUserInStorage,
} from '../../providers/authProvider';

type CustomAppBarProps = {
  onThemeChange: (mode: ThemeMode) => void;
} & Record<string, any>;

const getInitials = (name?: string, username?: string) => {
  const source = name?.trim() || username?.trim() || 'U';
  const parts = source.split(' ').filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

const CustomAppBar = ({ onThemeChange, ...props }: CustomAppBarProps) => {
  const logout = useLogout();
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isSaving, setIsSaving] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = getCurrentUser();
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    setMode(getCurrentTheme());
  }, []);

  const toggleTheme = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser || isSaving) return;

    const previousMode = mode;
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';

    setMode(newMode);
    onThemeChange(newMode);
    updateCurrentUserInStorage({ theme: newMode });
    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleTheme = async () => {
    handleMenuClose();
    await toggleTheme();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      {...props}
      toolbar={false}
      userMenu={false}
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

      <Tooltip title="Account">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{
            borderRadius: '999px',
            px: 0.75,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: '0.9rem',
              fontWeight: 700,
              bgcolor: '#e2e8f0',
              color: '#0f172a',
            }}
          >
            {getInitials(user?.fullName, user?.username)}
          </Avatar>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1.1,
              mr: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#0f172a' }}
            >
              {user?.fullName || user?.username || 'User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#64748b' }}
            >
              {user?.role || 'Account'}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon
            sx={{
              color: '#64748b',
              display: { xs: 'none', sm: 'block' },
            }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {user?.fullName || user?.username || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {user?.role || 'Account'}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleToggleTheme} disabled={isSaving}>
          <ListItemIcon>
            {mode === 'light' ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          {mode === 'light' ? 'Dark mode' : 'Light mode'}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
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
        backgroundColor: 'background.default',
        width: '100%',
      },
      '& .RaLayout-content': {
        backgroundColor: 'background.default',
        width: '100%',
        overflowX: 'hidden',
      },
      '& .RaLayout-main': {
        backgroundColor: 'background.default',
        width: '100%',
        overflowX: 'hidden',
      },
      '& .RaLayout-contentWithSidebar': {
        paddingTop: { xs: '64px', md: '72px' },
      },
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