import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';

export default function HotelBookingPage() {
  const theme = useTheme();

  return (
    <main style={{ width: '100%', marginTop: '40px', marginBottom: '40px' }}>
      <SectionWrapper
        sx={{ borderRadius: '10px', padding: '15px 20px 25px 20px' }}
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
            border: `1px solid ${theme.palette.primary.border}`,
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
              padding: '2px 5px',
              borderRadius: '5px',
            }}
          >
            Confirmed
          </Typography>
        </div>
      </SectionWrapper>

      <SectionWrapper
        sx={{
          borderRadius: '10px',
          padding: '15px 20px 25px 20px',
          marginTop: '20px',
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
          Reserve a Room
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Book the perfect accommodation for your stay
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              type: 'Standard Room',
              price: 80,
              status: 'Available',
            },
            {
              type: 'Deluxe Room',
              price: 120,
              status: 'Available',
            },
            {
              type: 'Exclusive Suite',
              price: 220,
              status: 'Available',
            },
          ].map((room, index) => (
            <Grid flexGrow={1} item xs={12} md={3} key={index}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '15px 10px'
                }}
              >
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                      {room.type}
                    </Typography>
                    <Typography
                      color={theme.palette.primary.contrastText}
                      backgroundColor={theme.palette.primary.main}
                      fontSize="12px"
                      fontWeight={600}
                      padding="2px 5px"
                      borderRadius="5px"
                    >
                      {room.status}
                    </Typography>
                  </div>
                  <Divider sx={{ my: 1 }} />

                  <Typography sx={{ fontWeight: 600, fontSize: '20px', color: `${theme.palette.primary.main}` }}>
                    {room.price}$
                  </Typography>
                  <Typography fontSize='12px' color="text.secondary">
                    Up to 2 guests per night
                  </Typography>

                  <Typography
                    sx={{ mt: 2, fontWeight: 500 }}
                  >
                    Amenities:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    (Few listed)
                  </Typography>
                  <Button
                    fullWidth
                    sx={{ borderRadius: '5px', mt: '15px' }}
                  >
                    Reserve Room
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>
    </main>
  );
}
