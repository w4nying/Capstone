import { defaultTheme } from 'react-admin';
import { createTheme, Theme } from '@mui/material/styles';

const lightShadows = [
  'none',
  '0 1px 2px rgba(15, 23, 42, 0.04)',
  '0 4px 10px rgba(15, 23, 42, 0.05)',
  '0 8px 20px rgba(15, 23, 42, 0.06)',
  '0 12px 24px rgba(15, 23, 42, 0.07)',
  '0 16px 30px rgba(15, 23, 42, 0.08)',
  ...Array(19).fill('0 18px 40px rgba(15, 23, 42, 0.08)'),
] as Theme['shadows'];

const darkShadows = [
  'none',
  '0 1px 2px rgba(0, 0, 0, 0.30)',
  '0 4px 10px rgba(0, 0, 0, 0.34)',
  '0 8px 20px rgba(0, 0, 0, 0.38)',
  '0 12px 24px rgba(0, 0, 0, 0.42)',
  '0 16px 30px rgba(0, 0, 0, 0.46)',
  ...Array(19).fill('0 18px 40px rgba(0, 0, 0, 0.50)'),
] as Theme['shadows'];

export const lightTheme: Theme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#64748B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
    },
  },
  shape: {
    borderRadius: 18,
  },
  shadows: lightShadows,
  typography: {
    fontFamily: [
      'Inter',
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
      color: '#111827',
    },
    h5: {
      fontWeight: 800,
      color: '#111827',
    },
    h6: {
      fontWeight: 700,
      color: '#111827',
      marginBottom: '12px',
    },
    subtitle1: {
      fontWeight: 600,
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
          backgroundColor: '#F5F7FB',
          color: '#111827',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#F5F7FB',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.88)',
          color: '#111827',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 0 rgba(229, 231, 235, 0.9)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
          borderRight: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          color: '#111827',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
          padding: '20px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.10)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18,
        },
        containedPrimary: {
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          boxShadow: 'none',
        },
        outlined: {
          borderColor: '#D1D5DB',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
        filled: {
          backgroundColor: '#EEF2FF',
          color: '#4338CA',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#FFFFFF',
          color: '#111827',
        },
        input: {
          color: '#111827',
        },
        notchedOutline: {
          borderColor: '#D1D5DB',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6B7280',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#6B7280',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E5E7EB',
          color: '#111827',
        },
        head: {
          backgroundColor: '#F8FAFC',
          color: '#475569',
          fontWeight: 700,
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
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
        h6: {
          marginBottom: '12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#64748B',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#111827',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64748B',
          minWidth: 36,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E5E7EB',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#111827',
          color: '#FFFFFF',
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
      main: '#5B8DEF',
      light: '#7AA4F5',
      dark: '#3B73E0',
      contrastText: '#F8FAFC',
    },
    secondary: {
      main: '#A8B3C7',
      contrastText: '#F8FAFC',
    },
    background: {
      default: '#07111F',
      paper: '#162235',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#B6C2D2',
    },
    divider: '#314055',
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#38BDF8',
    },
    action: {
      hover: 'rgba(168, 179, 199, 0.10)',
      selected: 'rgba(91, 141, 239, 0.16)',
      disabledBackground: 'rgba(148, 163, 184, 0.12)',
    },
  },
  shape: {
    borderRadius: 18,
  },
  shadows: darkShadows,
  typography: {
    fontFamily: [
      'Inter',
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
      color: '#F8FAFC',
    },
    h5: {
      fontWeight: 800,
      color: '#F8FAFC',
    },
    h6: {
      fontWeight: 700,
      color: '#F8FAFC',
      marginBottom: '12px',
    },
    subtitle1: {
      fontWeight: 600,
      color: '#E2E8F0',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      color: 'inherit',
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
          backgroundColor: '#07111F',
          color: '#F8FAFC',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#07111F',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 24, 43, 0.92)',
          color: '#F8FAFC',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 0 rgba(49, 64, 85, 0.95)',
          borderBottom: '1px solid #314055',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B182B',
          color: '#F8FAFC',
          borderRight: '1px solid #314055',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#162235',
          color: '#F8FAFC',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid #314055',
          backgroundColor: '#162235',
          color: '#F8FAFC',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.42)',
          padding: '20px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 22px 44px rgba(0, 0, 0, 0.50)',
            borderColor: '#415471',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18,
        },
        containedPrimary: {
          backgroundColor: '#5B8DEF',
          color: '#F8FAFC',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#4E83EA',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#415471',
          color: '#F8FAFC',
        },
        text: {
          color: '#E2E8F0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
        filled: {
          backgroundColor: '#223149',
          color: '#E8EEF7',
        },
        outlined: {
          borderColor: '#415471',
          color: '#E8EEF7',
        },
        icon: {
          color: 'inherit',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#0D1A2D',
          color: '#F8FAFC',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5E7695',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5B8DEF',
          },
        },
        input: {
          color: '#F8FAFC',
        },
        notchedOutline: {
          borderColor: '#415471',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B6C2D2',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#B6C2D2',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid #314055',
          backgroundColor: '#162235',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#314055',
          color: '#F8FAFC',
        },
        head: {
          backgroundColor: '#0D1A2D',
          color: '#D4DEEA',
          fontWeight: 700,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
          color: '#F8FAFC',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
        h6: {
          marginBottom: '12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#B6C2D2',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          backgroundColor: '#162235',
          color: '#F8FAFC',
          border: '1px solid #314055',
          boxShadow: '0 18px 36px rgba(0, 0, 0, 0.42)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#F8FAFC',
          '&:hover': {
            backgroundColor: '#1D2C43',
          },
          '&.Mui-selected': {
            backgroundColor: '#223149',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#B6C2D2',
          minWidth: 36,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#314055',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#D4DEEA',
          '&.Mui-checked': {
            color: '#5B8DEF',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#3B73E0',
            opacity: 1,
          },
        },
        track: {
          backgroundColor: '#415471',
          opacity: 1,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#E5E7EB',
          color: '#111827',
        },
      },
    },
  },
});