import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme, Chip, Tooltip,
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
  const { t } = useTranslation();
  const userDetails = useSelector(selectUserDetails);

  // Compute disabled state and tooltip message
  const isAccountInactive = !userDetails?.active;
  const isNoRoom = !userDetails?.guestData?.roomNumber;
  const isServiceDisabled = service.disabled;
  const isDisabled = isAccountInactive || isNoRoom || isServiceDisabled;

  let tooltipMsg = '';
  if (isNoRoom) {
    tooltipMsg = 'You need to have an active reservation to book services. Go to Book Hotel Room section to book a room.';
  } else if (isAccountInactive) {
    tooltipMsg = 'Your account is not active. Scan code available on your reservation in hotel reception.';
  } else if (isServiceDisabled) {
    tooltipMsg = 'This service is not available right now. Sorry for the inconvenience';
  }

  return (
    <Card
      sx={{
        borderRadius: '10px',
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
                marginTop: 5,
                objectFit: 'cover',
              }}
              src={service.image}
              alt={service.name}
            />
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: { xs: '1.5em', sm: '1.3em', lg: '1.2em' } }}
                variant="h6"
              >
                {service.name}
              </Typography>
              <StarRating rating={service.rating} />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '1em', sm: '1em', md: '0.8em' },
              margin: '20px 0',
              color: theme.palette.text.secondary,
            }}
          >
            {service.description}
          </Typography>
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

            <Chip color={service.disabled ? 'error' : 'success'} size='small'
                  sx={{borderRadius: '8px'}}
                  label={service.disabled
                    ? t('pages.available_services.unavailable')
                    : t('pages.available_services.available')
                  }
            >
            </Chip>
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
