import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from "@mui/material";
import { Room } from "../../../types/room";
import { axiosAuthApi } from "../../../middleware/axiosApi";

interface Props {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onAddToCart?: (room: Room, from: string, to: string) => void; // optional handler
}

const ReservationDialog: React.FC<Props> = ({ open, onClose, room, onAddToCart }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut || !room) {
      setStatus("idle");
      return;
    }

    const fetchAvailability = async () => {
      setStatus("checking");
      setError(null);
      try {
        const res = await axiosAuthApi.get(`/rooms/available`, {
          params: { from: checkIn, to: checkOut },
        });

        const availableRooms: Room[] = res.data;
        const isAvailable = availableRooms.some(r => r.id === room.id);

        setStatus(isAvailable ? "available" : "unavailable");
      } catch (err) {
        console.error(err);
        setError("Failed to check availability.");
        setStatus("idle");
      }
    };

    fetchAvailability();
  }, [checkIn, checkOut, room]);

  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Complete Your Reservation</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {room.standard.replace(/_/g, " ").toLowerCase().replace(/^\w/, c => c.toUpperCase())} – ${room.pricePerNight} per night
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Check-in Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <TextField
            label="Check-out Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </Box>

        <TextField
          label="Special Requests"
          placeholder="Any special requirements or preferences..."
          multiline
          rows={3}
          fullWidth
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {status === "available" && (
          <Alert severity="success" sx={{ mt: 2 }}>This room is available ✅</Alert>
        )}
        {status === "unavailable" && (
          <Alert severity="warning" sx={{ mt: 2 }}>This room is not available for selected dates ❌</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={status !== "available"}
          onClick={() => {
            if (room && checkIn && checkOut && onAddToCart) {
              onAddToCart(room, checkIn, checkOut);
              onClose();
            }
          }}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;
