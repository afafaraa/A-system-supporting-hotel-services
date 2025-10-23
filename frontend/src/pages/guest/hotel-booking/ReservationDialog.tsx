import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Room } from '../../../types/room';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { useDispatch } from 'react-redux';
import { addReservation } from '../../../redux/slices/reservationsCartSlice.ts';

function ReservationDialog({
  open,
  onClose,
  room,
}: {
  open: boolean;
  onClose: () => void;
  room: Room | null;
}) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleAddToCart = (room: Room) => {
    dispatch(
      addReservation({
        id: room.number,
        checkIn: checkIn,
        checkOut: checkOut,
        guestCount: guestCount,
      })
    );
  };

  useEffect(() => {
    if (!checkIn || !checkOut || !room) {
      setStatus('idle');
      return;
    }

    const fetchAvailability = async () => {
      setStatus('checking');
      setError(null);
      try {
        const res = await axiosAuthApi.get(
          `/rooms/${room.number}/availability`,
          {
            params: { from: checkIn, to: checkOut },
          }
        );

        const isAvailable = res.data.available;
        setStatus(isAvailable ? 'available' : 'unavailable');
      } catch (err) {
        console.error(err);
        setError('Failed to check availability.');
        setStatus('idle');
      }
    };

    fetchAvailability();
  }, [checkIn, checkOut, room]);

  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Complete Your Reservation
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {room.standard.name
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase())}{' '}
         Room – ${room.pricePerNight} per night
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Check-in Date"
            type="date"
            fullWidth
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            fullWidth
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TextField
          label="Number of Guests"
          type="number"
          fullWidth
          value={guestCount}
          onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Special Requests"
          placeholder="Any special requirements or preferences..."
          multiline
          rows={3}
          fullWidth
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {status === 'available' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            This room is available
          </Alert>
        )}
        {status === 'unavailable' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This room is not available for selected dates
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={status !== 'available'}
          onClick={() => {
            if (room && checkIn && checkOut) {
              handleAddToCart(room);
              onClose();
            }
          }}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReservationDialog;
