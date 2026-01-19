import { 
    Show, 
    SimpleShowLayout, 
    TextField, 
    DateField, 
    TopToolbar,
    ListButton
} from 'react-admin';
import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material';
import { Description, Person, CalendarToday, Folder } from '@mui/icons-material';

const ReportsShowActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const ReportsShow = () => (
    <Show actions={<ReportsShowActions />}>
        <SimpleShowLayout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{ mb: 2, borderLeft: '4px solid #1976d2' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                                        <TextField source="title" />
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Chip 
                                            icon={<Folder sx={{ fontSize: 16 }} />} 
                                            label={<TextField source="type" />} 
                                            size="small" 
                                            color="primary" 
                                            variant="outlined" 
                                        />
                                        <Chip 
                                            label={<TextField source="status" />} 
                                            size="small" 
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ minHeight: 300 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Description sx={{ mr: 1 }} /> Executive Summary
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#37474f' }}>
                                <TextField source="summary" />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Metadata</Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    <Person sx={{ fontSize: 14, verticalAlign: 'text-top', mr: 0.5 }} />
                                    AUTHOR
                                </Typography>
                                <TextField source="author" sx={{ fontWeight: 500 }} />
                                <Typography variant="body2" color="text.secondary">
                                    <TextField source="department" />
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    <CalendarToday sx={{ fontSize: 14, verticalAlign: 'text-top', mr: 0.5 }} />
                                    DATE PUBLISHED
                                </Typography>
                                <DateField source="date" showTime />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </SimpleShowLayout>
    </Show>
);