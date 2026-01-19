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
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ minWidth: 400, maxWidth: 500, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: '#1e3c72', width: 56, height: 56 }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={700}>
              MAS Dashboard System
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Monetary Authority of Singapore
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
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
              margin="normal"
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
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                bgcolor: '#1e3c72',
                '&:hover': { bgcolor: '#2a5298' }
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Chip label="Demo Accounts" size="small" />
          </Divider>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Test Accounts Available:
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => quickLogin('admin@mas.gov.sg', 'admin123')}
              sx={{ 
                justifyContent: 'flex-start', 
                textTransform: 'none',
                borderColor: '#1e3c72',
                color: '#1e3c72',
              }}
            >
              <Box sx={{ textAlign: 'left', width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  🛡️ System Administrator
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@mas.gov.sg / admin123
                </Typography>
              </Box>
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => quickLogin('officer@mas.gov.sg', 'officer123')}
              sx={{ 
                justifyContent: 'flex-start', 
                textTransform: 'none',
                borderColor: '#1e3c72',
                color: '#1e3c72',
              }}
            >
              <Box sx={{ textAlign: 'left', width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  💼 Technical Officer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  officer@mas.gov.sg / officer123
                </Typography>
              </Box>
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => quickLogin('associate@mas.gov.sg', 'associate123')}
              sx={{ 
                justifyContent: 'flex-start', 
                textTransform: 'none',
                borderColor: '#1e3c72',
                color: '#1e3c72',
              }}
            >
              <Box sx={{ textAlign: 'left', width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  📊 Technical Associate
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  associate@mas.gov.sg / associate123
                </Typography>
              </Box>
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 3, textAlign: 'center' }}
          >
            © 2025 Monetary Authority of Singapore (MAS) 
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};