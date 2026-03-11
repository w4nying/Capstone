import { Box, Card, CardContent, CardHeader, Chip, LinearProgress, Typography } from '@mui/material';

type ServerStatusWidgetProps = {
  servers: any[];
  embedded?: boolean;
};

const ServerStatusWidgetContent = ({ servers }: { servers: any[] }) => {
  return (
    <Box>
      {servers.map((server: any) => (
        <Box
          key={server.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {server.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CPU: {server.cpu}% · RAM: {server.memory}% · Disk: {server.disk}%
            </Typography>
          </Box>

          <Chip
            label={server.status}
            color={server.status === 'online' ? 'success' : 'error'}
            size="small"
          />
        </Box>
      ))}
    </Box>
  );
};

export const ServerStatusWidget = ({
  servers,
  embedded = false,
}: ServerStatusWidgetProps) => {
  if (embedded) {
    return (
      <Box sx={{ height: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Live infrastructure overview
        </Typography>
        <ServerStatusWidgetContent servers={servers} />
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Server Status Overview" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Live infrastructure overview
        </Typography>
        <ServerStatusWidgetContent servers={servers} />
      </CardContent>
    </Card>
  );
};