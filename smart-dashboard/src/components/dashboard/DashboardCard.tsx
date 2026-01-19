import { Card, CardContent, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
}

export const DashboardCard = ({ title, value, icon, color, trend, trendDirection }: DashboardCardProps) => {
    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box 
                        sx={{ 
                            p: 1.5, 
                            borderRadius: 2, 
                            bgcolor: `${color}15`, // 15% opacity version of color
                            color: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                    {trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: trendDirection === 'up' ? 'success.main' : 'error.main',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {trendDirection === 'up' ? <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />}
                                {trend}
                            </Typography>
                        </Box>
                    )}
                </Box>
                
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
};