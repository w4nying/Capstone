import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Divider, LinearProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  AdminPanelSettings,
  Assessment,
  Description,
  Lock,
  Memory,
  People,
  Router,
  Security,
  Storage,
} from '@mui/icons-material';

import { DashboardCard } from './DashboardCard';
import { PieChartWidget } from '../charts/PieChartWidget';
import { BarChartWidget } from '../charts/BarChartWidget';
import { LineChartWidget } from '../charts/LineChartWidget';
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
      display: 'flex',
      flexDirection: 'column',
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
    <Box sx={{ flex: 1, minHeight: 0 }}>
      {children}
    </Box>
  </Box>
);

export const AdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useGetList('users');
  const { data: servers, isLoading: serversLoading } = useGetList('servers');
  const { data: reports, isLoading: reportsLoading } = useGetList('reports', {
    pagination: { page: 1, perPage: 6 },
    sort: { field: 'date', order: 'DESC' },
  });
  const { data: analytics, isLoading: analyticsLoading } = useGetList('analytics');

  const MAX_CPU_POINTS = 12;

  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);
  const [cpuLabels, setCpuLabels] = useState<string[]>([]);

  const userList = users ?? [];
  const serverList = servers ?? [];
  const reportList = reports ?? [];
  const analyticsList = analytics ?? [];

  const totalUsers = userList.length;
  const activeUsers = userList.filter((u: any) => u.status === 'active').length;
  const lockedUsers = userList.filter((u: any) => u.status === 'locked').length;
  const pendingUsers = userList.filter((u: any) => u.status === 'pending').length;

  const roleDistribution = userList.reduce((acc: Record<string, number>, curr: any) => {
    acc[curr.role] = (acc[curr.role] || 0) + 1;
    return acc;
  }, {});

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

  const publishedReports =
    reportList.filter((r: any) => r.status === 'published').length || reportList.length;

  const activeAnalytics = analyticsList.filter((a: any) => a.status === 'active').length;
  const warningAnalytics = analyticsList.filter((a: any) => a.status === 'warning').length;
  const inactiveAnalytics = analyticsList.filter((a: any) => a.status === 'inactive').length;

  const uptimeMetric =
    analyticsList.find((a: any) => String(a.name).toLowerCase().includes('uptime'))?.value ?? 'N/A';

  useEffect(() => {
    const getTimeLabel = () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

    const pushPoint = () => {
      const liveAverageCpu =
        serverList.length > 0
          ? Math.round(
              serverList.reduce((sum: number, server: any) => sum + (server.cpu ?? 0), 0) /
                serverList.length
            )
          : 0;

      const liveAverageMemory =
        serverList.length > 0
          ? Math.round(
              serverList.reduce((sum: number, server: any) => sum + (server.memory ?? 0), 0) /
                serverList.length
            )
          : 0;

      const nextCpu = Math.max(
        0,
        Math.min(100, liveAverageCpu + Math.round((Math.random() - 0.5) * 10))
      );

      const nextMemory = Math.max(
        0,
        Math.min(100, liveAverageMemory + Math.round((Math.random() - 0.5) * 8))
      );

      setCpuHistory((prev) => [...prev, nextCpu].slice(-MAX_CPU_POINTS));
      setMemoryHistory((prev) => [...prev, nextMemory].slice(-MAX_CPU_POINTS));
      setCpuLabels((prev) => [...prev, getTimeLabel()].slice(-MAX_CPU_POINTS));
    };

    pushPoint();
    const interval = window.setInterval(pushPoint, 4000);

    return () => window.clearInterval(interval);
  }, [serverList]);

  const cpuTrendData = useMemo(
    () => ({
      labels: cpuLabels,
      datasets: [
        {
          label: 'Average CPU Usage',
          data: cpuHistory,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.10)',
          fill: true,
        },
        {
          label: 'Average Memory Usage',
          data: memoryHistory,
          borderColor: '#ed6c02',
          backgroundColor: 'rgba(237, 108, 2, 0.08)',
          fill: false,
        },
      ],
    }),
    [cpuLabels, cpuHistory, memoryHistory]
  );

  if (usersLoading || serversLoading || reportsLoading || analyticsLoading) {
    return <LinearProgress />;
  }

  const userRolePieChart = {
    labels: Object.keys(roleDistribution).map((role) => role.toUpperCase()),
    datasets: [
      {
        data: Object.values(roleDistribution),
        backgroundColor: [
          '#1976d2',
          '#ed6c02',
          '#2e7d32',
        ],
        borderWidth: 0,
      },
    ],
  };

  const serverStatusChart = {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        label: 'Infrastructure',
        data: [onlineServers, offlineServers],
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
        label: 'Analytics Status',
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
      id: 'adminUsers',
      title: 'Users',
      content: (
        <DashboardCard
          title="Users"
          value={totalUsers}
          icon={<People />}
          color="#1976d2"
          trend="All accounts"
          trendDirection="up"
          details={[
            { label: 'Active', value: activeUsers, color: '#2e7d32' },
            { label: 'Pending', value: pendingUsers, color: '#ed6c02' },
            { label: 'Locked', value: lockedUsers, color: '#d32f2f' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'adminUsers', x: 0, y: 0, w: 3, h: 2 }],
        md: [{ i: 'adminUsers', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'adminUsers', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'adminUsers', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'adminServers',
      title: 'Servers',
      content: (
        <DashboardCard
          title="Servers"
          value={totalServers}
          icon={<Storage />}
          color="#1e3c72"
          trend="Infrastructure monitored"
          trendDirection="up"
          details={[
            { label: 'Online', value: onlineServers, color: '#2e7d32' },
            { label: 'Offline', value: offlineServers, color: '#d32f2f' },
            { label: 'High CPU', value: highCpuServers, color: '#ed6c02' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'adminServers', x: 3, y: 0, w: 3, h: 2 }],
        md: [{ i: 'adminServers', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'adminServers', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'adminServers', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'adminReports',
      title: 'Reports',
      content: (
        <DashboardCard
          title="Reports"
          value={reportList.length}
          icon={<Description />}
          color="#7b1fa2"
          trend="Documentation"
          trendDirection="up"
          details={[
            { label: 'Published', value: publishedReports, color: '#2e7d32' },
            { label: 'Recent Loaded', value: reportList.length },
            { label: 'Latest Uptime', value: String(uptimeMetric) },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'adminReports', x: 6, y: 0, w: 3, h: 2 }],
        md: [{ i: 'adminReports', x: 0, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'adminReports', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'adminReports', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'adminAnalytics',
      title: 'Analytics',
      content: (
        <DashboardCard
          title="Analytics"
          value={analyticsList.length}
          icon={<Assessment />}
          color="#0288d1"
          trend="System signals"
          trendDirection="up"
          details={[
            { label: 'Active', value: activeAnalytics, color: '#2e7d32' },
            { label: 'Warning', value: warningAnalytics, color: '#ed6c02' },
            { label: 'Inactive', value: inactiveAnalytics, color: '#757575' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'adminAnalytics', x: 9, y: 0, w: 3, h: 2 }],
        md: [{ i: 'adminAnalytics', x: 5, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'adminAnalytics', x: 0, y: 6, w: 6, h: 2 }],
        xs: [{ i: 'adminAnalytics', x: 0, y: 6, w: 4, h: 2 }],
      },
    },
    {
      id: 'userRoleChart',
      title: 'User Role Distribution',
      content: (
        <Panel title="User Role Distribution" subtitle="User composition overview">
          <PieChartWidget
            data={userRolePieChart}
            height={260}
            centerText={String(totalUsers)}
            subText="Total Users"
          />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'userRoleChart', x: 0, y: 2, w: 6, h: 4 }],
        md: [{ i: 'userRoleChart', x: 0, y: 4, w: 10, h: 4 }],
        sm: [{ i: 'userRoleChart', x: 0, y: 8, w: 6, h: 4 }],
        xs: [{ i: 'userRoleChart', x: 0, y: 8, w: 4, h: 4 }],
      },
    },
    {
      id: 'serverStatusChart',
      title: 'Server Health Chart',
      content: (
        <Panel title="Infrastructure Health" subtitle="Operational server distribution">
          <BarChartWidget data={serverStatusChart} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'serverStatusChart', x: 6, y: 2, w: 6, h: 4 }],
        md: [{ i: 'serverStatusChart', x: 0, y: 8, w: 10, h: 4 }],
        sm: [{ i: 'serverStatusChart', x: 0, y: 12, w: 6, h: 4 }],
        xs: [{ i: 'serverStatusChart', x: 0, y: 12, w: 4, h: 4 }],
      },
    },
    {
      id: 'analyticsStatusChart',
      title: 'Analytics Status Chart',
      content: (
        <Panel title="Analytics Overview" subtitle="Current signal health from analytics data">
          <BarChartWidget data={analyticsStatusChart} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'analyticsStatusChart', x: 0, y: 6, w: 6, h: 4 }],
        md: [{ i: 'analyticsStatusChart', x: 0, y: 12, w: 10, h: 4 }],
        sm: [{ i: 'analyticsStatusChart', x: 0, y: 16, w: 6, h: 4 }],
        xs: [{ i: 'analyticsStatusChart', x: 0, y: 16, w: 4, h: 4 }],
      },
    },
    {
      id: 'recentReportsAdmin',
      title: 'Recent Reports',
      content: (
        <Panel title="Recent Reports" subtitle="Latest documentation from the reports dataset">
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: 3,
              },
            }}
          >
            <List dense sx={{ p: 0 }}>
              {reportList.map((report: any, index: number) => (
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
                  {index < reportList.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Box>
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'recentReportsAdmin', x: 6, y: 6, w: 6, h: 4 }],
        md: [{ i: 'recentReportsAdmin', x: 0, y: 16, w: 10, h: 4 }],
        sm: [{ i: 'recentReportsAdmin', x: 0, y: 20, w: 6, h: 4 }],
        xs: [{ i: 'recentReportsAdmin', x: 0, y: 20, w: 4, h: 4 }],
      },
    },
    {
      id: 'opsSnapshot',
      title: 'Ops Snapshot',
      content: (
        <Panel title="Operations Snapshot" subtitle="Cross-domain summary for admin oversight">
          <Stack spacing={1.25}>
            <Chip icon={<Security />} label={`Pending approvals: ${pendingUsers}`} color="warning" variant="outlined" />
            <Chip icon={<Lock />} label={`Locked accounts: ${lockedUsers}`} color="error" variant="outlined" />
            <Chip icon={<Memory />} label={`Average CPU: ${avgCpu}%`} color="primary" variant="outlined" />
            <Chip icon={<Router />} label={`Average memory: ${avgMemory}%`} color="info" variant="outlined" />
          </Stack>
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'opsSnapshot', x: 0, y: 10, w: 12, h: 3 }],
        md: [{ i: 'opsSnapshot', x: 0, y: 20, w: 10, h: 3 }],
        sm: [{ i: 'opsSnapshot', x: 0, y: 24, w: 6, h: 3 }],
        xs: [{ i: 'opsSnapshot', x: 0, y: 24, w: 4, h: 3 }],
      },
    },
    {
      id: 'cpuTrendLine',
      title: 'Live CPU Trend',
      content: (
        <Panel title="Live CPU Trend" subtitle="Average CPU and memory usage across monitored servers">
          <LineChartWidget data={cpuTrendData} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'cpuTrendLine', x: 0, y: 10, w: 12, h: 4 }],
        md: [{ i: 'cpuTrendLine', x: 0, y: 20, w: 10, h: 4 }],
        sm: [{ i: 'cpuTrendLine', x: 0, y: 24, w: 6, h: 4 }],
        xs: [{ i: 'cpuTrendLine', x: 0, y: 24, w: 4, h: 4 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Admin Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip label="Full Platform Overview" color="primary" icon={<AdminPanelSettings />} />
      </Box>

      <DashboardShell dashboardKey="admin-dashboard" widgets={widgets} />
    </Box>
  );
};