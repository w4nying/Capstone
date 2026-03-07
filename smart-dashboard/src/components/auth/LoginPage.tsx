import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  LockOutlined,
  InsightsOutlined,
  TuneOutlined,
  SpeedOutlined,
} from '@mui/icons-material';
import './LoginPage.css';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ username, password });
    } catch (error) {
      notify('Invalid credentials. Please try again.', { type: 'error' });
      setLoading(false);
    }
  };

  const quickLogin = (email: string, pwd: string) => {
    setUsername(email);
    setPassword(pwd);
  };

  const features = [
    {
      icon: <InsightsOutlined fontSize="small" />,
      title: 'Interactive Visualizations',
      desc: 'Explore charts, tables, drill-down views, and role-based insights.',
    },
    {
      icon: <TuneOutlined fontSize="small" />,
      title: 'Personalized Dashboard',
      desc: 'User preferences and layouts adapt to different organizational roles.',
    },
    {
      icon: <SpeedOutlined fontSize="small" />,
      title: 'Scalable Performance',
      desc: 'Designed to support large datasets with responsive loading and rendering.',
    },
  ];

  const demoAccounts = [
    {
      label: 'System Administrator',
      email: 'admin@mas.gov.sg',
      password: 'admin123',
    },
    {
      label: 'Technical Officer',
      email: 'officer@mas.gov.sg',
      password: 'officer123',
    },
    {
      label: 'Technical Associate',
      email: 'associate@mas.gov.sg',
      password: 'associate123',
    },
  ];

  return (
    <Box className="login-page">
      <Box className="login-page__container">
        <Box className="login-page__left">
          <Chip label="Capstone Project" className="login-page__chip" />

          <Typography className="login-page__project-title">
            Smart Interactive Dashboard Development
          </Typography>

          <Typography className="login-page__project-subtitle">
            A modern enterprise dashboard focused on interactive data visualization,
            personalization, and scalable performance.
          </Typography>

          <Box className="login-page__feature-list">
            {features.map((item) => (
              <Paper key={item.title} elevation={0} className="login-page__feature-card">
                <Box className="login-page__feature-icon">{item.icon}</Box>
                <Box>
                  <Typography className="login-page__feature-title">
                    {item.title}
                  </Typography>
                  <Typography className="login-page__feature-desc">
                    {item.desc}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          <Box className="login-page__project-meta">
            <Typography className="login-page__meta-text">
              Built with React Admin / MAS's LEAP UI
            </Typography>
          </Box>
        </Box>

        <Box className="login-page__right">
          <Card className="login-page__card">
            <CardContent className="login-page__card-content">
              <Box className="login-page__header">
                <Avatar className="login-page__avatar">
                  <LockOutlined />
                </Avatar>

                <Typography component="h1" className="login-page__title">
                  Sign in
                </Typography>

                <Typography className="login-page__subtitle">
                  Access your dashboard workspace and saved preferences.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} className="login-page__form">
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Email Address"
                  name="username"
                  autoComplete="email"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  placeholder="user@mas.gov.sg"
                />

                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="login-page__submit"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </Box>

              <Divider className="login-page__divider">
                <Chip label="Demo Accounts" size="small" />
              </Divider>

              <Box className="login-page__demo-list">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    size="small"
                    variant="outlined"
                    onClick={() => quickLogin(account.email, account.password)}
                    className="login-page__demo-button"
                  >
                    <Box className="login-page__demo-text">
                      <Typography className="login-page__demo-title">
                        {account.label}
                      </Typography>
                      <Typography className="login-page__demo-subtitle">
                        {account.email} / {account.password}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>

              <Typography className="login-page__footer">
                CSC3101 Capstone Project · Huang Wan Ying
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};