import { Card, CardContent, CardHeader, Box, Chip, Grid, Typography, LinearProgress, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import { Visibility, Description, CheckCircle, Warning, Article } from '@mui/icons-material';
import { DashboardCard } from './DashboardCard';

export const AssociateDashboard = () => {
    // 1. Fetch Real Data (Read-Only)
    const { data: reports, isLoading: loadingReports } = useGetList('reports', {
        pagination: { page: 1, perPage: 5 },
        sort: { field: 'date', order: 'DESC' },
        filter: { status: 'published' } // Associates only see published reports
    });

    const { data: analytics, isLoading: loadingAnalytics } = useGetList('analytics');

    if (loadingReports || loadingAnalytics) return <LinearProgress />;

    // 2. Calculate View-Only Metrics
    const publishedReportsCount = reports ? reports.length : 0;
    const systemStatus = analytics ? analytics.find(a => a.name === 'System Uptime')?.value : 0;
    const activeMetrics = analytics ? analytics.filter(a => a.status === 'active').length : 0;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Title title="Technical Associate Dashboard" />
                <Chip 
                    label="View Access Only" 
                    variant="outlined"
                    icon={<Visibility />} 
                />
            </Box>

            {/* KPI Cards */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 3,
                mb: 3 
            }}>
                <DashboardCard
                    title="Available Reports"
                    value={publishedReportsCount.toString()}
                    icon={<Description />}
                    color="#7b1fa2"
                    trend="Latest"
                    trendDirection="up"
                />
                <DashboardCard
                    title="System Status"
                    value={systemStatus + "%"}
                    icon={systemStatus > 98 ? <CheckCircle /> : <Warning />}
                    color={systemStatus > 98 ? "#2e7d32" : "#ed6c02"}
                    trend="Uptime"
                    trendDirection="up"
                />
                <DashboardCard
                    title="Active Metrics"
                    value={activeMetrics.toString()}
                    icon={<Visibility />}
                    color="#0288d1"
                    trend="Monitoring"
                    trendDirection="up"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Recent Reports Feed */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader 
                            title="Recent Technical Reports" 
                            subheader="Latest published documentation available for review"
                            avatar={<Article color="primary" />}
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <List>
                                {reports?.map((report: any, index: number) => (
                                    <Box key={report.id}>
                                        <ListItem alignItems="flex-start">
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
                                                        {" — " + report.summary}
                                                    </>
                                                }
                                            />
                                            <Chip label={report.type} size="small" variant="outlined" />
                                        </ListItem>
                                        {index < reports.length - 1 && <Divider component="li" variant="inset" />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Read-Only Notice */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
                        <CardHeader title="Access Limitations" />
                        <CardContent>
                            <Typography variant="body2" paragraph>
                                As a Technical Associate, you have access to:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                                    <ListItemText primary="View System Analytics" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
                                    <ListItemText primary="Read Published Reports" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Warning fontSize="small" color="warning" /></ListItemIcon>
                                    <ListItemText primary="No Edit/Delete Permissions" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Warning fontSize="small" color="warning" /></ListItemIcon>
                                    <ListItemText primary="No System Configuration" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};