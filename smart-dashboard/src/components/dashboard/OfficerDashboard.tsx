import { Card, CardContent, CardHeader, Box, Chip } from '@mui/material';
import { Title } from 'react-admin';
import { LineChartWidget } from '../charts/LineChartWidget';
import { BarChartWidget } from '../charts/BarChartWidget';
import { DashboardCard } from './DashboardCard';
import { TrendingUp, Assessment, DataUsage, Speed } from '@mui/icons-material';

export const OfficerDashboard = () => {
  const stats = {
    activeProjects: 18,
    dataProcessed: 2450,
    systemUptime: 99.8,
    avgResponseTime: 245,
  };

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'System Performance',
        data: [95, 97, 96, 99],
        borderColor: 'rgb(30, 60, 114)',
        backgroundColor: 'rgba(30, 60, 114, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const workloadData = {
    labels: ['Data Analysis', 'System Monitoring', 'Reporting', 'Optimization', 'Maintenance'],
    datasets: [
      {
        label: 'Time Allocation (hours)',
        data: [85, 65, 45, 55, 40],
        backgroundColor: [
          'rgba(30, 60, 114, 0.8)',
          'rgba(42, 82, 152, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title title="Technical Officer Dashboard" />
        <Chip 
          label="Technical Officer" 
          sx={{ bgcolor: '#1e3c72', color: 'white', fontWeight: 600 }} 
          icon={<Assessment sx={{ color: 'white !important' }} />} 
        />
      </Box>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        mb: 3 
      }}>
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<Assessment />}
          color="#1e3c72"
          trend="+3"
          trendDirection="up"
        />
        <DashboardCard
          title="Data Processed (GB)"
          value={stats.dataProcessed.toLocaleString()}
          icon={<DataUsage />}
          color="#2a5298"
          trend="+12%"
          trendDirection="up"
        />
        <DashboardCard
          title="System Uptime"
          value={`${stats.systemUptime}%`}
          icon={<TrendingUp />}
          color="#2e7d32"
          trend="+0.2%"
          trendDirection="up"
        />
        <DashboardCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime}ms`}
          icon={<Speed />}
          color="#ed6c02"
          trend="-15ms"
          trendDirection="up"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3 
        }}>
          <Card>
            <CardHeader title="System Performance Metrics" subheader="Weekly overview" />
            <CardContent>
              <LineChartWidget data={performanceData} height={300} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Work Distribution" subheader="Current month" />
            <CardContent>
              <BarChartWidget data={workloadData} height={300} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};