import { Box, Chip, LinearProgress } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  People,
  Security,
  Lock,
  HowToReg,
  AdminPanelSettings,
} from '@mui/icons-material';
import { DashboardCard } from './DashboardCard';
import { BarChartWidget } from '../charts/BarChartWidget';
import { DashboardShell, type DashboardWidget } from './DashboardShell';

export const AdminDashboard = () => {
  const { data: users, isLoading } = useGetList('users');

  if (isLoading) {
    return <LinearProgress />;
  }

  const totalUsers = users ? users.length : 0;
  const activeUsers = users ? users.filter((u: any) => u.status === 'active').length : 0;
  const lockedUsers = users ? users.filter((u: any) => u.status === 'locked').length : 0;
  const pendingUsers = users ? users.filter((u: any) => u.status === 'pending').length : 0;

  const roleDistribution = users
    ? users.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.role] = (acc[curr.role] || 0) + 1;
        return acc;
      }, {})
    : {};

  const chartData = {
    labels: Object.keys(roleDistribution).map((r) => r.toUpperCase()),
    datasets: [
      {
        label: 'User Distribution by Role',
        data: Object.values(roleDistribution),
        backgroundColor: [
          'rgba(25, 118, 210, 0.8)',
          'rgba(237, 108, 2, 0.8)',
          'rgba(46, 125, 50, 0.8)',
        ],
      },
    ],
  };

  const widgets: DashboardWidget[] = [
    {
      id: 'totalAccounts',
      title: 'Total Accounts',
      content: (
        <DashboardCard
          title="Total Accounts"
          value={totalUsers}
          icon={<People />}
          color="#1976d2"
          trend="Registered"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'totalAccounts', x: 0, y: 0, w: 3, h: 2 }],
        md: [{ i: 'totalAccounts', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'totalAccounts', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'totalAccounts', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'activeSessions',
      title: 'Active Sessions',
      content: (
        <DashboardCard
          title="Active Sessions"
          value={activeUsers}
          icon={<HowToReg />}
          color="#2e7d32"
          trend="Online Now"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'activeSessions', x: 3, y: 0, w: 3, h: 2 }],
        md: [{ i: 'activeSessions', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'activeSessions', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'activeSessions', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      content: (
        <DashboardCard
          title="Security Alerts"
          value={lockedUsers}
          icon={<Lock />}
          color={lockedUsers > 0 ? '#d32f2f' : '#bdbdbd'}
          trend={lockedUsers > 0 ? 'Locked Accounts' : 'No Issues'}
          trendDirection={lockedUsers > 0 ? 'down' : 'up'}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'securityAlerts', x: 6, y: 0, w: 3, h: 2 }],
        md: [{ i: 'securityAlerts', x: 0, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'securityAlerts', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'securityAlerts', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'pendingApprovals',
      title: 'Pending Approvals',
      content: (
        <DashboardCard
          title="Pending Approvals"
          value={pendingUsers}
          icon={<Security />}
          color="#ed6c02"
          trend="New Requests"
          trendDirection="up"
        />
      ),
      defaultLayout: {
        lg: [{ i: 'pendingApprovals', x: 9, y: 0, w: 3, h: 2 }],
        md: [{ i: 'pendingApprovals', x: 5, y: 2, w: 5, h: 2 }],
        sm: [{ i: 'pendingApprovals', x: 0, y: 6, w: 6, h: 2 }],
        xs: [{ i: 'pendingApprovals', x: 0, y: 6, w: 4, h: 2 }],
      },
    },
    {
      id: 'accountDistribution',
      title: 'Account Distribution',
      content: <BarChartWidget data={chartData} height={320} />,
      defaultLayout: {
        lg: [{ i: 'accountDistribution', x: 0, y: 2, w: 12, h: 4, minH: 4 }],
        md: [{ i: 'accountDistribution', x: 0, y: 4, w: 10, h: 4, minH: 4 }],
        sm: [{ i: 'accountDistribution', x: 0, y: 8, w: 6, h: 4, minH: 4 }],
        xs: [{ i: 'accountDistribution', x: 0, y: 8, w: 4, h: 4, minH: 4 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Admin Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip label="Security & Accounts" color="primary" icon={<AdminPanelSettings />} />
      </Box>

      <DashboardShell dashboardKey="admin-dashboard" widgets={widgets} />
    </Box>
  );
};