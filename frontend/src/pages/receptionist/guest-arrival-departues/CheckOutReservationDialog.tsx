import {
  Alert, Box,
  Button, Checkbox, CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel, Modal, Paper,
  Typography
} from "@mui/material";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Reservation from "../../../types/reservation.ts";
import {ReservationDetails, ReservationTitle} from "./CommonReservationDialogComponents.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {ChangeEvent, useEffect, useState} from "react";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {BillElement} from "../../../types/userDetails.ts";
import BillElementCard, {SimpleReservation, SimpleSchedule} from "../../../components/ui/BillElementCard.tsx";
import fetchBillElementsData from "../../../utils/fetchBillElementsData.ts";
import {useTranslation} from "react-i18next";

interface UserBill {
  bill: number;
  billElements: BillElement[];
}

function CheckOutReservationDialog({reservation, onSuccess, onClose}: {reservation: Reservation | null, onSuccess: (reservation: Reservation) => void, onClose: () => void}) {
  const {t} = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.check-out");
  const [error, setError] = useState<string | null>(null);
  const [userBill, setUserBill] = useState<UserBill | null>(null);
  const [paymentChecked, setPaymentChecked] = useState(false);

  const [billElementsLoading, setBillElementsLoading] = useState(true);
  const [fetchedSchedules, setFetchedSchedules] = useState<Record<string, SimpleSchedule> | null>(null);
  const [fetchedReservations, setFetchedReservations] = useState<Record<string, SimpleReservation> | null>(null);
  const [billDetailsFetchError, setBillDetailsFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (reservation === null) return;
    axiosAuthApi.get<UserBill>(`/user/${reservation.guestId}/bill`)
      .then(res => setUserBill(res.data))
      .catch(err => setError(err.message));
  }, [reservation]);

  useEffect(() => {
    if (!userBill?.billElements || userBill.billElements.length === 0) return;
    setBillElementsLoading(true);
    fetchBillElementsData(userBill.billElements)
      .then(({schedulesRecord, reservationsRecord}) => {
        setFetchedSchedules(schedulesRecord);
        setFetchedReservations(reservationsRecord);
      })
      .catch(res => setBillDetailsFetchError(res.message))
      .finally(() => setBillElementsLoading(false));
  }, [userBill?.billElements]);

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

  if (reservation === null) return null;

  return (
    <Modal className="flex-centered" open={true} onClose={handleClose}>
      <Box display="flex" flexDirection={{xs: "column", md: "row-reverse"}} alignItems="flex-start" gap="32px" margin="32px" height="fit-content" maxHeight="calc(100% - 64px)" overflow="auto">
      <Paper sx={{p: {xs: 1, sm: 2}, borderRadius: 3, maxWidth: "600px",
        boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
        transition: "box-shadow 0.3s ease"}}>
        <DialogTitle>
          <ReservationTitle reservation={reservation}/>
        </DialogTitle>
        <DialogContent>
          <ReservationDetails reservation={reservation}/>
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
      </Paper>
      <Paper sx={{p: {xs: 1, sm: 2}, borderRadius: 3, maxWidth: "600px", overflow: "hidden", display: "flex", flexDirection: "column",
        alignSelf: "stretch", maxHeight: "100%", minHeight: "70dvh",
        boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
        transition: "box-shadow 0.3s ease"}}>
        <Typography fontWeight="600" fontSize="18px" mb={1}>{tc("elems-included-in-bill")}:</Typography>
        <Box sx={{overflow: "auto", flexGrow: 1}}>
          {billElementsLoading ? (
              <div className="flex-centered" style={{height: "100%"}}><CircularProgress /></div>
          ) : (
            !userBill?.billElements ? (
              <Alert severity="error">{tc("unable-to-load-bill")}</Alert>
            ) : (
              userBill.billElements.length === 0 ? (
                <SectionCard>
                  {tc("empty-bill")}
                </SectionCard>
              ) : (
                <>
                  {billDetailsFetchError &&
                      <Alert severity="error" sx={{mb: 1}}>{t("common.bill_additional_details_fetch_error")}: {billDetailsFetchError}</Alert>}
                  {userBill.billElements.map(item => (
                    <BillElementCard key={item.id} item={item} data={
                      (fetchedSchedules && fetchedSchedules[item.id]) ??
                      (fetchedReservations && fetchedReservations[item.id]) ??
                      undefined
                    } />
                  ))}
                </>
              )
            )
          )}
        </Box>
        <SectionCard size={2} sx={{flexShrink: 0, color: "primary.contrastText", bgcolor: "primary.main", borderWidth: 0, fontSize: "90%"}} mt={1}>
          {tc("check-out-bill")}: <Typography display="inline-block" fontWeight={600}>{userBill?.bill?.toFixed(2) ?? '...'} $</Typography>
        </SectionCard>
      </Paper>
      </Box>
    </Modal>
  );
}

export default CheckOutReservationDialog;
