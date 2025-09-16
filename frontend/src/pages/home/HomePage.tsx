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
} from '@mui/material';

function HomePage() {
  const user = useSelector(selectUser);
  const navigation = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    navigateToDashboard(user?.role ?? '', navigation);
  }, [navigation, user?.role]);
  return (
    <main style={{padding: 0, width: '100%'}}>
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
        <Typography sx={{
          fontWeight: '600'
        }} variant="h2">Welcome to Grand Hotel</Typography>
        <Typography sx={{
          fontWeight: '500',
          fontSize: '20px',
          padding: '0 20%'
        }}>
          Experience luxury and comfort in the heart of the city. Our
          world-class service and elegant accommodations await you.
        </Typography>
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
          <Button>Reserve a Room</Button>
          <Button>Contact us</Button>
        </div>
      </Box>

      <Box>
        Rooms
      </Box>

      <Box>
        Contact us
      </Box>
    </main>
  );
}

export default HomePage;
