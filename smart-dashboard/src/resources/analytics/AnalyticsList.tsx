import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    DateField, 
    ChipField, 
    TextInput,
    SelectInput,
    useRecordContext,
} from 'react-admin';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { 
    TrendingUp, 
    TrendingDown, 
    Remove,
    CheckCircle
} from '@mui/icons-material';

// Visual component to show progress against project targets
// Added _props to function signature to accept 'label' and other props passed by Datagrid
const TargetProgressField = (_props: any) => {
    const record = useRecordContext();
    if (!record) return null;
    
    // Calculate percentage based on target
    const isTimeMetric = record.name.includes('Time') || record.name.includes('Rate');
    const percent = isTimeMetric 
        ? Math.min((record.target / record.value) * 100, 100) // Lower is better logic placeholder
        : Math.min((record.value / record.target) * 100, 100);
        
    const isTargetMet = isTimeMetric ? record.value <= record.target : record.value >= record.target;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                    variant="determinate" 
                    value={percent} 
                    color={isTargetMet ? "success" : "warning"}
                    sx={{ height: 8, borderRadius: 5, bgcolor: '#e0e0e0' }}
                />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="caption" color="text.secondary">
                    {isTargetMet ? <CheckCircle color="success" sx={{ fontSize: 14 }} /> : `${Math.round(percent)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

const TrendField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record) return null;
    const trend = record[source];

    const config = {
        improving: { icon: <TrendingUp />, color: "success" as const, label: "Improving" },
        degrading: { icon: <TrendingDown />, color: "error" as const, label: "Degrading" },
        stable: { icon: <Remove />, color: "default" as const, label: "Stable" },
        achieved: { icon: <CheckCircle />, color: "success" as const, label: "Goal Met" }
    };

    const status = config[trend as keyof typeof config] || config.stable;

    return (
        <Chip 
            icon={status.icon} 
            label={status.label} 
            size="small" 
            color={status.color} 
            variant="outlined"
            sx={{ border: 'none', fontWeight: 500 }}
        />
    );
};

const analyticsFilters = [
    <TextInput source="name" label="Search Metric" alwaysOn />,
    <SelectInput source="category" choices={[
        { id: 'Performance', name: 'Performance' },
        { id: 'UI Performance', name: 'UI Performance' },
        { id: 'User Experience', name: 'User Experience' },
        { id: 'Backend', name: 'Backend' },
    ]} />,
];

export const AnalyticsList = () => (
    <List 
        filters={analyticsFilters}
        sort={{ field: 'date', order: 'DESC' }}
        title="System Performance & KPIs"
        actions={false} // Read-only view for accuracy
    >
        <Datagrid rowClick="show" bulkActionButtons={false} sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <TextField source="name" label="Metric Name" />
            <ChipField source="category" size="small" />
            
            <NumberField 
                source="value" 
                options={{ maximumFractionDigits: 2 }} 
                sx={{ fontWeight: 'bold', fontSize: '1.1em' }}
            />
            
            <NumberField source="target" label="Target Goal" color="text.secondary" />
            
            <TargetProgressField label="Status vs Target" />
            
            <TrendField source="trend" />
            
            <DateField source="date" showTime={false} />
        </Datagrid>
    </List>
);