import { Card, CardContent, CardHeader, Box, Chip, LinearProgress } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import { DashboardCard } from './DashboardCard';
import { BarChartWidget } from '../charts/BarChartWidget';
import { People, Security, Lock, HowToReg, AdminPanelSettings } from '@mui/icons-material';

export const AdminDashboard = () => {
    // 1. Fetch User Data
    const { data: users, isLoading } = useGetList('users');

    if (isLoading) return <LinearProgress />;

    // 2. Calculate Account Metrics
    const totalUsers = users ? users.length : 0;
    const activeUsers = users ? users.filter(u => u.status === 'active').length : 0;
    const lockedUsers = users ? users.filter(u => u.status === 'locked').length : 0;
    const pendingUsers = users ? users.filter(u => u.status === 'pending').length : 0;

    // 3. Prepare Chart Data for User Roles
    const roleDistribution = users ? users.reduce((acc: any, curr) => {
        acc[curr.role] = (acc[curr.role] || 0) + 1;
        return acc;
    }, {}) : {};

    const chartData = {
        labels: Object.keys(roleDistribution).map(r => r.toUpperCase()),
        datasets: [
            {
                label: 'User Distribution by Role',
                data: Object.values(roleDistribution),
                backgroundColor: [
                    'rgba(25, 118, 210, 0.8)',
                    'rgba(237, 108, 2, 0.8)', 
                    'rgba(46, 125, 50, 0.8)'
                ],
            }
        ]
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Title title="System Administration" />
                <Chip label="Security & Accounts" color="primary" icon={<AdminPanelSettings />} />
            </Box>
            
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 3,
                mb: 3 
            }}>
                <DashboardCard
                    title="Total Accounts"
                    value={totalUsers}
                    icon={<People />}
                    color="#1976d2"
                    trend="Registered"
                    trendDirection="up"
                />
                <DashboardCard
                    title="Active Sessions"
                    value={activeUsers}
                    icon={<HowToReg />}
                    color="#2e7d32"
                    trend="Online Now"
                    trendDirection="up"
                />
                <DashboardCard
                    title="Security Alerts"
                    value={lockedUsers}
                    icon={<Lock />}
                    color={lockedUsers > 0 ? "#d32f2f" : "#bdbdbd"}
                    trend={lockedUsers > 0 ? "Locked Accounts" : "No Issues"}
                    trendDirection={lockedUsers > 0 ? "down" : "up"}
                />
                <DashboardCard
                    title="Pending Approvals"
                    value={pendingUsers}
                    icon={<Security />}
                    color="#ed6c02"
                    trend="New Requests"
                    trendDirection="up"
                />
            </Box>

            <Card>
                <CardHeader title="Account Distribution" subheader="Users by Authorization Level" />
                <CardContent>
                    <BarChartWidget data={chartData} height={300} />
                </CardContent>
            </Card>
        </Box>
    );
};