import { Card, CardHeader, CardContent, Grid, Box, Typography, LinearProgress, Chip, Avatar } from '@mui/material';
import { Dns, CheckCircle, Warning, Error, Build } from '@mui/icons-material';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'online': return 'success';
        case 'degraded': return 'warning';
        case 'offline': return 'error';
        case 'maintenance': return 'default';
        default: return 'default';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'online': return <CheckCircle fontSize="small" color="success" />;
        case 'degraded': return <Warning fontSize="small" color="warning" />;
        case 'offline': return <Error fontSize="small" color="error" />;
        case 'maintenance': return <Build fontSize="small" color="action" />;
        default: return <Dns fontSize="small" />;
    }
};

export const ServerStatusWidget = ({ servers }: { servers: any[] }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader 
                title="Infrastructure Status" 
                subheader="Real-time Server Health & Resource Usage"
                avatar={<Avatar sx={{ bgcolor: '#1e3c72' }}><Dns /></Avatar>}
            />
            <CardContent>
                <Grid container spacing={2}>
                    {servers.map((server) => (
                        <Grid item xs={12} sm={6} key={server.id}>
                            <Box sx={{ 
                                p: 2, 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 2,
                                bgcolor: server.status === 'degraded' ? '#fff3e0' : 'white'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getStatusIcon(server.status)}
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {server.name}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={server.status} 
                                        size="small" 
                                        color={getStatusColor(server.status) as any} 
                                        variant="outlined" 
                                    />
                                </Box>
                                
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    {server.type} • Uptime: {server.uptime}
                                </Typography>

                                <Box sx={{ mb: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption">CPU</Typography>
                                        <Typography variant="caption">{server.cpu}%</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={server.cpu} 
                                        color={server.cpu > 80 ? 'error' : 'primary'}
                                        sx={{ height: 6, borderRadius: 3 }}
                                    />
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption">Memory</Typography>
                                        <Typography variant="caption">{server.memory}%</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={server.memory} 
                                        color={server.memory > 80 ? 'warning' : 'info'}
                                        sx={{ height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};