import { 
    List, 
    Datagrid, 
    TextField, 
    DateField, 
    ChipField, 
    TextInput, 
    SelectInput,
    FunctionField 
} from 'react-admin';
import { Chip } from '@mui/material';

const reportFilters = [
    <TextInput source="title" label="Search Reports" alwaysOn />,
    <SelectInput source="type" choices={[
        { id: 'Project Update', name: 'Project Update' },
        { id: 'Technical Analysis', name: 'Technical Analysis' },
        { id: 'User Research', name: 'User Research' },
        { id: 'Technical Specification', name: 'Technical Specification' },
    ]} />,
    <SelectInput source="status" choices={[
        { id: 'published', name: 'Published' },
        { id: 'draft', name: 'Draft' },
        { id: 'archived', name: 'Archived' },
    ]} />,
];

// Custom chip for status colors
const StatusChip = (props: any) => (
    <FunctionField
        {...props}
        render={(record: any) => {
            const colors = {
                published: 'success',
                draft: 'warning',
                archived: 'default'
            };
            return (
                <Chip 
                    label={record.status} 
                    color={colors[record.status as keyof typeof colors] as any || 'default'} 
                    size="small" 
                    variant={record.status === 'draft' ? 'outlined' : 'filled'}
                />
            );
        }}
    />
);

export const ReportsList = () => (
    <List 
        filters={reportFilters} 
        sort={{ field: 'date', order: 'DESC' }}
        title="Technical Reports Repository"
    >
        <Datagrid rowClick="show">
            <TextField source="title" sx={{ fontWeight: 600 }} />
            <ChipField source="type" size="small" />
            <StatusChip label="Status" />
            <TextField source="author" />
            <TextField source="department" label="Dept" />
            <DateField source="date" />
        </Datagrid>
    </List>
);