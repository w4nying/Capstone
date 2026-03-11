import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
};

export const DashboardCard = ({
  title,
  value,
  icon,
  color = '#1976d2',
  trend,
  trendDirection = 'up',
}: DashboardCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{
          px: 3,      // wider horizontal padding
          py: 2.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              color,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.5px',
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {trend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {trendDirection === 'up' ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}

            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};