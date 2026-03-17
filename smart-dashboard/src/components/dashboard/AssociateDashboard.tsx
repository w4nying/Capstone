import { Box, Chip, Divider, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import {
  Assessment,
  CheckCircle,
  Description,
  Visibility,
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

export const AssociateDashboard = () => {
  const { data: reports, isLoading: reportsLoading } = useGetList('reports', {
    pagination: { page: 1, perPage: 6 },
    sort: { field: 'date', order: 'DESC' },
    filter: { status: 'published' },
  });
  const { data: analytics, isLoading: analyticsLoading } = useGetList('analytics');

  if (reportsLoading || analyticsLoading) {
    return <LinearProgress />;
  }

  const reportList = reports ?? [];
  const analyticsList = analytics ?? [];

  const publishedReportsCount = reportList.length;
  const activeAnalytics = analyticsList.filter((a: any) => a.status === 'active').length;
  const warningAnalytics = analyticsList.filter((a: any) => a.status === 'warning').length;
  const inactiveAnalytics = analyticsList.filter((a: any) => a.status === 'inactive').length;

  const uptimeMetric =
    analyticsList.find((a: any) => String(a.name).toLowerCase().includes('uptime'))?.value ?? 'N/A';

  const analyticsStatusChart = {
    labels: ['Active', 'Warning', 'Inactive'],
    datasets: [
      {
        label: 'Analytics Status',
        data: [activeAnalytics, warningAnalytics, inactiveAnalytics],
        backgroundColor: [
          'rgba(46, 125, 50, 0.8)',
          'rgba(237, 108, 2, 0.8)',
          'rgba(117, 117, 117, 0.8)',
        ],
      },
    ],
  };

  const widgets: DashboardWidget[] = [
    {
      id: 'associateReports',
      title: 'Available Reports',
      content: (
        <DashboardCard
          title="Available Reports"
          value={publishedReportsCount}
          icon={<Description />}
          color="#7b1fa2"
          trend="Read-only access"
          trendDirection="up"
          details={[
            { label: 'Published', value: publishedReportsCount, color: '#2e7d32' },
            { label: 'Latest Loaded', value: reportList.length },
            { label: 'System Uptime', value: String(uptimeMetric) },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'associateReports', x: 0, y: 0, w: 4, h: 2 }],
        md: [{ i: 'associateReports', x: 0, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'associateReports', x: 0, y: 0, w: 6, h: 2 }],
        xs: [{ i: 'associateReports', x: 0, y: 0, w: 4, h: 2 }],
      },
    },
    {
      id: 'associateSystemStatus',
      title: 'System Status',
      content: (
        <DashboardCard
          title="System Status"
          value={String(uptimeMetric)}
          icon={<CheckCircle />}
          color="#2e7d32"
          trend="Uptime"
          trendDirection="up"
          details={[
            { label: 'Active Metrics', value: activeAnalytics, color: '#2e7d32' },
            { label: 'Warnings', value: warningAnalytics, color: '#ed6c02' },
            { label: 'Inactive', value: inactiveAnalytics, color: '#757575' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'associateSystemStatus', x: 4, y: 0, w: 4, h: 2 }],
        md: [{ i: 'associateSystemStatus', x: 5, y: 0, w: 5, h: 2 }],
        sm: [{ i: 'associateSystemStatus', x: 0, y: 2, w: 6, h: 2 }],
        xs: [{ i: 'associateSystemStatus', x: 0, y: 2, w: 4, h: 2 }],
      },
    },
    {
      id: 'associateAnalyticsCount',
      title: 'Analytics',
      content: (
        <DashboardCard
          title="Analytics"
          value={analyticsList.length}
          icon={<Assessment />}
          color="#0288d1"
          trend="View signals"
          trendDirection="up"
          details={[
            { label: 'Active', value: activeAnalytics, color: '#2e7d32' },
            { label: 'Warning', value: warningAnalytics, color: '#ed6c02' },
            { label: 'Inactive', value: inactiveAnalytics, color: '#757575' },
          ]}
        />
      ),
      defaultLayout: {
        lg: [{ i: 'associateAnalyticsCount', x: 8, y: 0, w: 4, h: 2 }],
        md: [{ i: 'associateAnalyticsCount', x: 0, y: 2, w: 10, h: 2 }],
        sm: [{ i: 'associateAnalyticsCount', x: 0, y: 4, w: 6, h: 2 }],
        xs: [{ i: 'associateAnalyticsCount', x: 0, y: 4, w: 4, h: 2 }],
      },
    },
    {
      id: 'associateAnalyticsChart',
      title: 'Analytics Overview',
      content: (
        <Panel title="Analytics Overview" subtitle="Read-only health summary">
          <BarChartWidget data={analyticsStatusChart} height={260} />
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'associateAnalyticsChart', x: 0, y: 2, w: 6, h: 4 }],
        md: [{ i: 'associateAnalyticsChart', x: 0, y: 4, w: 10, h: 4 }],
        sm: [{ i: 'associateAnalyticsChart', x: 0, y: 6, w: 6, h: 4 }],
        xs: [{ i: 'associateAnalyticsChart', x: 0, y: 6, w: 4, h: 4 }],
      },
    },
    {
      id: 'associateReportFeed',
      title: 'Recent Reports',
      content: (
        <Panel title="Recent Reports" subtitle="Latest published items you can view">
          <List dense sx={{ p: 0 }}>
            {reportList.slice(0, 5).map((report: any, index: number) => (
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
                {index < Math.min(reportList.length, 5) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Panel>
      ),
      defaultLayout: {
        lg: [{ i: 'associateReportFeed', x: 6, y: 2, w: 6, h: 4 }],
        md: [{ i: 'associateReportFeed', x: 0, y: 8, w: 10, h: 4 }],
        sm: [{ i: 'associateReportFeed', x: 0, y: 10, w: 6, h: 4 }],
        xs: [{ i: 'associateReportFeed', x: 0, y: 10, w: 4, h: 4 }],
      },
    },
  ];

  return (
    <Box>
      <Title title="Associate Dashboard" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Chip label="View Access Only" variant="outlined" icon={<Visibility />} />
      </Box>

      <DashboardShell dashboardKey="associate-dashboard" widgets={widgets} />
    </Box>
  );
};