import { List, ShowButton, useListContext } from 'react-admin';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
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
  PaletteOutlined,
  PsychologyOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import { useMemo } from 'react';

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

const getCategoryColor = (
  category?: string
): 'primary' | 'success' | 'warning' | 'secondary' | 'info' | 'default' => {
  switch ((category || '').toLowerCase()) {
    case 'system':
      return 'primary';
    case 'performance':
      return 'warning';
    case 'security':
      return 'error' as 'default';
    case 'display':
      return 'secondary';
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
    case 'display':
      return <PaletteOutlined fontSize="small" />;
    case 'user experience':
      return <PsychologyOutlined fontSize="small" />;
    case 'visualization':
      return <TuneOutlined fontSize="small" />;
    default:
      return <BuildOutlined fontSize="small" />;
  }
};

const FilterBar = () => {
  const { filterValues, setFilters, sort, setSort } = useListContext<SettingRecord>();

  const currentFilters = useMemo(
    () => ({
      q: String(filterValues?.q ?? ''),
      category: String(filterValues?.category ?? ''),
    }),
    [filterValues]
  );

  const handleClear = () => {
    setFilters({});
    setSort({ field: 'lastModified', order: 'DESC' });
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
          sx={{
            minWidth: 300,
            flex: 1.8,
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
            minWidth: 180,
            flex: 1,
          }}
        >
          <MenuItem value="">All categories</MenuItem>
          <MenuItem value="System">System</MenuItem>
          <MenuItem value="Performance">Performance</MenuItem>
          <MenuItem value="User Experience">User Experience</MenuItem>
          <MenuItem value="Visualization">Visualization</MenuItem>
          <MenuItem value="Security">Security</MenuItem>
          <MenuItem value="Display">Display</MenuItem>
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
            minWidth: 180,
            flex: 1,
          }}
        >
          <MenuItem value="lastModified|DESC">Last Modified (Newest)</MenuItem>
          <MenuItem value="lastModified|ASC">Last Modified (Oldest)</MenuItem>
          <MenuItem value="name|ASC">Name (A-Z)</MenuItem>
          <MenuItem value="name|DESC">Name (Z-A)</MenuItem>
          <MenuItem value="category|ASC">Category (A-Z)</MenuItem>
          <MenuItem value="category|DESC">Category (Z-A)</MenuItem>
          <MenuItem value="modifiedBy|ASC">Modified By (A-Z)</MenuItem>
          <MenuItem value="modifiedBy|DESC">Modified By (Z-A)</MenuItem>
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

const SettingsTable = () => {
  const { data, isPending } = useListContext<SettingRecord>();

  if (isPending) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={56}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Stack>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          No settings found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or search terms.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1280 }}>
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
              <TableCell sx={{ width: '14%' }}>Category</TableCell>
              <TableCell sx={{ width: '20%' }}>Setting Name</TableCell>
              <TableCell sx={{ width: '16%' }}>Value</TableCell>
              <TableCell sx={{ width: '26%' }}>Description</TableCell>
              <TableCell sx={{ width: '12%' }}>Modified By</TableCell>
              <TableCell sx={{ width: '12%' }}>Last Modified</TableCell>
              <TableCell align="right" sx={{ width: '8%' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((record) => {
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
                      sx={{
                        fontWeight: 600,
                        maxWidth: '100%',
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                      {record.name || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {record.value || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.45 }}
                    >
                      {truncateText(record.description, 120)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{record.modifiedBy || '-'}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(record.lastModified)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <ShowButton
                      label="View"
                      record={record}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 72,
                      }}
                    />
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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage application-wide configuration and defaults.
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
    sort={{ field: 'lastModified', order: 'DESC' }}
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