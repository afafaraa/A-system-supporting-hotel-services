import { RequestedServiceProps } from './BookedServicesPage.tsx';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function mapStatusToLabel(status?: string) {
  if (!status) return 'Unknown';
  switch (status) {
    case 'REQUESTED':
      return 'Pending';
    case 'ACTIVE':
      return 'Confirmed';
    case 'IN_PROGRESS':
      return 'In progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELED':
      return 'Canceled';
    default:
      return status;
  }
}

function ServiceItem({
  item,
  index,
}: {
  item: RequestedServiceProps;
  index: number;
  fetchData?: () => void;
}) {
  const theme = useTheme();

  const statusColor: Record<string, string> = {
    CANCELED: theme.palette.calendar?.CANCELED || '#666',
    ACTIVE: theme.palette.calendar?.ACTIVE || '#f5a623',
    REQUESTED: theme.palette.calendar?.REQUESTED || '#8e44ad',
    COMPLETED: theme.palette.calendar?.COMPLETED || '#27ae60',
    IN_PROGRESS: theme.palette.calendar?.AVAILABLE || '#3498db',
  };

  const badgeBg = statusColor[item.status] || theme.palette.primary.main;

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{
        borderRadius: '10px',
        mb: 1,
        border: `1px solid ${theme.palette.primary.border}`,
        p: '10px 15px'
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comforting {item.name.toLowerCase()} delivered straight to you
            </Typography>
          </Box>
          <Chip
            label={mapStatusToLabel(item.status)}
            size="small"
            sx={{
              backgroundColor: badgeBg,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              borderRadius: '5px',
            }}
          />
        </Box>

        <Box display="flex" gap={3} alignItems="center" my={2} color={theme.palette.primary.dark}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              {new Date(item.datetime).toLocaleDateString()}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >
            <AccessTime fontSize="small" />
            <Typography variant="body2">
              {new Date(item.datetime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>

        {item.specialRequests && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            <strong>Special requests:</strong> {item.specialRequests}
          </Typography>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize='20px' fontWeight={700} color={theme.palette.primary.main}>
            {item.price}$
          </Typography>
          <Typography variant="body2" color="text.secondary">
            30 minutes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;
