import { Box, Chip, LinearProgress, Typography, Grid } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import { DashboardCard } from './DashboardCard';
import { ServerStatusWidget } from './ServerStatusWidget';
import { Assessment, Storage, Memory, Router } from '@mui/icons-material';

export const OfficerDashboard = () => {
    // 1. Fetch Server Data
    const { data: servers, isLoading } = useGetList('servers');

    if (isLoading) return <LinearProgress />;

    // 2. Calculate Metrics
    const totalServers = servers ? servers.length : 0;
    const onlineServers = servers ? servers.filter(s => s.status === 'online').length : 0;
    const healthPercentage = totalServers > 0 ? Math.round((onlineServers / totalServers) * 100) : 0;
    
    const highCpuServers = servers ? servers.filter(s => s.cpu > 80).length : 0;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Title title="Technical Officer Dashboard" />
                <Chip 
                    label="Infrastructure Monitor" 
                    sx={{ bgcolor: '#1e3c72', color: 'white', fontWeight: 600 }} 
                    icon={<Storage sx={{ color: 'white !important' }} />} 
                />
            </Box>
            
            {/* KPI Row */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 3,
                mb: 3 
            }}>
                <DashboardCard
                    title="Active Servers"
                    value={`${onlineServers}/${totalServers}`}
                    icon={<Storage />}
                    color="#1e3c72"
                    trend={onlineServers === totalServers ? "All Systems Go" : "Degraded"}
                    trendDirection={onlineServers === totalServers ? "up" : "down"}
                />
                <DashboardCard
                    title="Infrastructure Health"
                    value={`${healthPercentage}%`}
                    icon={<Assessment />}
                    color={healthPercentage > 90 ? "#2e7d32" : "#ed6c02"}
                    trend="Availability"
                    trendDirection="up"
                />
                <DashboardCard
                    title="High Load Alerts"
                    value={highCpuServers}
                    icon={<Memory />}
                    color={highCpuServers > 0 ? "#d32f2f" : "#2e7d32"}
                    trend="CPU > 80%"
                    trendDirection={highCpuServers > 0 ? "down" : "up"}
                />
                <DashboardCard
                    title="Network Status"
                    value="Stable"
                    icon={<Router />}
                    color="#0288d1"
                    trend="Latency: 12ms"
                    trendDirection="up"
                />
            </Box>

            {/* Detailed Server Widget */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {servers && <ServerStatusWidget servers={servers} />}
                </Grid>
            </Grid>
        </Box>
    );
};