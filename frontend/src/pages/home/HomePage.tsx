import { Box, Button, Typography, useTheme, Stack, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import { useTranslation } from 'react-i18next';
import LoginDialog from './LoginDialog.tsx';
import { useState } from 'react';
import { Room } from '../../types/room.ts';
import RoomCard from '../guest/hotel-booking/RoomCard.tsx';

export const roomOptions: Room[] = [
  {
    id: '1',
    type: 'standard',
    price: 120,
    status: 'Available',
    guestsTotal: 2,
    description: 'A comfortable standard room with all the basic amenities for a pleasant stay.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'tv', label: 'Cable TV' },
      { key: 'miniFridge', label: 'Mini Fridge' },
    ],
  },
  {
    id: '2',
    type: 'deluxe',
    price: 180,
    status: 'Available',
    guestsTotal: 3,
    description: 'Spacious deluxe room with premium amenities and elegant furnishings for a luxurious experience.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'tv', label: 'Smart TV' },
      { key: 'miniBar', label: 'Mini Bar' },
      { key: 'more', label: '+2 more' },
    ],
  },
  {
    id: '3',
    type: 'exclusive',
    price: 350,
    status: 'Available',
    guestsTotal: 4,
    description: 'A top-tier exclusive suite with premium facilities, ideal for a luxurious stay or business trip.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'tv', label: 'Smart TV' },
      { key: 'miniBar', label: 'Full Bar' },
      { key: 'more', label: '+4 more' },
    ],
  },
];

function HomePage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);

  return (
    <main style={{ padding: 0, width: '100%' }}>
      <LoginDialog open={openLoginDialog} setOpen={setOpenLoginDialog} />
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
          {t('pages.home.welcomeTitle')}
        </Typography>
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '20px',
            padding: { xs: '0 10%', md: '0 20%' },
          }}
        >
          {t('pages.home.welcomeSubtitle')}
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button
            sx={{
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              padding: '6px 14px',
            }}
            onClick={() =>
              document
                .getElementById('reserve-room')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('pages.home.reserveRoom')}
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
            {t('pages.home.contactUs')}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          padding: '60px 20px',
          backgroundColor: theme.palette.background.default,
        }}
        id="reserve-room"
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: '600', marginBottom: '10px' }}
        >
          {t('pages.home.roomsTitle')}
        </Typography>
        <Typography
          align="center"
          sx={{ color: theme.palette.text.secondary, marginBottom: '40px' }}
        >
          {t('pages.home.roomsSubtitle')}
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 2, lg: 3 }}
          sx={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          {roomOptions.map((room, index) => (
            <Grid sx={{ flexGrow: 1 }} size={1} key={index}>
              <RoomCard room={room} onReserve={() => setOpenLoginDialog(true)} size="medium"/>
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
                  backgroundColor: theme.palette.primary.main,
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                <RoomServiceIcon />
              </Box>
              {t('pages.home.footerTitle')}
            </Typography>
            <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>
              {t('pages.home.footerDesc')}
            </Typography>
          </Grid>

          <Grid size={1}>
            <Typography>{t('pages.home.contactInfo')}</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationOnIcon color="secondary" /> {t('pages.home.address')}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PhoneIcon color="secondary" /> {t('pages.home.phone')}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon color="secondary" /> {t('pages.home.email')}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={1}>
            <Typography>{t('pages.home.services')}</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <RoomServiceIcon color="secondary" />{' '}
                {t('pages.home.serviceDining')}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <DirectionsCarIcon color="secondary" />{' '}
                {t('pages.home.serviceTransport')}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SpaIcon color="secondary" /> {t('pages.home.serviceSpa')}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SportsTennisIcon color="secondary" />{' '}
                {t('pages.home.serviceRecreation')}
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
            {t('pages.home.rights')}
          </Typography>
        </Box>
      </Box>
    </main>
  );
}

export default HomePage;
