import { Card, CardContent, Box, Typography, Chip, Alert } from '@mui/material';
import { Title } from 'react-admin';
import { Visibility, Assessment, Description, DataUsage } from '@mui/icons-material';

export const AssociateDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title title="Technical Associate Dashboard" />
        <Chip 
          label="Technical Associate - View Access" 
          sx={{ bgcolor: '#e0e0e0', color: '#424242', fontWeight: 600 }}
          icon={<Visibility />} 
        />
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          Welcome, Technical Associate
        </Typography>
        <Typography variant="body2">
          You have read-only access to system analytics and reports. For data modification requests, please contact your Technical Officer or System Administrator.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Authorized Access Levels
          </Typography>
          <Typography variant="body2" paragraph color="text.secondary">
            Your account has been granted view-only permissions for the following resources:
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 3,
            mt: 3 
          }}>
            <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 56, color: '#1e3c72', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} color="#1e3c72">
                Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                View real-time system metrics and performance indicators
              </Typography>
              <Chip label="Read Only" size="small" sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ p: 3, bgcolor: '#f3e5f5', borderRadius: 2, textAlign: 'center' }}>
              <Description sx={{ fontSize: 56, color: '#7b1fa2', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} color="#7b1fa2">
                Reports Library
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Access published technical reports and documentation
              </Typography>
              <Chip label="Read Only" size="small" sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
              <DataUsage sx={{ fontSize: 56, color: '#2e7d32', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} color="#2e7d32">
                Data Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Review data processing results and analytics outputs
              </Typography>
              <Chip label="Read Only" size="small" sx={{ mt: 2 }} />
            </Box>
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ffb74d' }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              ⚠️ Access Restrictions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • You cannot create, modify, or delete any records<br />
              • Data export functions are disabled for your role<br />
              • System configuration settings are not accessible<br />
              • For elevated access, submit a request through IT Service Desk
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};