import { defaultTheme } from 'react-admin';
import { createTheme, Theme } from '@mui/material/styles';

const baseShadows = [
  'none',
  '0 1px 2px rgba(15, 23, 42, 0.04)',
  '0 4px 10px rgba(15, 23, 42, 0.05)',
  '0 8px 20px rgba(15, 23, 42, 0.06)',
  '0 12px 24px rgba(15, 23, 42, 0.07)',
  '0 16px 30px rgba(15, 23, 42, 0.08)',
  ...Array(19).fill('0 18px 40px rgba(15, 23, 42, 0.08)'),
] as Theme['shadows'];

export const lightTheme: Theme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#111827',
      light: '#1f2937',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#334155',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e5e7eb',
    action: {
      hover: '#f1f5f9',
      selected: '#e2e8f0',
    },
    success: {
      main: '#15803d',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
    info: {
      main: '#2563eb',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: baseShadows,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      color: '#0f172a',
    },
    h5: {
      fontWeight: 800,
      color: '#0f172a',
    },
    h6: {
      fontWeight: 700,
      color: '#0f172a',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: '100%',
          minHeight: '100%',
        },
        body: {
          width: '100%',
          minHeight: '100%',
          margin: 0,
          backgroundColor: '#f8fafc',
          color: '#0f172a',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.92)',
          color: '#0f172a',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 0 rgba(229, 231, 235, 0.9)',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          color: '#0f172a',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#111827',
          color: '#ffffff',
          boxShadow: 'none',
        },
        outlined: {
          borderColor: '#d1d5db',
        },
        root: {
          borderRadius: 14,
          paddingInline: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
        filled: {
          backgroundColor: '#eef2f7',
          color: '#334155',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#e5e7eb',
      contrastText: '#111827',
    },
    secondary: {
      main: '#cbd5e1',
      contrastText: '#111827',
    },
    background: {
      default: '#0f172a',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#334155',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.14)',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#60a5fa',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: baseShadows,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      color: '#0f172a',
    },
    h5: {
      fontWeight: 800,
      color: '#0f172a',
    },
    h6: {
      fontWeight: 700,
      color: '#0f172a',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: '100%',
          minHeight: '100%',
        },
        body: {
          width: '100%',
          minHeight: '100%',
          margin: 0,
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#0f172a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#111827',
          color: '#e5e7eb',
          borderBottom: '1px solid #1f2937',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          color: '#e5e7eb',
          borderRight: '1px solid #1f2937',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e5e7eb',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#111827',
          color: '#ffffff',
          boxShadow: 'none',
        },
        outlined: {
          borderColor: '#334155',
        },
        root: {
          borderRadius: 14,
          paddingInline: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
        filled: {
          backgroundColor: '#eef2f7',
          color: '#334155',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#ffffff',
          color: '#0f172a',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },
  },
});