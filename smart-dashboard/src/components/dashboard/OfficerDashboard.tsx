import { Box, Chip, LinearProgress } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  Assessment,
  Storage,
  Memory,
  Router,
} from '@mui/icons-material';
import { DashboardCard } from './DashboardCard';
import { ServerStatusWidget } from './ServerStatusWidget';
import { DashboardShell, type DashboardWidget } from './DashboardShell';

export const OfficerDashboard = () => {
  const { data: servers, isLoading } = useGetList('servers');

  if (isLoading) return <LinearProgress />;

  const totalServers = servers ? servers.length : 0;
  const onlineServers = servers ? servers.filter((s: any) => s.status === 'online').length : 0;
  const healthPercentage =
    totalServers > 0 ? Math.round((onlineServers / totalServers) * 100) : 0;

  const highCpuServers = servers ? servers.filter((s: any) => s.cpu > 80).length : 0;

  const widgets: DashboardWidget[] = [
    {
      id: 'activeServers',
      title: 'Active Servers',
      content: (
        <DashboardCard
          title="Active Servers"
          value={`${onlineServers}/${totalServers}`}
          icon={<Storage />}
          color="#1e3c72"
          trend={onlineServers === totalServers ? 'All Systems Go' : 'Degraded'}
          trendDirection={onlineServers === totalServers ? 'up' : 'down'}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'activeServers', x: 0, y: 0, w: 3, h: 2 }],
        md: [{ i: 'activeServers', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'activeServers', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'activeServers', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'infrastructureHealth',
      title: 'Infrastructure Health',
      content: (
        <DashboardCard
          title="Infrastructure Health"
          value={`${healthPercentage}%`}
          icon={<Assessment />}
          color={healthPercentage > 90 ? '#2e7d32' : '#ed6c02'}
          trend="Availability"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'infrastructureHealth', x: 3, y: 0, w: 3, h: 2 }],
        md: [{ i: 'infrastructureHealth', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'infrastructureHealth', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'infrastructureHealth', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'highLoadAlerts',
      title: 'High Load Alerts',
      content: (
        <DashboardCard
          title="High Load Alerts"
          value={highCpuServers}
          icon={<Memory />}
          color={highCpuServers > 0 ? '#d32f2f' : '#2e7d32'}
          trend="CPU > 80%"
          trendDirection={highCpuServers > 0 ? 'down' : 'up'}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'highLoadAlerts', x: 6, y: 0, w: 3, h: 2 }],
        md: [{ i: 'highLoadAlerts', x: 0, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'highLoadAlerts', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'highLoadAlerts', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'networkStatus',
      title: 'Network Status',
      content: (
        <DashboardCard
          title="Network Status"
          value="Stable"
          icon={<Router />}
          color="#0288d1"
          trend="Latency: 12ms"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'networkStatus', x: 9, y: 0, w: 3, h: 2 }],
        md: [{ i: 'networkStatus', x: 5, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'networkStatus', x: 0, y: 6, w: 6, h: 2 }],
        xs: [{ i: 'networkStatus', x: 0, y: 6, w: 4, h: 2 }],
      },
    },
    {
      id: 'serverStatusWidget',
      title: 'Server Status Overview',
      content: servers ? <ServerStatusWidget servers={servers} embedded /> : null,
      defaultLayout: {
        lg: [{ i: 'serverStatusWidget', x: 0, y: 2, w: 12, h: 5, minH: 4 }],
        md: [{ i: 'serverStatusWidget', x: 0, y: 4, w: 10, h: 5, minH: 4 }],
        sm: [{ i: 'serverStatusWidget', x: 0, y: 8, w: 6, h: 5, minH: 4 }],
        xs: [{ i: 'serverStatusWidget', x: 0, y: 8, w: 4, h: 5, minH: 4 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Technical Officer Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip
          label="Infrastructure Monitor"
          sx={{ bgcolor: '#1e3c72', color: 'white', fontWeight: 600 }}
          icon={<Storage sx={{ color: 'white !important' }} />}
        />
      </Box>

      <DashboardShell dashboardKey="officer-dashboard" widgets={widgets} />
    </Box>
  );
};