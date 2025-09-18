import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import navigateToDashboard from '../../utils/navigateToDashboard.ts';
import { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import RoomServiceIcon from '@mui/icons-material/RoomService';

const roomOptions = [
  {
    title: 'Standard Room',
    price: 120,
    description: 'Comfortable room with essential amenities',
    guests: 2,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Cable TV' },
      { icon: <RestaurantIcon />, label: 'Mini Fridge' },
    ],
  },
  {
    title: 'Deluxe Room',
    price: 180,
    description: 'Spacious room with premium amenities and city view',
    guests: 3,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Smart TV' },
      { icon: <LocalBarIcon />, label: 'Mini Bar' },
      { label: '+2 more' },
    ],
  },
  {
    title: 'Executive Suite',
    price: 350,
    description:
      'Luxurious suite with separate living area and premium services',
    guests: 4,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Smart TV' },
      { icon: <LocalBarIcon />, label: 'Full Bar' },
      { label: '+4 more' },
    ],
  },
];

function HomePage() {
  const user = useSelector(selectUser);
  const navigation = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    navigateToDashboard(user?.role ?? '', navigation);
  }, [navigation, user?.role]);

  return (
    <main style={{ padding: 0, width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          padding: '100px 0px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography sx={{ fontWeight: '600' }} variant="h2">
          Welcome to Grand Hotel
        </Typography>
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '20px',
            padding: { xs: '0 10%', md: '0 20%' },
          }}
        >
          Experience luxury and comfort in the heart of the city. Our
          world-class service and elegant accommodations await you.
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button
            sx={{
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              padding: '6px 14px',
            }}
          >
            Reserve a Room
          </Button>
          <Button
            sx={{
              padding: '6px 14px',
            }}
            variant="outlined"
            color="secondary"
          >
            Contact us
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          padding: '60px 20px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: '600', marginBottom: '10px' }}
        >
          Our Rooms & Suites
        </Typography>
        <Typography
          align="center"
          sx={{ color: theme.palette.text.secondary, marginBottom: '40px' }}
        >
          Choose from our carefully designed accommodations, each offering
          comfort, style, and modern amenities.
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 2, lg: 3 }}
          sx={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          {roomOptions.map((room, index) => (
            <Grid sx={{ flexGrow: 1 }} size={1} key={index}>
              <Card sx={{ borderRadius: '10px', height: '100%' }}>
                <CardContent
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <div>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: '600' }}>
                        {room.title}
                      </Typography>
                      <Chip
                        label={`$${room.price}/night`}
                        sx={{
                          backgroundColor: theme.palette.secondary.main,
                          fontWeight: 'bold',
                          borderRadius: '10px',
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        marginTop: '10px',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {room.description}
                    </Typography>
                    <Typography
                      sx={{
                        marginTop: '8px',
                        fontSize: '14px',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Up to {room.guests} guests
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ marginTop: '15px', fontWeight: '600' }}
                    >
                      Amenities
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      flexWrap="wrap"
                      sx={{ marginTop: '10px' }}
                    >
                      {room.amenities.map((amenity, idx) => (
                        <Chip
                          key={idx}
                          // icon={amenity.icon || null}
                          label={amenity.label}
                          sx={{
                            backgroundColor: theme.palette.background.paper,
                          }}
                        />
                      ))}
                    </Stack>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '20px', width: '100%' }}
                  >
                    Reserve Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundColor: '#100D26',
          color: theme.palette.primary.contrastText,
          padding: '80px 0 40px 0',
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          columns={{ xs: 1, sm: 2, md: 3 }}
          sx={{ maxWidth: '1200px', margin: '0 auto', pb: 4 }}
        >
          <Grid size={1}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  backgroundColor: theme.palette.primary.main,
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                <RoomServiceIcon />
              </Box>
              Grand Hotel
            </Typography>
            <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>
              Experience luxury and comfort in the heart of the city with our
              world-class service.
            </Typography>
          </Grid>

          <Grid size={1}>
            <Typography>Contact Info</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationOnIcon color="secondary" /> 123 Grand Avenue, City
                Center
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PhoneIcon color="secondary" /> +1 (555) 123-4567
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon color="secondary" /> reservations@grandhotel.com
              </Typography>
            </Stack>
          </Grid>

          <Grid size={1}>
            <Typography>Services</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <RoomServiceIcon color="secondary" /> Fine Dining & Room Service
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <DirectionsCarIcon color="secondary" /> Transportation &
                Concierge
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SpaIcon color="secondary" /> Spa & Wellness Center
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SportsTennisIcon color="secondary" /> Recreation Facilities
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            pt: 2,
          }}
        >
          <Typography color="text.secondary">
            © 2024 Grand Hotel. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </main>
  );
}

export default HomePage;
