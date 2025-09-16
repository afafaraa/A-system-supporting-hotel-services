import { useState } from 'react';
import { RequestedServiceProps } from './BookedServicesPage.tsx';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import CancelServiceDialog from './CancelServiceDialog';
import RateServiceDialog from './RateServiceDialog';

function mapStatusToLabel(status?: string, t?: (key: string) => string) {
  if (!status) return t ? t('pages.booked_services.unknown') : 'Unknown';
  switch (status) {
    case 'REQUESTED':
      return t ? t('pages.booked_services.pending') : 'Pending';
    case 'ACTIVE':
      return t ? t('pages.booked_services.confirmed') : 'Confirmed';
    case 'IN_PROGRESS':
      return t ? t('pages.booked_services.inProgress') : 'In progress';
    case 'COMPLETED':
      return t ? t('pages.booked_services.completed') : 'Completed';
    case 'CANCELED':
      return t ? t('pages.booked_services.canceled') : 'Canceled';
    default:
      return status;
  }
}

function ServiceItem({
  item,
  index,
  fetchData,
}: {
  item: RequestedServiceProps;
  index: number;
  fetchData?: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const statusColor: Record<string, string> = {
    CANCELED: theme.palette.calendar?.CANCELED || '#666',
    ACTIVE: theme.palette.calendar?.ACTIVE || '#f5a623',
    REQUESTED: theme.palette.calendar?.REQUESTED || '#8e44ad',
    COMPLETED: theme.palette.calendar?.COMPLETED || '#27ae60',
    IN_PROGRESS: theme.palette.calendar?.AVAILABLE || '#3498db',
  };
  const badgeBg = statusColor[item.status] || theme.palette.primary.main;

  const [openCancel, setOpenCancel] = useState(false);
  const [openRate, setOpenRate] = useState(false);

  return (
    <>
      <Card
        key={index}
        variant="outlined"
        sx={{
          borderRadius: '10px',
          mb: 1,
          border: `1px solid ${theme.palette.primary.border}`,
          p: '10px 15px 0 15px',
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
              label={mapStatusToLabel(item.status, t)}
              size="small"
              sx={{
                backgroundColor: badgeBg,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                borderRadius: '5px',
              }}
            />
          </Box>

          <Box
            display="flex"
            gap={3}
            alignItems="center"
            my={2}
            color={theme.palette.primary.dark}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">
                {new Date(item.datetime).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime fontSize="small" />
              <Typography variant="body2">
                {new Date(item.datetime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
            <Typography variant="body2">30 minutes</Typography>
          </Box>

          {item.specialRequests && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 1 }}
            >
              <strong>{t('pages.booked_services.specialRequests')}:</strong>{' '}
              {item.specialRequests}
            </Typography>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              fontSize="20px"
              fontWeight={700}
              color={theme.palette.primary.main}
            >
              {item.price}$
            </Typography>
            {item.status === 'COMPLETED' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenRate(true)}
                sx={{ padding: '10px 0px' }}
              >
                {t('pages.booked_services.rate')}
              </Button>
            )}
            {item.status === 'REQUESTED' && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenCancel(true)}
                sx={{ padding: '5px 10px' }}
              >
                {t('pages.booked_services.cancel')}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <CancelServiceDialog
        open={openCancel}
        setOpen={setOpenCancel}
        scheduleId={item.id}
        fetchData={fetchData!}
      />
      <RateServiceDialog
        open={openRate}
        setOpen={setOpenRate}
        scheduleId={item.id}
        fetchData={fetchData!}
      />
    </>
  );
}

export default ServiceItem;
