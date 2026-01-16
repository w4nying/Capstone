import { Card, CardContent, CardHeader, Box, Chip } from '@mui/material';
import { Title } from 'react-admin';
import { LineChartWidget } from '../charts/LineChartWidget';
import { DashboardCard } from './DashboardCard';
import { TrendingUp, People, Assessment, AttachMoney, Security, Settings } from '@mui/icons-material';

export const AdminDashboard = () => {
  const stats = {
    totalUsers: 1234,
    revenue: 45678,
    activeProjects: 23,
    systemHealth: 98,
  };

  const timeSeriesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: [8000, 12000, 10000, 15000, 14000, 18000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title title="System Administrator Dashboard" />
        <Chip label="Administrator" color="error" icon={<Security />} />
      </Box>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        mb: 3 
      }}>
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<People />}
          color="#1976d2"
          trend="+12%"
          trendDirection="up"
        />
        <DashboardCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<AttachMoney />}
          color="#2e7d32"
          trend="+8%"
          trendDirection="up"
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Assessment />}
          color="#ed6c02"
          trend="+5%"
          trendDirection="up"
        />
        <DashboardCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          icon={<Settings />}
          color="#9c27b0"
          trend="+2%"
          trendDirection="up"
        />
      </Box>

      <Card>
        <CardHeader title="System Overview - Full Admin Access" />
        <CardContent>
          <LineChartWidget data={timeSeriesData} height={300} />
        </CardContent>
      </Card>
    </Box>
  );
};