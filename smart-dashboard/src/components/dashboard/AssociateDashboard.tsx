import {
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  Visibility,
  Description,
  CheckCircle,
  Warning,
  Article,
} from '@mui/icons-material';
import { DashboardCard } from './DashboardCard';
import { DashboardShell, type DashboardWidget } from './DashboardShell';

export const AssociateDashboard = () => {
  const { data: reports, isLoading: loadingReports } = useGetList('reports', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'date', order: 'DESC' },
    filter: { status: 'published' },
  });

  const { data: analytics, isLoading: loadingAnalytics } = useGetList('analytics');

  if (loadingReports || loadingAnalytics) return <LinearProgress />;

  const publishedReportsCount = reports ? reports.length : 0;
  const systemStatus = analytics
    ? (analytics.find((a: any) => a.name === 'System Uptime')?.value ?? 0)
    : 0;
  const activeMetrics = analytics
    ? analytics.filter((a: any) => a.status === 'active').length
    : 0;

  const reportsContent = (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Article color="primary" />
        <Typography variant="h6">Recent Technical Reports</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Latest published documentation available for review
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List>
        {reports?.map((report: any, index: number) => (
          <Box key={report.id}>
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemIcon>
                <Description color="action" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {report.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {new Date(report.date).toLocaleDateString()}
                    </Typography>
                    {' — ' + report.summary}
                  </>
                }
              />
              <Chip label={report.type} size="small" variant="outlined" />
            </ListItem>
            {index < reports.length - 1 && <Divider variant="inset" />}
          </Box>
        ))}
      </List>
    </Box>
  );

  const accessContent = (
    <Box
      sx={{
        height: '100%',
        p: 1,
        borderRadius: 2,
        bgcolor: '#fff3e0',
        border: '1px solid #ffb74d',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Access Limitations
      </Typography>
      <Typography variant="body2" paragraph>
        As a Technical Associate, you have access to:
      </Typography>
      <List dense>
        <ListItem disableGutters>
          <ListItemIcon>
            <CheckCircle fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText primary="View System Analytics" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <CheckCircle fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText primary="Read Published Reports" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <Warning fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText primary="No Edit/Delete Permissions" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <Warning fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText primary="No System Configuration" />
        </ListItem>
      </List>
    </Box>
  );

  const widgets: DashboardWidget[] = [
    {
      id: 'availableReports',
      title: 'Available Reports',
      content: (
        <DashboardCard
          title="Available Reports"
          value={publishedReportsCount.toString()}
          icon={<Description />}
          color="#7b1fa2"
          trend="Latest"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'availableReports', x: 0, y: 0, w: 4, h: 2 }],
        md: [{ i: 'availableReports', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'availableReports', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'availableReports', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'systemStatus',
      title: 'System Status',
      content: (
        <DashboardCard
          title="System Status"
          value={`${systemStatus}%`}
          icon={systemStatus > 98 ? <CheckCircle /> : <Warning />}
          color={systemStatus > 98 ? '#2e7d32' : '#ed6c02'}
          trend="Uptime"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'systemStatus', x: 4, y: 0, w: 4, h: 2 }],
        md: [{ i: 'systemStatus', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'systemStatus', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'systemStatus', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'activeMetrics',
      title: 'Active Metrics',
      content: (
        <DashboardCard
          title="Active Metrics"
          value={activeMetrics.toString()}
          icon={<Visibility />}
          color="#0288d1"
          trend="Monitoring"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'activeMetrics', x: 8, y: 0, w: 4, h: 2 }],
        md: [{ i: 'activeMetrics', x: 0, y: 2, w: 10, h: 2 }],
        sm: [{ i: 'activeMetrics', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'activeMetrics', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'recentReports',
      title: 'Recent Technical Reports',
      content: reportsContent,
      defaultLayout: {
        lg: [{ i: 'recentReports', x: 0, y: 2, w: 8, h: 5, minH: 4 }],
        md: [{ i: 'recentReports', x: 0, y: 4, w: 10, h: 5, minH: 4 }],
        sm: [{ i: 'recentReports', x: 0, y: 6, w: 6, h: 5, minH: 4 }],
        xs: [{ i: 'recentReports', x: 0, y: 6, w: 4, h: 5, minH: 4 }],
      },
    },
    {
      id: 'accessLimitations',
      title: 'Access Limitations',
      content: accessContent,
      defaultLayout: {
        lg: [{ i: 'accessLimitations', x: 8, y: 2, w: 4, h: 5, minH: 4 }],
        md: [{ i: 'accessLimitations', x: 0, y: 9, w: 10, h: 4, minH: 4 }],
        sm: [{ i: 'accessLimitations', x: 0, y: 11, w: 6, h: 4, minH: 4 }],
        xs: [{ i: 'accessLimitations', x: 0, y: 11, w: 4, h: 4, minH: 4 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Technical Associate Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip label="View Access Only" variant="outlined" icon={<Visibility />} />
      </Box>

      <DashboardShell dashboardKey="associate-dashboard" widgets={widgets} />
    </Box>
  );
};