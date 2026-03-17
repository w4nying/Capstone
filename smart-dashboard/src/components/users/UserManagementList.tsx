import {
  Datagrid,
  List,
  TextField,
  EmailField,
  FunctionField,
  SearchInput,
  SelectInput,
  TopToolbar,
  ExportButton,
  FilterButton,
  useRefresh,
  useNotify,
  useUpdate,
} from 'react-admin';
import { Chip, Stack, Switch, Tooltip } from '@mui/material';

const roleChoices = [
  { id: 'admin', name: 'Admin' },
  { id: 'officer', name: 'Officer' },
  { id: 'associate', name: 'Associate' },
];

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'locked', name: 'Locked' },
  { id: 'pending', name: 'Pending' },
];

const departmentChoices = [
  { id: 'IT & Systems', name: 'IT & Systems' },
  { id: 'Data & Technology', name: 'Data & Technology' },
  { id: 'Cybersecurity', name: 'Cybersecurity' },
  { id: 'Operations', name: 'Operations' },
];

const userFilters = [
  <SearchInput
    key="q"
    source="q"
    alwaysOn
    placeholder="Search by..."
  />,
  <SelectInput
    key="role"
    source="role"
    label="Role"
    choices={roleChoices}
    emptyText="All"
    alwaysOn
  />,
  <SelectInput
    key="status"
    source="status"
    label="Status"
    choices={statusChoices}
    emptyText="All"
    alwaysOn
  />,
  <SelectInput
    key="department"
    source="department"
    label="Department"
    choices={departmentChoices}
    emptyText="All"
    alwaysOn
  />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'locked':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'default';
  }
};

const StatusToggle = ({ record }: { record?: any }) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [update, { isPending }] = useUpdate();

  if (!record) return null;

  const isActive = record.status === 'active';

  const handleChange = () => {
    const nextIsActive = !isActive;

    update(
      'users',
      {
        id: record.id,
        data: {
          ...record,
          status: nextIsActive ? 'active' : 'inactive',
          isLoggedIn: nextIsActive ? record.isLoggedIn : false,
        },
        previousData: record,
      },
      {
        onSuccess: () => {
          notify(
            nextIsActive
              ? `${record.fullName || record.username} activated`
              : `${record.fullName || record.username} deactivated`,
            { type: 'success' }
          );
          refresh();
        },
        onError: () => {
          notify('Unable to update user status', { type: 'error' });
        },
      }
    );
  };

  return (
    <Tooltip title={isActive ? 'Deactivate user' : 'Activate user'}>
      <Switch
        checked={isActive}
        onChange={handleChange}
        disabled={isPending}
        size="small"
        sx={{
            // ON state (Active → green)
            '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#2e7d32', // green thumb
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#2e7d32', // green track
            opacity: 1,
            },

            // OFF state (Inactive → red)
            '& .MuiSwitch-switchBase': {
            color: '#d32f2f', // red thumb
            },
            '& .MuiSwitch-track': {
            backgroundColor: '#d32f2f', // red track
            opacity: 0.5,
            },
        }}
        />
    </Tooltip>
  );
};

export const UserManagementList = () => {
  return (
    <List
      filters={userFilters}
      actions={<ListActions />}
      perPage={10}
      sort={{ field: 'id', order: 'ASC' }}
    >
      <Datagrid bulkActionButtons={false} rowClick={false}>
        <TextField source="id" />
        <TextField source="username" />
        <TextField source="fullName" label="Full Name" />
        <EmailField source="email" />
        <TextField source="role" />
        <FunctionField
          label="Department"
          render={(record: any) => record.department || '-'}
        />
        <FunctionField
            label="Status"
            render={(record: any) => {
                const isActive = record.status === 'active';

                return (
                <Chip
                    label={isActive ? 'Active' : 'Inactive'}
                    color={isActive ? 'success' : 'error'}
                    size="small"
                    variant={isActive ? 'filled' : 'outlined'}
                    sx={{
                    fontWeight: 500,
                    }}
                />
                );
            }}
        />
        <FunctionField
            label=""
            render={(record: any) => (
                <Stack direction="row" spacing={1}>
                <StatusToggle record={record} />
                </Stack>
            )}
            />
      </Datagrid>
    </List>
  );
};