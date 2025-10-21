import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

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
      <CancelIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your payment was cancelled. Your cart items are still saved.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/guest/dashboard')}>
          Go to Dashboard
        </Button>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentCancelPage;
