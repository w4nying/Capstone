import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

type DashboardCardDetail = {
  label: string;
  value: string | number;
  color?: string;
};

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  details?: DashboardCardDetail[];
};

export const DashboardCard = ({
  title,
  value,
  icon,
  color = '#1976d2',
  trend,
  trendDirection = 'up',
  details = [],
}: DashboardCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          p: 3,
          '&:last-child': { pb: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '1rem' }}>
            {title}
          </Typography>

          <Box
            sx={{
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            lineHeight: 1.1,
            mb: trend ? 2 : details.length > 0 ? 2 : 0,
          }}
        >
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: details.length > 0 ? 2 : 0 }}>
            {trendDirection === 'up' ? (
              <TrendingUpIcon sx={{ color: 'text.primary', fontSize: 18 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'text.primary', fontSize: 18 }} />
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}

        {details.length > 0 && (
          <Stack spacing={1} sx={{ mt: 'auto' }}>
            {details.map((detail) => (
              <Box
                key={detail.label}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {detail.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    color: detail.color ?? 'text.primary',
                  }}
                >
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};