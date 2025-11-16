import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { clearServicesCart } from '../../../redux/slices/servicesCartSlice.ts';
import { clearReservationsCart } from '../../../redux/slices/reservationsCartSlice.ts';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear both carts after successful payment
    dispatch(clearServicesCart());
    dispatch(clearReservationsCart());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: 4,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
        Thank you for your purchase. Your order has been confirmed.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        You will receive a confirmation email shortly.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/guest')}>
          Go to Dashboard
        </Button>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSuccessPage;
