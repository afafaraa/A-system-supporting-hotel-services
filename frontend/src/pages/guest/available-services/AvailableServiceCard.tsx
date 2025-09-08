import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import StarRating from './StarRating.tsx';
import { useNavigate } from 'react-router-dom';

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

export type Rating = {
  fullName: string;
  rating: number;
  comment: string;
};

function AvailableServiceCard({ service }: { service: ServiceProps }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.primary.border}`,
        borderRadius: '10px',
        minHeight: '40vh',
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
                sx={{ fontWeight: 600, fontSize: { xs: '1.9em', sm: '1.2em' } }}
                variant="h6"
              >
                {service.name}
              </Typography>
              <StarRating rating={service.rating} />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '1em', sm: '0.8em' },
              margin: '20px 0',
              color: theme.palette.text.secondary,
            }}
          >
            {service.description}
          </Typography>
        </Box>

        {/* BOTTOM */}
        <Box>
          <Box
            sx={{
              fontSize: { xs: '1.3em', sm: '1em' },
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '10px',
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
              {service.duration}min
            </Box>

            <Box
              sx={{
                fontWeight: 500,
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.secondary.success,
                padding: '3px 5px',
                fontSize: '0.8em',
                borderRadius: '5px',
              }}
            >
              {service.disabled ? 'Unavailable' : 'Available'}
            </Box>
          </Box>

          <Button onClick={() => navigate(`/service-schedule/${service.id}`)} fullWidth sx={{ padding: '2px', marginTop: 2 }}>
            Book now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AvailableServiceCard;
