import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OrderServiceProps } from './OrderServicePage.tsx';
import { addItem } from '../../../redux/slices/shoppingCartSlice.ts';
import { useDispatch } from 'react-redux';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';

function ServiceDescription({
  service,
  timeSlots,
  selectedTime,
  setSelectedTime,
}: {
  service: ServiceProps;
  timeSlots: OrderServiceProps[];
  selectedTime: string;
  setSelectedTime: (x: string) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAddToCart = (slot: OrderServiceProps) => {
    dispatch(addItem(slot.id));
    setSelectedTime(slot.id);
  };

  return (
    <Grid item xs={12} md={6}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.primary.border}`,
          p: '15px 20px',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <img
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                marginTop: 5,
                objectFit: 'cover',
              }}
              src={service.image}
              alt={service.name}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Typography
                variant="h1"
                sx={{ fontWeight: '600', fontSize: '1.5em' }}
              >
                {service.name}
              </Typography>
              <div
                style={{
                  fontSize: '0.8em',
                  fontWeight: '600',
                  borderRadius: '4px',
                  backgroundColor: service.disabled
                    ? theme.palette.secondary.error
                    : theme.palette.primary.main,
                  color: 'white',
                  padding: '2px 4px',
                  width: 'fit-content',
                }}
              >
                {service.disabled ? 'Unavailable' : 'Available'}
              </div>
            </div>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ margin: '10px 0px', fontSize: '1em' }}
          >
            {service.description}
          </Typography>
          <div
            style={{
              marginTop: '20px',
              border: `1px solid ${theme.palette.primary.border}`,
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: theme.palette.background.default,
              borderRadius: '10px',
              padding: '20px 0',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center' }}>
              <p>$</p>
              <div>
                <p>Price</p>
                <p>{service.price}</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center' }}>
              <p>$</p>
              <div>
                <p>Duration</p>
                <p>{service.duration}</p>
              </div>
            </div>
          </div>
          <Button
            fullWidth
            onClick={() => {
              const slot = timeSlots.find((s) => s.id === selectedTime);
              if (slot) handleAddToCart(slot);
            }}
            disabled={!selectedTime}
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: '600',
            }}
          >
            {t('pages.service_schedule.addToCart')}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ServiceDescription;
