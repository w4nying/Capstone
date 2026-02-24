import { defaultTheme } from 'react-admin';
import { createTheme, Theme } from '@mui/material/styles';

export const lightTheme: Theme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
  },
});

export const darkTheme: Theme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'dark',
  },
});