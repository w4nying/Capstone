import { List, useListContext, ShowButton, useGetList } from 'react-admin';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  CheckCircle,
  WarningAmber,
  Insights,
  TrackChanges,
} from '@mui/icons-material';
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

type TrendType = 'improving' | 'degrading' | 'stable' | 'achieved';

type AnalyticsRecord = {
  id: string | number;
  name?: string;
  category?: string;
  status?: string;
  trend?: TrendType | string;
  value?: number | string;
  target?: number | string;
  updatedAt?: string;
};

const isLowerBetterMetric = (name?: string) => {
  if (!name) return false;
  const lowerName = name.toLowerCase();
  return (
    lowerName.includes('time') ||
    lowerName.includes('latency') ||
    lowerName.includes('response') ||
    lowerName.includes('rate')
  );
};

const getProgressInfo = (record: AnalyticsRecord) => {
  const value = Number(record.value ?? 0);
  const target = Number(record.target ?? 0);
  const lowerIsBetter = isLowerBetterMetric(record.name);

  if (!target || !value) {
    return {
      percent: 0,
      isTargetMet: false,
    };
  }

  const percent = lowerIsBetter
    ? Math.min((target / value) * 100, 100)
    : Math.min((value / target) * 100, 100);

  const isTargetMet = lowerIsBetter ? value <= target : value >= target;

  return {
    percent,
    isTargetMet,
  };
};

const getTrendConfig = (trend?: string): {
  icon: ReactElement;
  label: string;
  color: 'success' | 'error' | 'default';
} => {
  switch ((trend || '').toLowerCase()) {
    case 'improving':
      return {
        icon: <TrendingUp fontSize="small" />,
        label: 'Improving',
        color: 'success',
      };
    case 'degrading':
      return {
        icon: <TrendingDown fontSize="small" />,
        label: 'Degrading',
        color: 'error',
      };
    case 'achieved':
      return {
        icon: <CheckCircle fontSize="small" />,
        label: 'Goal Met',
        color: 'success',
      };
    default:
      return {
        icon: <Remove fontSize="small" />,
        label: 'Stable',
        color: 'default',
      };
  }
};

const getStatusColor = (
  status?: string
): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch ((status || '').toLowerCase()) {
    case 'healthy':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    case 'stable':
      return 'info';
    default:
      return 'default';
  }
};

