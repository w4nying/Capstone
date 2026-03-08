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

export const DashboardCard = ({
  title,
  value,
  icon,
  color,
  trend,
  trendDirection,
}: DashboardCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f1f5f9',
              color,
            }}
          >
            {icon}
          </Box>

          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: '999px',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {trendDirection === 'up' ? (
                <TrendingUp fontSize="inherit" />
              ) : (
                <TrendingDown fontSize="inherit" />
              )}
              {trend}
            </Box>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            mb: 1,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: '#0f172a',
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};