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
          minHeight: { xs: 60, md: 72 },
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
          sx={(theme) => ({
            borderRadius: '999px',
            px: { xs: 0.5, sm: 0.75 },
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: `1px solid ${
              theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
            }`,
            backgroundColor:
              theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
            },
          })}
        >
          <Avatar
            sx={(theme) => ({
              width: 34,
              height: 34,
              fontSize: '0.9rem',
              fontWeight: 700,
              bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
              color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
            })}
          >
            {getInitials((user as any)?.fullName, (user as any)?.username)}
          </Avatar>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1.1,
              mr: 0.25,
              maxWidth: 140,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={(theme) => ({
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
              })}
            >
              {(user as any)?.fullName || (user as any)?.username || 'User'}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={(theme) => ({
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
              })}
            >
              {(user as any)?.role || 'Account'}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
              display: { xs: 'none', sm: 'block' },
            })}
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
          sx: (theme) => ({
            mt: 1,
            minWidth: 220,
            borderRadius: 3,
            border: `1px solid ${
              theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
            }`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(0, 0, 0, 0.35)'
                : '0 18px 40px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
          }),
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="body2"
            sx={(theme) => ({
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
            })}
          >
            {(user as any)?.fullName || (user as any)?.username || 'User'}
          </Typography>
          <Typography
            variant="caption"
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
            })}
          >
            {(user as any)?.role || 'Account'}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleToggleTheme} disabled={isSaving}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
            {mode === 'light' ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          {mode === 'light' ? 'Dark mode' : 'Light mode'}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
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
        minWidth: 0,
      },
      '& .RaLayout-content': {
        backgroundColor: 'background.default',
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
      },
      '& .RaLayout-main': {
        backgroundColor: 'background.default',
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
      },
      '& .RaLayout-contentWithSidebar': {
        paddingTop: { xs: '60px', md: '72px' },
        width: '100%',
        minWidth: 0,
      },
      '& .RaLayout-content > div': {
        padding: { xs: 1.25, sm: 2, md: 3 },
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      },

      '& .RaSidebar-root': {
        borderRight: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      },

      '& .RaSidebar-fixed': {
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
      },

      '& .RaMenu-root': {
        paddingTop: 0.5,
        paddingBottom: 0.5,
      },

      '& .RaMenuItemLink-root': {
        margin: { xs: '4px 8px', sm: '6px 10px' },
        padding: { xs: '10px 12px', sm: '10px 14px' },
        minHeight: 44,
        borderRadius: '12px',
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#e5e7eb' : '#0f172a',
        display: 'flex',
        alignItems: 'center',
        width: 'auto',
        minWidth: 0,
        transition: 'background-color 0.2s ease, color 0.2s ease',
      },

      '& .RaMenuItemLink-root .RaMenuItemLink-icon': {
        minWidth: 36,
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
        flexShrink: 0,
      },

      '& .RaMenuItemLink-root .RaMenuItemLink-text': {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      '& .RaMenuItemLink-root:hover': {
        backgroundColor: 'action.hover',
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
      },

      '& .RaMenuItemLink-root:hover .RaMenuItemLink-icon': {
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
      },

      '& .RaMenuItemLink-active': {
        backgroundColor: 'action.selected',
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
        fontWeight: 700,
      },

      '& .RaMenuItemLink-active .RaMenuItemLink-icon': {
        color: (theme) =>
          theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
      },

      '@media (max-width:600px)': {
        '& .RaLayout-contentWithSidebar': {
          paddingTop: '60px',
        },
        '& .RaMenuItemLink-root': {
          margin: '4px 8px',
          padding: '10px 12px',
        },
      },
    }}
  />
);