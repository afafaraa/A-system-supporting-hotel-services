import {Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography} from "@mui/material";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import {ChangeEvent, useState} from "react";
import Reservation from "../../../types/reservation.ts";
import {ReservationDetails, ReservationTitle} from "./CommonReservationDialogComponents.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";


function CheckInReservationDialog({reservation, onSuccess, onClose}: {reservation: Reservation | null, onSuccess: (reservation: Reservation) => void, onClose: () => void}) {
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
    axiosAuthApi.patch(`/reservations/${reservation.id}/check-in?11paid=${paymentChecked}`)
      .then(res => onSuccess(res.data))
      .catch((error) => setError("Error during check-in: " + error.message));
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
          {!reservation.paid &&
              <FormControlLabel sx={{"& .MuiTypography-root": {fontSize: "14px"}, mt: 1}}
                                control={<Checkbox value={paymentChecked} onChange={handlePaymentChange}/>}
                                label="Potwierdzam, że płatność za pokój została dokonana"
              />
          }
        </DialogContent>
        <DialogActions>
          {reservation.status === "CONFIRMED" ?
            <>
              {error && <Typography variant="caption" color="error"
                                    sx={{mr: 1, textWrap: "balance"}}>{error}</Typography>}
              <Button onClick={handleClose} sx={{color: "text.disabled"}}>Anuluj</Button>
              <Button onClick={handleCheckIn} disabled={!reservation.paid && !paymentChecked} color="primary" variant="contained" startIcon={<HowToRegOutlinedIcon />}>Zamelduj</Button>
            </>
            :
            reservation.status === "CHECKED_IN" ?
              <Alert severity="success">You successfully checked-in the reservation</Alert>
              :
              <Alert severity="error">Only confirmed reservations can be checked-in</Alert>
          }
        </DialogActions>
      </>}
    </Dialog>
  )
}

export default CheckInReservationDialog;
