import SectionTitle from "../../components/ui/SectionTitle.tsx";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, TextField, Typography} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {getDateFnsLocale} from "../../locales/i18n.ts";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {alpha, styled} from "@mui/material/styles";
import Box from "@mui/system/Box";
import axiosApi, {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {MenuItem} from "@mui/material";
import {addDays, isSameDay} from "date-fns";
import {Checkbox, FormControlLabel} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Reservation from "../../types/reservation.ts";
import {ReservationDetails} from "./guest-arrival-departues/CommonReservationDialogComponents.tsx";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import useTranslationWithPrefix from "../../locales/useTranslationWithPrefix.tsx";

const StyledDatePicker = styled(DatePicker)({
  "& .MuiPickersOutlinedInput-root": {borderRadius: "12px"},
  "& .MuiPickersInputBase-sectionsContainer": {padding: "12px 0"},
})

const StyledFormControlLabel = styled(FormControlLabel)({
  marginRight: 0,
  marginLeft: -2,
  "& .MuiCheckbox-root": {padding: 0, marginRight: "9px"},
  "& .MuiTypography-root": {fontSize: "15px"},
})

interface Room {
  number: string;
  floor: number;
  capacity: number;
  pricePerNight: number;
  standard: {
    name: string;
    description?: string;
  };
  description?: string;
  amenities: string[];
}

interface ReservationWithGuestCode {
  reservation: Reservation,
  code: string,
}

function CheckInPage() {
  const {t} = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.check-in")
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState<Date>(today);
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(today, 7));

  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [availableRoomsStatus, setAvailableRoomsStatus] = useState<{status: "idle" | "loading" | "success" | "error", text: string | null}>({status: "idle", text: null});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [reservationPrice, setReservationPrice] = useState<number | null>(null);
  const [reservationPriceStatus, setReservationPriceStatus] = useState<{status: "idle" | "loading" | "success" | "error", text: string | null}>({status: "idle", text: null});

  const [guestDetails, setGuestDetails] = useState<{name: string, surname: string, email: string, guestCount: number}>({name: "", surname: "", email: "", guestCount: 0});
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const [withCheckIn, setWithCheckIn] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successModalData, setSuccessModalData] = useState<ReservationWithGuestCode | null>(null);

  const buttonEnabled = (
    selectedRoom &&
    guestDetails.name.length > 0 && guestDetails.surname.length > 0 &&
    guestDetails.email.length > 0 && guestDetails.guestCount > 0 &&
    (!withCheckIn || (withCheckIn && paymentDone))
  );

  useEffect(() => {
    if (checkInDate > checkOutDate) return;
    setAvailableRoomsStatus({status: "loading", text: tc("loading-available-rooms")});
    setSelectedRoom(null);
    setAvailableRooms([]);
    axiosApi.get<Room[]>("/rooms/available", {params: {from: checkInDate.toISOString().split('T')[0], to: checkOutDate.toISOString().split('T')[0]}})
      .then(res => {
        setAvailableRooms(res.data);
        setAvailableRoomsStatus({status: "success", text: tc("available-rooms-found", {count: res.data.length})});
      })
      .catch(err => {
        setAvailableRoomsStatus({status: "error", text: tc("error-loading-available-rooms") + ": " + err.message})
      });
  }, [checkInDate, checkOutDate, tc]);

  useEffect(() => {
    if (!selectedRoom) return;
    setReservationPriceStatus({status: "loading", text: tc("loading-reservation-price")});
    setReservationPrice(null);
    axiosApi.get(`/rooms/${selectedRoom}/price`, {params: {from: checkInDate.toISOString().split('T')[0], to: checkOutDate.toISOString().split('T')[0]}})
      .then(res => {
        setReservationPrice(res.data);
        setReservationPriceStatus({status: "success", text: null})
      })
      .catch(err => {
        setReservationPriceStatus({status: "error", text: tc("error-loading-reservation-price") + ": " + err.message})
      });
  }, [checkInDate, checkOutDate, selectedRoom, tc]);

  useEffect(() => {
    if (isSameDay(new Date(), checkInDate)) return;
    setWithCheckIn(false);
    setPaymentDone(false);
  }, [checkInDate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({ ...prev, [name]: name === "guestCount" ? Number(value) : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      ...guestDetails,
      roomNumber: selectedRoom,
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0],
      specialRequests: specialRequests.trim() || null,
      withCheckIn: withCheckIn,
    }
    axiosAuthApi.post<ReservationWithGuestCode>("/reservations/with-new-guest", payload)
      .then(res => {
        setSuccessModalData(res.data)
      })
      .catch(err => {
        const errorMessage = err.response.data.message ?? err.message;
        setActionError(tc("error-unable-to-add-reservation") + ": " + errorMessage);
      })
      .finally(() => setActionLoading(false));
  }

  return (<>
    <SectionTitle title={<><GroupAddOutlinedIcon /> {tc("title")}</>}
                  subtitle={tc("subtitle")}/>
    <FormControl component="form" fullWidth onSubmit={handleSubmit}>
      <Typography mb={0.3}>{tc("date-range")}</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale(t("date.locale"))}>
        <Box display="flex" alignItems="center" columnGap={2} rowGap={1} flexWrap="wrap">
          <StyledDatePicker
            value={checkInDate}
            onChange={(newDate: null | Date) => {if (newDate !== null) setCheckInDate(newDate);}}
            disablePast
          />
          —
          <StyledDatePicker
            value={checkOutDate}
            onChange={(newDate: null | Date) => {if (newDate !== null) setCheckOutDate(newDate);}}
            disablePast
            minDate={checkInDate}
          />
        </Box>
      </LocalizationProvider>
      <Typography mt={2.5} mb={1.5}>{tc("available-rooms-in-range")}</Typography>
      <TextField
        required
        select
        label={t("common.room")}
        value={selectedRoom ? selectedRoom : ""}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        {availableRooms.map(room => (
          <MenuItem key={room.number} value={room.number}>
            {tc("room-option", { number: room.number, standard: room.standard.name, capacity: room.capacity, price: room.pricePerNight })}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="caption" color={availableRoomsStatus.status === "error" ? "error" : "inherit"} mt={0.3} ml={0.2}>
        {availableRoomsStatus.text}
      </Typography>
      <Box mt={2.5}>
        <Typography display="inline-block" mr={1}>{tc("reservation-price")}:</Typography>
        <Typography display="inline-block" fontWeight={500}>{reservationPrice ? reservationPrice.toFixed(2) + " $" : "..."}</Typography>
        <Typography variant="caption" color={reservationPriceStatus.status === "error" ? "error" : "inherit"} mt={0.2}>
          {reservationPriceStatus.text}
        </Typography>
      </Box>
      <Typography mt={2.5} mb={1.5}>{tc("guest-info")}</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
        <TextField
          required
          sx={{flexGrow: 1, flexBasis: "6rem"}}
          label={tc("guest-count")}
          name="guestCount"
          value={guestDetails.guestCount}
          onChange={handleChange}>
        </TextField>
        <TextField
          required
          sx={{flexGrow: 1}}
          label={tc("name")}
          name="name"
          value={guestDetails.name}
          onChange={handleChange}>
        </TextField>
        <TextField
          required
          sx={{flexGrow: 1}}
          label={tc("surname")}
          name="surname"
          value={guestDetails.surname}
          onChange={handleChange}>
        </TextField>
        <TextField
          required
          sx={{flexGrow: 1}}
          type="email"
          label={tc("email")}
          name="email"
          value={guestDetails.email}
          onChange={handleChange}>
        </TextField>
        <TextField
          fullWidth
          type="text"
          label={t("common.special_requests")}
          value={specialRequests}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecialRequests(e.target.value)}>
        </TextField>
      </Box>
      <StyledFormControlLabel
          disabled={!(checkInDate && isSameDay(today, checkInDate))}
          sx={{mt: 2.5}}
          label={tc("with-check-in")}
          control={<Checkbox
            checked={withCheckIn}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setWithCheckIn(event.target.checked) }
          />}
      />
      <StyledFormControlLabel
          disabled={!withCheckIn}
          sx={{mt: 1}}
          label={tc("payment-confirmed")}
          control={<Checkbox
            checked={paymentDone}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPaymentDone(event.target.checked) }
          />}
      />
      <Button disabled={!buttonEnabled} loading={actionLoading} variant="contained" sx={{mt: 3.5}} onClick={handleSubmit}>
        {tc("add-reservation")} {withCheckIn && tc("and-check-in")}
      </Button>
    </FormControl>

    <Snackbar
      open={!!actionError}
      autoHideDuration={6000}
      onClose={() => setActionError(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={() => setActionError(null)} severity="error" sx={{ width: "100%" }}>
        {actionError}
      </Alert>
    </Snackbar>

    <Dialog
      open={successModalData !== null}
      onClose={() => setSuccessModalData(null)}
      sx={{"& .MuiDialog-paper": {p: {xs: 1, sm: 2}, borderRadius: 3}}}
    >
      {successModalData !== null && <>
        <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
                <TaskAltOutlinedIcon
                    color="success"
                    sx={{width: 50, height: 50, p: 1, borderRadius: "10px",
                      backgroundColor: theme => alpha(theme.palette.success.main, 0.2)
                    }}
                />
                {tc("reservation-added-success")}
            </Box>
        </DialogTitle>
        <DialogContent>
          <Typography fontWeight="bold" pb={1}>{tc("reservation-data")}</Typography>
          <ReservationDetails reservation={successModalData.reservation}/>
          <Divider sx={{my: 3}}/>
          <Typography fontWeight="bold" pb={1}>{tc("user-login-data")}</Typography>
            <Box fontSize="14px" lineHeight={1.5} fontWeight="bold">
                <p>{tc("registration-code")}: <span style={{fontWeight: "normal"}}>{successModalData.code}</span></p>
            </Box>

        </DialogContent>
      </>}
    </Dialog>
  </>);
}

export default CheckInPage;
