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
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import {
  getCurrentTheme,
  getCurrentUser,
  ThemeMode,
  updateCurrentUserInStorage,
} from '../../providers/authProvider';
import { ProfileAvatarDialog } from './ProfileAvatarDialog';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

type CustomAppBarProps = {
  onThemeChange?: (mode: ThemeMode) => void;
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
  const { getSetting, getBooleanSetting } = useSystemSettings();

  const [mode, setMode] = useState<ThemeMode>('light');
  const [isSaving, setIsSaving] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());

  const menuOpen = Boolean(anchorEl);

  const applicationName = getSetting(
    'Application Name',
    'MAS LEAP UI Interactive Dashboard'
  );
  const personalizationEnabled = getBooleanSetting(
    'Personalization Enabled',
    true
  );
  const sessionTimeoutRaw = getSetting('Session Timeout', '30 minutes');
  const sessionTimeoutMinutes = Number.parseInt(sessionTimeoutRaw, 10) || 30;

  useSessionTimeout(true, sessionTimeoutMinutes, () => {
    logout();
  });

  useEffect(() => {
    setMode(getCurrentTheme());
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    document.title = applicationName;
  }, [applicationName]);

  useEffect(() => {
    const syncUser = () => {
      setMode(getCurrentTheme());
      setUser(getCurrentUser());
    };

    window.addEventListener('themeChanged', syncUser);
    window.addEventListener('dashboardLayoutChanged', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('themeChanged', syncUser);
      window.removeEventListener('dashboardLayoutChanged', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const toggleTheme = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser || isSaving) return;

    const previousMode = mode;
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';

    setMode(newMode);
    onThemeChange?.(newMode);
    updateCurrentUserInStorage({ theme: newMode });
    setUser(getCurrentUser());
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

      window.dispatchEvent(new Event('themeChanged'));
    } catch (error) {
      setMode(previousMode);
      onThemeChange?.(previousMode);
      updateCurrentUserInStorage({ theme: previousMode });
      setUser(getCurrentUser());
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

  const handleOpenAvatarDialog = () => {
    setAvatarDialogOpen(true);
  };

  const handleAvatarSaved = () => {
    setUser(getCurrentUser());
  };

  const handleThemeSwitch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    await toggleTheme();
  };

  const handleOpenManageWidgets = () => {
    handleMenuClose();
    window.dispatchEvent(new Event('open-dashboard-widget-settings'));
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <>
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={(theme) => ({
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
              display: { xs: 'none', sm: 'block' },
            })}
          >
            {applicationName}
          </Typography>
        </Box>

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
              src={user?.avatar || undefined}
              sx={(theme) => ({
                width: 34,
                height: 34,
                fontSize: '0.9rem',
                fontWeight: 700,
                bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
                color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
              })}
            >
              {!user?.avatar ? getInitials(user?.fullName, user?.username) : null}
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
                {user?.fullName || user?.username || 'User'}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={(theme) => ({
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                  textTransform: 'capitalize',
                })}
              >
                {user?.role || 'Account'}
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
              mt: 1.25,
              minWidth: 340,
              borderRadius: 3,
              border: `1px solid ${
                theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
              }`,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 24px 50px rgba(0, 0, 0, 0.35)'
                  : '0 24px 50px rgba(15, 23, 42, 0.10)',
              overflow: 'hidden',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, #111827 0%, #0f172a 100%)'
                  : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
            }),
          }}
        >
          <Box
            sx={(theme) => ({
              px: 2.5,
              py: 2.3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(30,41,59,0.2))'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(255,255,255,0.6))',
            })}
          >
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={user?.avatar || undefined}
                sx={(theme) => ({
                  width: 60,
                  height: 60,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
                  color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 10px 24px rgba(0,0,0,0.28)'
                      : '0 10px 24px rgba(15,23,42,0.08)',
                })}
              >
                {!user?.avatar ? getInitials(user?.fullName, user?.username) : null}
              </Avatar>

              <Tooltip title="Edit profile picture">
                <IconButton
                  size="small"
                  onClick={handleOpenAvatarDialog}
                  sx={(theme) => ({
                    position: 'absolute',
                    right: -4,
                    bottom: -4,
                    width: 24,
                    height: 24,
                    border: `1px solid ${
                      theme.palette.mode === 'dark' ? '#334155' : '#e5e7eb'
                    }`,
                    backgroundColor:
                      theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                    color: theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a',
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                    },
                  })}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body1"
                noWrap
                sx={{ fontWeight: 800, mb: 0.25 }}
              >
                {user?.fullName || user?.username || 'User'}
              </Typography>

              <Typography
                variant="body2"
                noWrap
                sx={(theme) => ({
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                  mb: 1,
                })}
              >
                {user?.email || ''}
              </Typography>

              <Chip
                label={user?.role || 'Account'}
                size="small"
                sx={(theme) => ({
                  height: 24,
                  textTransform: 'capitalize',
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(59,130,246,0.18)'
                      : 'rgba(59,130,246,0.10)',
                  color:
                    theme.palette.mode === 'dark' ? '#bfdbfe' : '#1d4ed8',
                })}
              />
            </Box>
          </Box>

          <Divider />

          <MenuItem
            disableRipple
            sx={(theme) => ({
              py: 1.4,
              px: 2.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2.5,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#172033' : '#f8fafc',
              },
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 30 }}>
                {mode === 'light' ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </ListItemIcon>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Dark mode
                </Typography>
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                  })}
                >
                  {mode === 'dark' ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Box>

            <Switch
              checked={mode === 'dark'}
              onChange={handleThemeSwitch}
              disabled={isSaving}
            />
          </MenuItem>

          {personalizationEnabled && (
            <>
              <Divider />
              <MenuItem
                onClick={handleOpenManageWidgets}
                sx={(theme) => ({
                  py: 1.4,
                  px: 2.2,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark' ? '#172033' : '#f8fafc',
                  },
                })}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: 'inherit',
                  }}
                >
                  <ViewQuiltIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Manage Widgets
                </Typography>
              </MenuItem>
            </>
          )}

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={(theme) => ({
              py: 1.4,
              px: 2.2,
              color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(239,68,68,0.14)'
                    : 'rgba(239,68,68,0.08)',
              },
            })}
          >
            <ListItemIcon
              sx={{
                minWidth: 34,
                color: 'inherit',
              }}
            >
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </AppBar>

      <ProfileAvatarDialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        onSaved={handleAvatarSaved}
      />
    </>
  );
};

type AppLayoutProps = LayoutProps & {
  onThemeChange?: (mode: ThemeMode) => void;
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

export default AppLayout;