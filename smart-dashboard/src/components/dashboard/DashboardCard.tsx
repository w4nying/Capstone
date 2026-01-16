import { Card, CardContent, Box, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
          
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trendDirection === 'up' ? 'success.main' : 'error.main',
              }}
            >
              {trendDirection === 'up' ? (
                <ArrowUpward fontSize="small" />
              ) : (
                <ArrowDownward fontSize="small" />
              )}
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ fontWeight: 700, mb: 0.5 }}
        >
          {value}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};