import { Box, Button, Typography, Stack, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import LoginDialog from './LoginDialog.tsx';
import { useState, useEffect } from 'react';
import RoomCard from '../guest/hotel-booking/RoomCard.tsx';
import {alpha} from "@mui/material/styles";
import axiosApi from '../../middleware/axiosApi.ts';
import { Room } from '../../types/room.ts';

function HomePage() {
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axiosApi.get('/rooms')
      .then(res => setRooms(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: 0, width: '100%' }}>
      <LoginDialog open={openLoginDialog} setOpen={setOpenLoginDialog} />
      <Box
        bgcolor="primary.main"
        sx={{
          backgroundImage: 'url(/home_page_bg.jpg)',
          backgroundPosition: '50% 75%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
             color='primary.contrastText'
             textAlign='center'
             padding='100px 0px'
             display='flex'
             flexDirection='column'
             gap='20px'
             bgcolor={theme => alpha(theme.palette.primary.main, 0.70)}
             sx={{backdropFilter: 'blur(2px)'}}
        >
          <Typography sx={{ fontWeight: '600' }} variant="h2">
            Welcome to Our Hotel
          </Typography>
          <Typography
            sx={{
              fontWeight: '500',
              fontSize: '20px',
              padding: { xs: '0 10%', md: '0 20%' },
            }}
          >
            Book your stay and enjoy our best rooms and services.
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button
              sx={{
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
                padding: '6px 14px',
              }}
              onClick={() =>
                document
                  .getElementById('reserve-room')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Reserve Room
            </Button>
            <Button
              sx={{
                padding: '6px 14px',
              }}
              variant="outlined"
              color="secondary"
              onClick={() =>
                document
                  .getElementById('contact-us')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Contact Us
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          padding: '60px 20px',
          backgroundColor: 'background.default',
        }}
        id="reserve-room"
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: '600', marginBottom: '10px' }}
        >
          Rooms
        </Typography>
        <Typography
          align="center"
          sx={{ color: 'text.secondary', marginBottom: '40px' }}
        >
          Choose a room for your stay
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 2, lg: 3 }}
          sx={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          {loading ? (
            <Typography>Loading rooms...</Typography>
          ) : (
            (showAll ? rooms : rooms.slice(0, 3)).map((room, index) => (
              <Grid sx={{ flexGrow: 1 }} size={1} key={index}>
                <RoomCard room={room} onReserve={() => setOpenLoginDialog(true)} size="medium"/>
              </Grid>
            ))
          )}
        </Grid>
        {!showAll && !loading && rooms.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => setShowAll(true)}>
              View More
            </Button>
          </Box>
        )}
      </Box>

      <Box
        component="footer"
        sx={{
          backgroundColor: '#100D26',
          color: 'primary.contrastText',
          padding: '40px 20px 40px 20px',
        }}
        id="contact-us"
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
                  backgroundColor: 'primary.main',
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                <RoomServiceIcon />
              </Box>
              Hotel Services
            </Typography>
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>
              Enjoy our dining, spa, and recreation facilities.
            </Typography>
          </Grid>

          <Grid size={1}>
            <Typography>Contact Information</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationOnIcon color="secondary" /> 123 Main St, City
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PhoneIcon color="secondary" /> +48 123 456 789
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon color="secondary" /> info@hotel.com
              </Typography>
            </Stack>
          </Grid>

          <Grid size={1}>
            <Typography>Services</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <RoomServiceIcon color="secondary" /> Dining
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <DirectionsCarIcon color="secondary" /> Transport
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SpaIcon color="secondary" /> Spa
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SportsTennisIcon color="secondary" /> Recreation
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
            © 2024 Hotel. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </main>
  );
}

export default HomePage;
