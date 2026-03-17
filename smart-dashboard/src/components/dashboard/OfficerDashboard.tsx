import { Box, Chip, Divider, LinearProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  Assessment,
  Description,
  Memory,
  Router,
  Storage,
  WarningAmber,
} from '@mui/icons-material';

import { DashboardCard } from './DashboardCard';
import { BarChartWidget } from '../charts/BarChartWidget';
import { DashboardShell, type DashboardWidget } from './DashboardShell';

const Panel = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      height: '100%',
      p: 2.5,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
      overflow: 'hidden',
    }}
  >
    <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>
    )}
    {children}
  </Box>
);

export const OfficerDashboard = () => {
  const { data: servers, isLoading: serversLoading } = useGetList('servers');
  const { data: reports, isLoading: reportsLoading } = useGetList('reports', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'date', order: 'DESC' },
  });
  const { data: analytics, isLoading: analyticsLoading } = useGetList('analytics');

  if (serversLoading || reportsLoading || analyticsLoading) {
    return <LinearProgress />;
  }

  const serverList = servers ?? [];
  const reportList = reports ?? [];
  const analyticsList = analytics ?? [];

  const totalServers = serverList.length;
  const onlineServers = serverList.filter((s: any) => s.status === 'online').length;
  const offlineServers = totalServers - onlineServers;
  const highCpuServers = serverList.filter((s: any) => (s.cpu ?? 0) > 80).length;

  const avgCpu =
    totalServers > 0
      ? Math.round(serverList.reduce((sum: number, s: any) => sum + (s.cpu ?? 0), 0) / totalServers)
      : 0;

  const avgMemory =
    totalServers > 0
      ? Math.round(serverList.reduce((sum: number, s: any) => sum + (s.memory ?? 0), 0) / totalServers)
      : 0;

  const activeAnalytics = analyticsList.filter((a: any) => a.status === 'active').length;
  const warningAnalytics = analyticsList.filter((a: any) => a.status === 'warning').length;
  const inactiveAnalytics = analyticsList.filter((a: any) => a.status === 'inactive').length;

  const uptimeMetric =
    analyticsList.find((a: any) => String(a.name).toLowerCase().includes('uptime'))?.value ?? 'N/A';

  const serverStatusChart = {
    labels: ['Online', 'Offline', 'High CPU'],
    datasets: [
      {
        label: 'Server Status',
        data: [onlineServers, offlineServers, highCpuServers],
        backgroundColor: [
          'rgba(46, 125, 50, 0.8)',
          'rgba(211, 47, 47, 0.8)',
          'rgba(237, 108, 2, 0.8)',
        ],
      },
    ],
  };

  const analyticsStatusChart = {
    labels: ['Active', 'Warning', 'Inactive'],
    datasets: [
      {
        label: 'Analytics Health',
        data: [activeAnalytics, warningAnalytics, inactiveAnalytics],
        backgroundColor: [
          'rgba(2, 136, 209, 0.8)',
          'rgba(237, 108, 2, 0.8)',
          'rgba(117, 117, 117, 0.8)',
        ],
      },
    ],
  };

  const widgets: DashboardWidget[] = [
    {
      id: 'officerServers',
      title: 'Active Servers',
      content: (
        <DashboardCard
          title="Active Servers"
          value={onlineServers}
          icon={<Storage />}
          color="#1e3c72"
          trend="Infrastructure"
          trendDirection="up"
          details={[
            { label: 'Offline', value: offlineServers, color: '#d32f2f' },
            { label: 'High CPU', value: highCpuServers, color: '#ed6c02' },
            { label: 'Average CPU', value: `${avgCpu}%` },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'officerServers', x: 0, y: 0, w: 4, h: 2 }],
        md: [{ i: 'officerServers', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'officerServers', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'officerServers', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'officerAnalytics',
      title: 'Analytics Signals',
      content: (
        <DashboardCard
          title="Analytics Signals"
          value={analyticsList.length}
          icon={<Assessment />}
          color="#0288d1"
          trend="Operational insights"
          trendDirection="up"
          details={[
            { label: 'Active', value: activeAnalytics, color: '#2e7d32' },
            { label: 'Warning', value: warningAnalytics, color: '#ed6c02' },
            { label: 'Inactive', value: inactiveAnalytics, color: '#757575' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'officerAnalytics', x: 4, y: 0, w: 4, h: 2 }],
        md: [{ i: 'officerAnalytics', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'officerAnalytics', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'officerAnalytics', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'officerReports',
      title: 'Recent Reports',
      content: (
        <DashboardCard
          title="Recent Reports"
          value={reportList.length}
          icon={<Description />}
          color="#7b1fa2"
          trend="Read latest docs"
          trendDirection="up"
          details={[
            { label: 'Latest Uptime', value: String(uptimeMetric) },
            { label: 'Avg Memory', value: `${avgMemory}%` },
            { label: 'Warnings', value: warningAnalytics, color: '#ed6c02' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'officerReports', x: 8, y: 0, w: 4, h: 2 }],
        md: [{ i: 'officerReports', x: 0, y: 2, w: 10, h: 2 }],
        sm: [{ i: 'officerReports', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'officerReports', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'officerServerChart',
      title: 'Server Health',
      content: (
        <Panel title="Server Health" subtitle="Operations-focused infrastructure chart">
          <BarChartWidget data={serverStatusChart} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'officerServerChart', x: 0, y: 2, w: 6, h: 4 }],
        md: [{ i: 'officerServerChart', x: 0, y: 4, w: 10, h: 4 }],
        sm: [{ i: 'officerServerChart', x: 0, y: 6, w: 6, h: 4 }],
        xs: [{ i: 'officerServerChart', x: 0, y: 6, w: 4, h: 4 }],
      },
    },
    {
      id: 'officerAnalyticsChart',
      title: 'Analytics Health',
      content: (
        <Panel title="Analytics Health" subtitle="Signal distribution for officer monitoring">
          <BarChartWidget data={analyticsStatusChart} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'officerAnalyticsChart', x: 6, y: 2, w: 6, h: 4 }],
        md: [{ i: 'officerAnalyticsChart', x: 0, y: 8, w: 10, h: 4 }],
        sm: [{ i: 'officerAnalyticsChart', x: 0, y: 10, w: 6, h: 4 }],
        xs: [{ i: 'officerAnalyticsChart', x: 0, y: 10, w: 4, h: 4 }],
      },
    },
    {
      id: 'officerIncidentPanel',
      title: 'Incident Notes',
      content: (
        <Panel title="Incident Notes" subtitle="Quick operational checkpoints">
          <Stack spacing={1.25}>
            <Chip icon={<WarningAmber />} label={`High CPU servers: ${highCpuServers}`} color="warning" variant="outlined" />
            <Chip icon={<Memory />} label={`Average CPU: ${avgCpu}%`} color="primary" variant="outlined" />
            <Chip icon={<Router />} label={`Average memory: ${avgMemory}%`} color="info" variant="outlined" />
          </Stack>
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'officerIncidentPanel', x: 0, y: 6, w: 4, h: 3 }],
        md: [{ i: 'officerIncidentPanel', x: 0, y: 12, w: 10, h: 3 }],
        sm: [{ i: 'officerIncidentPanel', x: 0, y: 14, w: 6, h: 3 }],
        xs: [{ i: 'officerIncidentPanel', x: 0, y: 14, w: 4, h: 3 }],
      },
    },
    {
      id: 'officerRecentReports',
      title: 'Report Feed',
      content: (
        <Panel title="Report Feed" subtitle="Latest documents relevant to operations">
          <List dense sx={{ p: 0 }}>
            {reportList.slice(0, 4).map((report: any, index: number) => (
              <Box key={report.id ?? index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={700}>
                        {report.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {report.date ? new Date(report.date).toLocaleDateString() : 'No date'}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < Math.min(reportList.length, 4) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'officerRecentReports', x: 4, y: 6, w: 8, h: 3 }],
        md: [{ i: 'officerRecentReports', x: 0, y: 15, w: 10, h: 3 }],
        sm: [{ i: 'officerRecentReports', x: 0, y: 17, w: 6, h: 3 }],
        xs: [{ i: 'officerRecentReports', x: 0, y: 17, w: 4, h: 3 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Officer Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip
          label="Operations Monitor"
          sx={{ bgcolor: '#1e3c72', color: 'white', fontWeight: 600 }}
          icon={<Storage sx={{ color: 'white !important' }} />}
        />
      </Box>

      <DashboardShell dashboardKey="officer-dashboard" widgets={widgets} />
    </Box>
  );
};