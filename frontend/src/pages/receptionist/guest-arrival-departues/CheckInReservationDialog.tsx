import {Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography} from "@mui/material";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import {ChangeEvent, useState} from "react";
import Reservation from "../../../types/reservation.ts";
import {ReservationDetails, ReservationTitle} from "./CommonReservationDialogComponents.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";


function CheckInReservationDialog({reservation, onSuccess, onClose}: {reservation: Reservation | null, onSuccess: (reservation: Reservation) => void, onClose: () => void}) {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.check-in");
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentChecked(event.target.checked);
  };

  const handleClose = () => {
    setPaymentChecked(false);
    onClose();
  }

  const handleCheckIn = () => {
    if (!reservation) return;
    setError(null);
    axiosAuthApi.patch(`/reservations/${reservation.id}/check-in?paid=${paymentChecked}`)
      .then(res => onSuccess(res.data))
      .catch((error) => setError(tc("error-during-check-in") + ": " + error.message));
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
          {!reservation.paid && reservation.status === "CONFIRMED" &&
              <FormControlLabel sx={{"& .MuiTypography-root": {fontSize: "14px"}, mt: 1}}
                                control={<Checkbox required checked={paymentChecked} onChange={handlePaymentChange}/>}
                                label={tc("confirm-payment-label")}
              />
          }
        </DialogContent>
        <DialogActions>
          {reservation.status === "CONFIRMED" ?
            <>
              {error && <Typography variant="caption" color="error"
                                    sx={{mr: 1, textWrap: "balance"}}>{error}</Typography>}
              <Button onClick={handleClose} sx={{color: "text.disabled"}}>{tc("cancel")}</Button>
              <Button onClick={handleCheckIn} disabled={!reservation.paid && !paymentChecked} color="primary" variant="contained" startIcon={<HowToRegOutlinedIcon />}>{tc("check-in-button")}</Button>
            </>
            :
            reservation.status === "CHECKED_IN" ?
              <Alert severity="success">{tc("success-message")}</Alert>
              :
              <Alert severity="error">{tc("only-confirmed-error")}</Alert>
          }
        </DialogActions>
      </>}
    </Dialog>
  )
}

export default CheckInReservationDialog;
