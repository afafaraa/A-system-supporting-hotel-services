import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (deleteOption: number) => Promise<void>;
};

export default function ServiceDeleteModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [deleteOption, setDeleteOption] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(deleteOption);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          p: 2,
          maxHeight: "50vh",
          position: "relative",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Delete sx={{ mr: 1, verticalAlign: "middle" }} />
          <Typography variant="h5" fontWeight="bold">
            Delete Service
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Are you sure you want to delete this service? <br />
          This action cannot be undone.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <RadioGroup
          value={deleteOption}
          onChange={(e) => setDeleteOption(parseInt(e.target.value))}
        >
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                color="text.primary"
                fontWeight="bold"
              >
                Delete all bookings
              </Typography>
            }
          />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                color="text.primary"
                fontWeight="bold"
              >
                Delete only available bookings
              </Typography>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
