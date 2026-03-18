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
  CheckCircle,
  InsertDriveFileOutlined,
  Schedule,
} from '@mui/icons-material';
import { useMemo } from 'react';

type ReportRecord = {
  id: string | number;
  title?: string;
  type?: string;
  status?: string;
  author?: string;
  department?: string;
  date?: string;
  summary?: string;
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

const getStatusColor = (
  status?: string
): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch ((status || '').toLowerCase()) {
    case 'published':
      return 'success';
    case 'draft':
      return 'warning';
    case 'review':
    case 'pending':
      return 'info';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'published':
      return <CheckCircle fontSize="small" />;
    case 'draft':
      return <Schedule fontSize="small" />;
    default:
      return <InsertDriveFileOutlined fontSize="small" />;
  }
};

const FilterBar = () => {
  const { filterValues, setFilters, sort, setSort } = useListContext<ReportRecord>();

  const currentFilters = useMemo(
    () => ({
      q: String(filterValues?.q ?? ''),
      type: String(filterValues?.type ?? ''),
      status: String(filterValues?.status ?? ''),
      department: String(filterValues?.department ?? ''),
    }),
    [filterValues]
  );

  const handleClear = () => {
    setFilters({});
    setSort({ field: 'date', order: 'DESC' });
  };

  return (
    <Box
      sx={{
        mb: 2.5,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        useFlexGap
        flexWrap="wrap"
      >
        <TextField
          label="Search reports"
          placeholder="Search title, author, summary..."
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
            flex: 1.8,
          }}
        />

        <TextField
          select
          label="Type"
          value={currentFilters.type}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              type: e.target.value,
            })
          }
          size="small"
          sx={{
            minWidth: 180,
            flex: 1,
          }}
        >
          <MenuItem value="">All types</MenuItem>
          <MenuItem value="Project Update">Project Update</MenuItem>
          <MenuItem value="Technical Analysis">Technical Analysis</MenuItem>
          <MenuItem value="User Research">User Research</MenuItem>
          <MenuItem value="Technical Specification">Technical Specification</MenuItem>
          <MenuItem value="Quarterly">Quarterly</MenuItem>
          <MenuItem value="Technical Review">Technical Review</MenuItem>
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
            minWidth: 150,
            flex: 1,
          }}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
        </TextField>

        <TextField
          select
          label="Department"
          value={currentFilters.department}
          onChange={(e) =>
            setFilters({
              ...filterValues,
              department: e.target.value,
            })
          }
          size="small"
          sx={{
            minWidth: 220,
            flex: 1.2,
          }}
        >
          <MenuItem value="">All departments</MenuItem>
          <MenuItem value="Data & Technology Architecture">
            Data & Technology Architecture
          </MenuItem>
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
            minWidth: 170,
            flex: 1,
          }}
        >
          <MenuItem value="date|DESC">Date (Newest)</MenuItem>
          <MenuItem value="date|ASC">Date (Oldest)</MenuItem>
          <MenuItem value="title|ASC">Title (A-Z)</MenuItem>
          <MenuItem value="title|DESC">Title (Z-A)</MenuItem>
          <MenuItem value="author|ASC">Author (A-Z)</MenuItem>
          <MenuItem value="author|DESC">Author (Z-A)</MenuItem>
          <MenuItem value="status|ASC">Status (A-Z)</MenuItem>
          <MenuItem value="status|DESC">Status (Z-A)</MenuItem>
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

const ReportsTable = () => {
  const { data, isPending } = useListContext<ReportRecord>();

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
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          No reports found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or search terms.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Table
        sx={{
          width: '100%',
          minWidth: 980,
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
                <TableCell sx={{ width: '15%' }}>Title</TableCell>
                <TableCell sx={{ width: '15%' }}>Type</TableCell>
                <TableCell sx={{ width: '12%' }}>Status</TableCell>
                <TableCell sx={{ width: '10%' }}>Author</TableCell>
                <TableCell sx={{ width: '12%' }}>Department</TableCell>
                <TableCell sx={{ width: '18%' }}>Date</TableCell>
                <TableCell sx={{ width: '17%' }}>Summary</TableCell>
                <TableCell align="right" sx={{ width: '10%' }}>
                Action
                </TableCell>
            </TableRow>
            </TableHead>

        <TableBody>
          {data.map((record) => {
            const statusColor = getStatusColor(record.status);

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
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {record.title || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  {record.type ? (
                    <Chip
                      label={record.type}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        maxWidth: '100%',
                      }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    icon={getStatusIcon(record.status)}
                    label={record.status || 'Unknown'}
                    size="small"
                    color={statusColor}
                    variant={statusColor === 'default' ? 'outlined' : 'filled'}
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      maxWidth: '100%',
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {record.author || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {record.department || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                    <Typography
                        variant="body2"
                        sx={{
                        whiteSpace: 'nowrap',
                        minWidth: 140,
                        }}
                    >
                        {formatDateTime(record.date)}
                    </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    {truncateText(record.summary, 100)}
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
  );
};

const ReportsListContent = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage report records.
        </Typography>
      </Box>

      <FilterBar />
      <ReportsTable />
    </Box>
  );
};

export const ReportsList = () => (
  <List
    perPage={10}
    sort={{ field: 'date', order: 'DESC' }}
    sx={{
      width: '100%',
      '& .RaList-content': {
        width: '100%',
      },
    }}
  >
    <ReportsListContent />
  </List>
);