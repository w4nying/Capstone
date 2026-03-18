import {
  List,
  useListContext,
  useNotify,
  useUpdate,
} from 'react-admin';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  BuildOutlined,
  SecurityOutlined,
  SpeedOutlined,
  PsychologyOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { getCurrentUser } from '../../providers/authProvider';

type SettingRecord = {
  id: string | number;
  category?: string;
  name?: string;
  value?: string;
  description?: string;
  modifiedBy?: string;
  lastModified?: string;
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
};

const truncateText = (value?: string, maxLength = 110) => {
  if (!value) return '-';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

const shouldDisplaySetting = (record: SettingRecord) => {
  const name = String(record.name || '').toLowerCase();
  return name !== 'default theme' && name !== 'default chart library';
};

const getCategoryColor = (
  category?: string
): 'primary' | 'success' | 'warning' | 'info' | 'default' => {
  switch ((category || '').toLowerCase()) {
    case 'system':
      return 'primary';
    case 'performance':
      return 'warning';
    case 'security':
      return 'default';
    case 'user experience':
      return 'success';
    case 'visualization':
      return 'info';
    default:
      return 'default';
  }
};

const getCategoryIcon = (category?: string) => {
  switch ((category || '').toLowerCase()) {
    case 'system':
      return <BuildOutlined fontSize="small" />;
    case 'performance':
      return <SpeedOutlined fontSize="small" />;
    case 'security':
      return <SecurityOutlined fontSize="small" />;
    case 'user experience':
      return <PsychologyOutlined fontSize="small" />;
    case 'visualization':
      return <TuneOutlined fontSize="small" />;
    default:
      return <BuildOutlined fontSize="small" />;
  }
};

const isBooleanSetting = (record: SettingRecord) => {
  const name = String(record.name || '').toLowerCase();
  return (
    name.includes('enabled') ||
    name.includes('auto-save') ||
    record.value === 'true' ||
    record.value === 'false'
  );
};

const isSessionTimeoutSetting = (record: SettingRecord) => {
  const name = String(record.name || '').toLowerCase();
  return name.includes('session timeout');
};

const isRefreshIntervalSetting = (record: SettingRecord) => {
  const name = String(record.name || '').toLowerCase();
  return name.includes('refresh interval');
};

const getSessionTimeoutOptions = () => [
  '5 minutes',
  '10 minutes',
  '15 minutes',
  '30 minutes',
  '45 minutes',
  '60 minutes',
];

const getRefreshIntervalOptions = () => [
  '15 seconds',
  '30 seconds',
  '60 seconds',
  '120 seconds',
  '300 seconds',
];

const FilterBar = () => {
  const { filterValues, setFilters, sort, setSort } = useListContext<SettingRecord>();

  const currentFilters = useMemo(
    () => ({
      q: String(filterValues?.q ?? ''),
    }),
    [filterValues]
  );

  const handleClear = () => {
    setFilters({});
    setSort({ field: 'name', order: 'ASC' });
    };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap flexWrap="wrap">
        <TextField
          label="Search settings"
          placeholder="Search name, value, description..."
          value={currentFilters.q}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              q: e.target.value,
            })
          }
          size="small"
          sx={{ minWidth: 320, flex: 2.2 }}
        />

        <TextField
          select
          label="Sort by"
          value={`${sort.field}|${sort.order}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('|');
            setSort({ field, order: order as 'ASC' | 'DESC' });
          }}
          size="small"
          sx={{ minWidth: 190, flex: 1 }}
        >
          <MenuItem value="name|ASC">Name (A-Z)</MenuItem>
          <MenuItem value="name|DESC">Name (Z-A)</MenuItem>
          <MenuItem value="lastModified|DESC">Last Modified (Newest)</MenuItem>
          <MenuItem value="lastModified|ASC">Last Modified (Oldest)</MenuItem>
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

const SettingValueEditor = ({ record }: { record: SettingRecord }) => {
  const notify = useNotify();
  const { refreshSettings } = useSystemSettings();
  const [update, { isPending }] = useUpdate();

  const user = getCurrentUser();
  const modifiedBy = user?.fullName || user?.username || 'System Administrator';

  const [value, setValue] = useState(record.value ?? '');

  useEffect(() => {
    setValue(record.value ?? '');
  }, [record.value]);

  const changed = value !== (record.value ?? '');

  const handleSave = () => {
    update(
      'settings',
      {
        id: record.id,
        data: {
          ...record,
          value,
          lastModified: new Date().toISOString(),
          modifiedBy,
        },
        previousData: record,
      },
      {
        onSuccess: async () => {
          notify('Setting updated');
          await refreshSettings();
        //   refresh();
        },
        onError: () => {
          notify('Failed to update setting', { type: 'error' });
        },
      }
    );
  };

  if (isBooleanSetting(record)) {
    const checked = String(value).toLowerCase() === 'true';

    return (
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Switch
          checked={checked}
          onChange={(e) => setValue(String(e.target.checked))}
        />
        <Typography variant="body2" sx={{ minWidth: 40 }}>
          {checked ? 'On' : 'Off'}
        </Typography>
        <Button
          variant="contained"
          size="small"
          disabled={!changed || isPending}
          onClick={handleSave}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Save
        </Button>
      </Stack>
    );
  }

  if (isSessionTimeoutSetting(record)) {
    return (
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          select
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ minWidth: 240 }}
        >
          {getSessionTimeoutOptions().map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          size="small"
          disabled={!changed || isPending}
          onClick={handleSave}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Save
        </Button>
      </Stack>
    );
  }

  if (isRefreshIntervalSetting(record)) {
    return (
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          select
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ minWidth: 240 }}
        >
          {getRefreshIntervalOptions().map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          size="small"
          disabled={!changed || isPending}
          onClick={handleSave}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Save
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      <TextField
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ minWidth: 260 }}
      />
      <Button
        variant="contained"
        size="small"
        disabled={!changed || isPending}
        onClick={handleSave}
        sx={{ textTransform: 'none', borderRadius: 2 }}
      >
        Save
      </Button>
    </Stack>
  );
};

const SettingsTable = () => {
  const { data, isPending } = useListContext<SettingRecord>();

  const visibleData = [...(data ?? [])]
    .filter(shouldDisplaySetting)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (isPending) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={56} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }

  if (!visibleData.length) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          No settings found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <TableContainer
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        <Table
          sx={{
            width: '100%',
            minWidth: 1100,
            tableLayout: 'fixed',
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'action.hover',
                '& .MuiTableCell-root': {
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <TableCell sx={{ width: '12%' }}>Category</TableCell>
              <TableCell sx={{ width: '16%' }}>Setting Name</TableCell>
              <TableCell sx={{ width: '26%' }}>Value / Control</TableCell>
              <TableCell sx={{ width: '20%' }}>Description</TableCell>
              <TableCell sx={{ width: '11%' }}>Modified By</TableCell>
              <TableCell sx={{ width: '15%' }}>Last Modified</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleData.map((record) => {
              const categoryColor = getCategoryColor(record.category);

              return (
                <TableRow
                  key={record.id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': {
                      py: 1.5,
                      borderColor: 'divider',
                      verticalAlign: 'top',
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      icon={getCategoryIcon(record.category)}
                      label={record.category || 'Unknown'}
                      size="small"
                      color={categoryColor}
                      variant={categoryColor === 'default' ? 'outlined' : 'filled'}
                      sx={{ fontWeight: 600, maxWidth: '100%' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                      {record.name || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <SettingValueEditor record={record} />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {truncateText(record.description, 120)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {record.modifiedBy || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(record.lastModified)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const SettingsListContent = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage application-wide configuration and controls.
        </Typography>
      </Box>

      <FilterBar />
      <SettingsTable />
    </Box>
  );
};

export const SettingsList = () => (
  <List
    perPage={10}
    sort={{ field: 'name', order: 'ASC' }}
    sx={{
      width: '100%',
      '& .RaList-content': {
        width: '100%',
      },
    }}
  >
    <SettingsListContent />
  </List>
);

export default SettingsList;