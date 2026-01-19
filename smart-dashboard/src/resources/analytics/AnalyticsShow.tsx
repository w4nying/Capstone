import { 
    Show, 
    SimpleShowLayout, 
    TextField, 
    NumberField, 
    DateField, 
    TopToolbar,
    ListButton
} from 'react-admin';
import { Grid, Card, CardContent, Typography, Box, Divider, Alert, Chip } from '@mui/material';
import { Speed, TrackChanges, Assessment } from '@mui/icons-material';

const AnalyticsShowActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const AnalyticsShow = () => (
    <Show actions={<AnalyticsShowActions />}>
        <SimpleShowLayout>
            <Box sx={{ width: '100%', mb: 2 }}>
                <Grid container spacing={3}>
                    {/* Header Section */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="overline" color="text.secondary">METRIC ANALYSIS</Typography>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                <TextField source="name" />
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <ChipField source="category" sx={{ mr: 1 }} />
                                <ChipField source="status" variant="outlined" />
                            </Box>
                        </Box>
                        <Divider />
                    </Grid>

                    {/* KPI Cards */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Speed color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary">CURRENT VALUE</Typography>
                                </Box>
                                <NumberField 
                                    source="value" 
                                    options={{ maximumFractionDigits: 2 }} 
                                    sx={{ fontSize: '2.5rem', fontWeight: 500, color: '#1565c0' }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrackChanges color="secondary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary">TARGET GOAL</Typography>
                                </Box>
                                <NumberField 
                                    source="target" 
                                    sx={{ fontSize: '2.5rem', fontWeight: 500, color: '#7b1fa2' }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Assessment color="action" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary">PERFORMANCE GAP</Typography>
                                </Box>
                                <Typography variant="h5" sx={{ mt: 1 }}>
                                    <TextField source="trend" />
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Last updated: <DateField source="date" showTime />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Description Section */}
                    <Grid item xs={12}>
                        <Alert severity="info" icon={<Assessment />}>
                            <Typography variant="subtitle2" gutterBottom>Metric Description</Typography>
                            <TextField source="description" />
                        </Alert>
                    </Grid>
                </Grid>
            </Box>
        </SimpleShowLayout>
    </Show>
);

// Helper component for chip field used above
const ChipField = (props: any) => <TextField {...props} component={Chip} size="small" label={props.record?.[props.source]} />;