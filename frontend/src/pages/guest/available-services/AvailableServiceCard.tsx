import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme, Chip,
} from '@mui/material';
import StarRating from './StarRating.tsx';
import { useNavigate } from 'react-router-dom';
import { Rating } from '../../../types';
import { useTranslation } from 'react-i18next';

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

          <Button
            onClick={() => navigate(`/service-schedule/${service.id}`, { state: service })}
            fullWidth
            sx={{ marginTop: 2 }}
            variant="contained"
            size="small"
          >
            {t('pages.available_services.bookNow')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AvailableServiceCard;
