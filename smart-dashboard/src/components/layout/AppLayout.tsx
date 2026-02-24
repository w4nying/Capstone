import { Layout, LayoutProps, AppBar } from 'react-admin';
import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState, useEffect } from 'react';

const CustomAppBar = (props: any) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.theme) setMode(user.theme);
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newMode }),
    });

    localStorage.setItem('user', JSON.stringify({
      ...user,
      theme: newMode,
    }));

    window.location.reload();
  };

  return (
    <AppBar {...props}>
      <IconButton color="inherit" onClick={toggleTheme}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </AppBar>
  );
};

export const AppLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={CustomAppBar} />
);