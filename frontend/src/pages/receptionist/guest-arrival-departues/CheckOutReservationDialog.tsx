import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Reservation from "../../../types/reservation.ts";
import {ReservationDetails, ReservationTitle} from "./CommonReservationDialogComponents.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useState} from "react";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";


function CheckOutReservationDialog({reservation, onSuccess, onClose}: {reservation: Reservation | null, onSuccess: (reservation: Reservation) => void, onClose: () => void}) {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.check-out");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  }

  const handleCheckOut = () => {
    if (!reservation) return;
    setError(null);
    axiosAuthApi.patch(`/reservations/${reservation.id}/check-out`)
      .then(res => onSuccess(res.data))
      .catch((error) => setError(tc("error-during-check-out") + ": " + error.message));
  }

  return (
    <Dialog open={reservation !== null} onClose={handleClose}
            sx={{"& .MuiDialog-paper": {p: {xs: 1, sm: 2}, borderRadius: 3}}}>
      {reservation === null ? <></> : <>
        <DialogTitle>
          <ReservationTitle reservation={reservation}/>
        </DialogTitle>
        <DialogContent>
          <ReservationDetails reservation={reservation}/>
        </DialogContent>

        <DialogActions>
          {reservation.status === "CHECKED_IN" ? (
            <>
              {error && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mr: 1, textWrap: "balance" }}
                >
                  {error}
                </Typography>
              )}
              <Button onClick={handleClose} sx={{ color: "text.disabled" }}>
                {tc("cancel")}
              </Button>
              <Button
                onClick={handleCheckOut}
                color="primary"
                variant="contained"
                startIcon={<HowToRegOutlinedIcon />}
              >
                {tc("check-out-button")}
              </Button>
            </>
          ) : reservation.status === "COMPLETED" ? (
            <Alert severity="success">{tc("success-message")}</Alert>
          ) : (
            <Alert severity="error">{tc("only-checked-in-error")}</Alert>
          )}
        </DialogActions>
      </>}
    </Dialog>
  );
}

export default CheckOutReservationDialog;
