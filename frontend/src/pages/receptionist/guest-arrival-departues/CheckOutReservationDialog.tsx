import {
  Alert,
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography
} from "@mui/material";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Reservation from "../../../types/reservation.ts";
import {ReservationDetails, ReservationTitle} from "./CommonReservationDialogComponents.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {ChangeEvent, useEffect, useState} from "react";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";


function CheckOutReservationDialog({reservation, onSuccess, onClose}: {reservation: Reservation | null, onSuccess: (reservation: Reservation) => void, onClose: () => void}) {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.check-out");
  const [error, setError] = useState<string | null>(null);
  const [userBill, setUserBill] = useState<number | null>(null);
  const [paymentChecked, setPaymentChecked] = useState(false);

  useEffect(() => {
    if (reservation === null) return;
    axiosAuthApi.get<{bill: number}>(`/user/${reservation.guestId}/bill`)
      .then(res => setUserBill(res.data.bill))
      .catch(err => setError(err.message));
  }, [reservation]);

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
          <SectionCard size={2} sx={{color: "primary.contrastText", bgcolor: "primary.main", borderWidth: 0, fontSize: "90%"}} mt={1}>
            {tc("check-out-bill")}: <Typography display="inline-block" fontWeight={600}>{userBill?.toFixed(2) ?? '...'} $</Typography>
          </SectionCard>
          <FormControlLabel sx={{"& .MuiTypography-root": {fontSize: "14px"}, mt: 1}}
                            control={<Checkbox required checked={paymentChecked}
                                               onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentChecked(e.target.checked)}/>}
                            label={tc("bill-payment-confirmation")}
          />
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
                disabled={!paymentChecked}
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