const SummaryStrip = () => {
  const { data, isPending } = useGetList<AnalyticsRecord>('analytics', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'date', order: 'DESC' },
    filter: {},
  });

  if (isPending) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            xl: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={96}
            sx={{ borderRadius: 3 }}
          />
        ))}
      </Box>
    );
  }

  const records = data ?? [];
  const total = records.length;

  const met = records.filter((record) => getProgressInfo(record).isTargetMet).length;

  const attention = records.filter((record) =>
    ['warning', 'critical'].includes(String(record.status || '').toLowerCase())
  ).length;

  const avgProgress =
    total > 0
      ? Math.round(
          records.reduce((sum, record) => sum + getProgressInfo(record).percent, 0) /
            total
        )
      : 0;

  const items = [
    {
      label: 'Total Metrics',
      value: total,
      icon: <Insights fontSize="small" />,
    },
    {
      label: 'Targets Met',
      value: met,
      icon: <CheckCircle fontSize="small" />,
    },
    {
      label: 'Average Progress',
      value: `${avgProgress}%`,
      icon: <TrackChanges fontSize="small" />,
    },
    {
      label: 'Needs Attention',
      value: attention,
      icon: <WarningAmber fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        gap: 2,
        mb: 3,
      }}
    >
      {items.map((item) => (
        <Card
          key={item.label}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)',
          }}
        >
          <CardContent sx={{ px: 2, py: 1.75 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                  {item.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                }}
              >
                {item.icon}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const AnalyticsRow = ({ record }: { record: AnalyticsRecord }) => {
  const { percent, isTargetMet } = getProgressInfo(record);
  const trend = getTrendConfig(record.trend);
  const statusColor = getStatusColor(record.status);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {record.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {record.category}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={record.status || 'Unknown'}
                size="small"
                color={statusColor}
                variant={statusColor === 'default' ? 'outlined' : 'filled'}
                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
              />
              <Chip
                icon={trend.icon}
                label={trend.label}
                size="small"
                color={trend.color}
                variant={trend.color === 'default' ? 'outlined' : 'filled'}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr 1fr',
                md: '1.2fr 1fr 1fr auto',
              },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Value
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {record.value ?? '-'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Target
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {record.target ?? '-'}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 180 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percent}
                color={isTargetMet ? 'success' : 'warning'}
                sx={{
                  mt: 0.75,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: 'action.hover',
                }}
              />
              <Typography
                variant="caption"
                color={isTargetMet ? 'success.main' : 'warning.main'}
                sx={{ mt: 0.5, display: 'inline-block', fontWeight: 600 }}
              >
                {Math.round(percent)}% · {isTargetMet ? 'On target' : 'Below target'}
              </Typography>
            </Box>

            <Box sx={{ justifySelf: { xs: 'start', md: 'end' } }}>
              <ShowButton
                label="View"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
                record={record}
              />
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Last updated: {record.updatedAt || 'N/A'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

const FilterSortBar = () => {
  const { filterValues, setFilters, sort, setSort } = useListContext<AnalyticsRecord>();

  const currentFilters = useMemo(
    () => ({
      q: String(filterValues?.q ?? ''),
      category: String(filterValues?.category ?? ''),
      status: String(filterValues?.status ?? ''),
    }),
    [filterValues]
  );

  const handleClear = () => {
    setFilters({});
    setSort({ field: 'updatedAt', order: 'DESC' });
  };

  return (
    <Box
      sx={{
        mb: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        useFlexGap
        flexWrap="wrap"
        sx={{
          rowGap: 1.5,
        }}
      >
        <TextField
          label="Search analytics"
          placeholder="Search metric, category, status..."
          value={currentFilters.q}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              q: e.target.value,
            })
          }
          size="small"
          sx={{
            minWidth: 280,
            flex: 1.6,
          }}
        />

        <TextField
          select
          label="Category"
          value={currentFilters.category}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              category: e.target.value,
            })
          }
          size="small"
          sx={{
            minWidth: 170,
            flex: 1,
          }}
        >
          <MenuItem value="">All categories</MenuItem>
          <MenuItem value="performance">Performance</MenuItem>
          <MenuItem value="security">Security</MenuItem>
          <MenuItem value="operations">Operations</MenuItem>
          <MenuItem value="compliance">Compliance</MenuItem>
          <MenuItem value="engagement">Engagement</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={currentFilters.status}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              status: e.target.value,
            })
          }
          size="small"
          sx={{
            minWidth: 160,
            flex: 1,
          }}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="healthy">Healthy</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
          <MenuItem value="stable">Stable</MenuItem>
        </TextField>

        <TextField
          select
          label="Sort by"
          value={`${sort.field}|${sort.order}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('|');
            setSort({ field, order: order as 'ASC' | 'DESC' });
          }}
          size="small"
          sx={{
            minWidth: 190,
            flex: 1,
          }}
        >
          <MenuItem value="updatedAt|DESC">Last Updated (Desc)</MenuItem>
          <MenuItem value="updatedAt|ASC">Last Updated (Asc)</MenuItem>
          <MenuItem value="name|ASC">Metric Name (Asc)</MenuItem>
          <MenuItem value="name|DESC">Metric Name (Desc)</MenuItem>
          <MenuItem value="category|ASC">Category (Asc)</MenuItem>
          <MenuItem value="category|DESC">Category (Desc)</MenuItem>
          <MenuItem value="status|ASC">Status (Asc)</MenuItem>
          <MenuItem value="status|DESC">Status (Desc)</MenuItem>
          <MenuItem value="value|ASC">Value (Asc)</MenuItem>
          <MenuItem value="value|DESC">Value (Desc)</MenuItem>
          <MenuItem value="target|ASC">Target (Asc)</MenuItem>
          <MenuItem value="target|DESC">Target (Desc)</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          onClick={handleClear}
          sx={{
            height: 40,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            whiteSpace: 'nowrap',
          }}
        >
          Clear
        </Button>
      </Stack>
    </Box>
  );
};

const AnalyticsListContent = () => {
  const { data, isPending } = useListContext<AnalyticsRecord>();
  const { getSetting } = useSystemSettings();
  const refreshInterval = getSetting('Refresh Interval', '60 seconds');
  
  useAutoRefresh(true, refreshInterval);

  return (
    <Box sx={{ px: { xs: 0.5, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Analytics Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review KPI performance, target progress, and operational health in a cleaner list layout.
        </Typography>
      </Box>

      <FilterSortBar />
      <SummaryStrip />

      <Stack spacing={2}>
        {isPending &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={170}
              sx={{ borderRadius: 3 }}
            />
          ))}

        {!isPending &&
          data?.map((record) => <AnalyticsRow key={record.id} record={record} />)}

        {!isPending && (!data || data.length === 0) && (
          <Card
            sx={{
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                No analytics found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search terms.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export const AnalyticsList = () => (
  <List perPage={10} sort={{ field: 'updatedAt', order: 'DESC' }}>
    <AnalyticsListContent />
  </List>
);