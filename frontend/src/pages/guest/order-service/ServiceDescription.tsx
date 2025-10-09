import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OrderServiceProps } from './OrderServicePage.tsx';
import { addItem } from '../../../redux/slices/shoppingCartSlice.ts';
import { useDispatch } from 'react-redux';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import Chip from "@mui/material/Chip";

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
    dispatch(addItem({ id: slot.id, type: 'SERVICE' }));
    setSelectedTime(slot.id);
  };

  return (
      <Card
        sx={{
          borderRadius: 2,
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
              <Chip color={service.disabled ? 'error' : 'primary'} size='small'
                    sx={{borderRadius: '8px', width: 'fit-content'}}
                    label={service.disabled
                      ? t('pages.order_service.unavailable')
                      : t('pages.order_service.available')
                    }
              >
              </Chip>
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
              margin: '20px 0',
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: theme.palette.background.default,
              borderRadius: '10px',
              padding: '30px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 500, fontSize: '24px' }}>$</p>
              <div style={{ margin: '0 10px', textAlign: 'center' }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: '20px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t('pages.order_service.price')}
                </p>
                <p style={{ fontWeight: 600 }}>{service.price}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 500, fontSize: '24px' }}><TimelapseIcon fontSize='inherit' /></p>
              <div style={{ margin: '0 10px', textAlign: 'center' }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: '20px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t('pages.order_service.duration')}
                </p>
                <p style={{ fontWeight: 600 }}>{service.duration} min </p>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
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
            {t('pages.order_service.addToCart')}
          </Button>
        </CardContent>
      </Card>
  );
}

export default ServiceDescription;
