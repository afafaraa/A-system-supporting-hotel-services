import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
  Chip,
  Tooltip,
  Alert,
  useMediaQuery,
} from '@mui/material';
import StarRating from './StarRating.tsx';
import { useNavigate } from 'react-router-dom';
import { Rating } from '../../../types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUserDetails } from '../../../redux/slices/userDetailsSlice.ts';

export type ServiceProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: Rating[];
  duration: number;
  disabled: boolean;
};

function AvailableServiceCard({ service }: { service: ServiceProps }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const userDetails = useSelector(selectUserDetails);

  // Compute disabled state and tooltip message
  const isAccountInactive = !userDetails?.active;
  const isNoRoom = !userDetails?.guestData?.currentReservation.roomNumber;
  const isServiceDisabled = service.disabled;
  const isDisabled = isAccountInactive || isNoRoom || isServiceDisabled;

  let tooltipMsg = '';
  if (isNoRoom) {
    tooltipMsg = t('pages.available_services.tooltip.noRoom');
  } else if (isAccountInactive) {
    tooltipMsg = t('pages.available_services.tooltip.accountInactive');
  } else if (isServiceDisabled) {
    tooltipMsg = t('pages.available_services.tooltip.serviceDisabled');
  }

  const showInlineMsg = isDisabled && isMobile;

  return (
    <Card
      sx={{
        borderRadius: '12px',
        minHeight: '290px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          padding: '25px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
            <img
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                marginTop: 2,
              }}
              src={service.image}
              alt={service.name}
            />
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: { xs: '1.5em', sm: '1.2em' } }}
                variant="h6"
                lineHeight={1.2}
                mb="0.2rem"
              >
                {service.name}
              </Typography>
              <StarRating rating={service.rating} />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '0.95em', md: '0.8em' },
              marginTop: '14px',
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              height: 'calc(1.5em * 3)', // Limit to approx. 3 lines
              overflowY: 'auto',
            }}
          >
            {service.description}
          </Typography>

          {showInlineMsg && (
            <Alert
              severity="warning"
              variant="outlined"
              sx={{ mb: 2, fontSize: '0.9em', borderRadius: '8px' }}
            >
              {tooltipMsg}
            </Alert>
          )}
        </Box>

        <Box>
          <Box
            sx={{
              fontSize: { xs: '1.3em', sm: '1em' },
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '10px',
              alignItems: 'center',
            }}
          >
            <Box sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {service.price.toFixed(2)}$
            </Box>

            <Box
              sx={{
                fontWeight: 600,
                color: theme.palette.text.secondary,
                fontSize: '0.9em',
              }}
            >
              {service.duration} min
            </Box>

            <Chip
              color={service.disabled ? 'error' : 'success'}
              size="small"
              sx={{ borderRadius: '8px' }}
              label={
                service.disabled
                  ? t('pages.available_services.unavailable')
                  : t('pages.available_services.available')
              }
            />
          </Box>

          <Tooltip title={isDisabled ? tooltipMsg : ''} disableHoverListener={!isDisabled}>
            <span>
              <Button
                disabled={isDisabled}
                onClick={() => navigate(`/service-schedule/${service.id}`, { state: service })}
                fullWidth
                sx={{ marginTop: 2 }}
                variant="contained"
                size="small"
              >
                {t('pages.available_services.bookNow')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AvailableServiceCard;
