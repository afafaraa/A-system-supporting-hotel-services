import {
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import { roomOptions } from '../../home/HomePage.tsx';
import RoomCard from './RoomCard.tsx';

export default function HotelBookingPage() {
  const theme = useTheme();

  return (
    <main>
      <SectionWrapper
        sx={{ borderRadius: 3, padding: 3 }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
          My Room Reservations
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Your current and past room bookings
        </Typography>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: '7px',
            border: `1px solid ${theme.palette.divider}`,
            padding: '15px 20px',
            alignItems: 'center',
          }}
        >
          <div>
            <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
              Deluxe Room
            </Typography>
            <Typography fontSize="12px" color="text.secondary">
              31/07/2025 – 02/08/2025
            </Typography>
            <Typography fontSize="12px" color="text.secondary">
              2 guests | $540 total
            </Typography>
          </div>

          <Typography
            variant="caption"
            sx={{
              backgroundColor: `${theme.palette.primary.main}`,
              color: `${theme.palette.primary.contrastText}`,
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: '8px',
            }}
          >
            Confirmed
          </Typography>
        </div>
      </SectionWrapper>

      <SectionWrapper
        sx={{
          borderRadius: 3, padding: 3, mt: 3,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
          Reserve a Room
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Book the perfect accommodation for your stay
        </Typography>

        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
          {roomOptions.map((room, index) => (
            <Grid size={1} key={index}>
              <RoomCard room={room} onReserve={() => {}} size="small"/>
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>
    </main>
  );
}
