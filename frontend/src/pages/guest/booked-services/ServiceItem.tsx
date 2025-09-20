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
    CANCELED: theme.palette.calendar?.CANCELED,
    ACTIVE: theme.palette.calendar?.ACTIVE,
    REQUESTED: theme.palette.calendar?.REQUESTED,
    COMPLETED: theme.palette.calendar?.COMPLETED,
    IN_PROGRESS: theme.palette.calendar?.AVAILABLE,
  };

  function mapStatusToLabel(status?: string) {
    if (!status) return t('pages.booked_services.unknown');
    switch (status) {
      case 'REQUESTED':
        return t('pages.booked_services.pending');
      case 'ACTIVE':
        return t('pages.booked_services.confirmed');
      case 'IN_PROGRESS':
        return t('pages.booked_services.inProgress');
      case 'COMPLETED':
        return t('pages.booked_services.completed');
      case 'CANCELED':
        return t('pages.booked_services.canceled');
      default:
        return status;
    }
  }
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
