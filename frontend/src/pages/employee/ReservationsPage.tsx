import SectionTitle from "../../components/ui/SectionTitle.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import HotelIcon from '@mui/icons-material/Hotel';
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";
import Stack from "@mui/material/Stack";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import Box from "@mui/system/Box";
import {
  Button,
  Typography
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import RejectReservationDialog from "./RejectReservationDialog.tsx";
import roomStandardIcon from "../../utils/roomStandardIcon.tsx";
import Reservation from "../../types/reservation.ts";
import Alert from "@mui/material/Alert";


function ReservationsPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.reservations.${key}`);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosAuthApi.get("/reservations/requested")
      .then(res => setReservations(res.data))
      .catch(err => setError(err))
      .finally(() => setPageLoading(false));
  }, []);

  const handleApproveButton = (reservation: Reservation) => {
    setActionLoading(true);
    axiosAuthApi.patch(`/reservations/${reservation.id}/approve`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setActionLoading(false));
  }

  const handleRejectButton = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  }

  const handleConfirm = (reason: string) => {
    if (!selectedReservation) return;
    setActionLoading(true);
    axiosAuthApi.patch(`/reservations/${selectedReservation.id}/reject`, {reason: reason})
      .then(res => {
        console.log(res.data);
        setSelectedReservation(null);
      })
      .catch(err => console.error(err))
      .finally(() => setActionLoading(false));
  }

  const InfoBox = ({label, value}: {label: string, value: string | number}) => (
    <Box>
      <span style={{fontWeight: "bold"}}>{label}</span>
      <Typography fontSize="inherit" color="text.secondary">{value}</Typography>
    </Box>
  )

  return (
    <SectionCard>
      <SectionTitle title={<><HotelIcon sx={{color: "primary.dark"}}/> {tc("title")}</>}
             subtitle={tc("subtitle")} />
      {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
      {pageLoading ? <></> : reservations.length === 0 ? (
          <SectionCard mt={2}>
            {tc("no_reservations")}
          </SectionCard>
        ) :
        reservations.map(reservation => (
        <SectionCard key={reservation.id} mt={2}>
          <ServiceIcon icon={roomStandardIcon(reservation.roomStandard)}>
            <Stack direction="column" gap={1}>
              <span style={{fontWeight: "bold"}}>{t(`common.room_standard.${reservation.roomStandard}`)} | {t("common.room")} {reservation.roomNumber}</span>
              <Stack direction="row" gap={3} alignItems="center" color="text.secondary" fontSize="smaller" ml={-0.25}>
                <span style={{display:"flex", alignItems:"center", gap: 4}}>
                  <PersonOutlineOutlinedIcon fontSize="small"/> {reservation.guestFullName}
                </span>
                <span style={{display:"flex", alignItems:"center", gap: 4}}>
                  <EmailOutlinedIcon fontSize="small"/> {reservation.guestFullName}
                </span>
              </Stack>
            </Stack>
          </ServiceIcon>
          <Stack direction="row" gap={2} mt={2} justifyContent={{xs: "flex-start", sm: "space-between"}} fontSize="smaller" width={{xs: "100%", md: "75%"}} flexWrap="wrap" sx={{textWrap: "nowrap"}}>
            <InfoBox label={tc("date-of-stay")}
                     value={`${new Date(reservation.checkIn).toLocaleDateString(t("date.locale"))} - ${new Date(reservation.checkOut).toLocaleDateString(t("date.locale"))}`} />
            <InfoBox label={tc("creation-time")}
                     value={new Date(reservation.createdAt).toLocaleString(t("date.locale"))} />
            <InfoBox label={tc("guests")}
                     value={`${reservation.guestsCount} ${tc("people")}`} />
            <InfoBox label={tc("price")}
                     value={`${reservation.reservationPrice.toFixed(2)} $`} />
            <InfoBox label={tc("paid")}
                     value={t(`common.${reservation.paid ? "yes" : "no"}`)} />
          </Stack>
          <SectionCard size={2} sx={{bgcolor: "background.default", borderWidth: 0, fontSize: "90%"}} mt={2}>
            <p style={{display:"flex", alignItems:"center", gap: 6}}>
              <CommentOutlinedIcon sx={{fontSize: "130%", ml: -0.25}}/> {tc("special-requests")}
            </p>
            <Typography mt={0.5} fontSize="inherit" color="text.secondary">{reservation.specialRequests ?? "—"}</Typography>
          </SectionCard>
          <Stack direction="row" gap={2} mt={3}>
            <Button onClick={() => handleApproveButton(reservation)} loading={actionLoading}
              size="small" color="success" variant="contained" sx={{borderRadius: "12px", px: 4, py: 0.7}} startIcon={<TaskAltOutlinedIcon />}>
              {t("buttons.approve")}
            </Button>
            <Button onClick={() => handleRejectButton(reservation)} loading={actionLoading}
              size="small" color="error" variant="outlined" sx={{borderRadius: "12px", px: 4, py: 0.7}} startIcon={<CancelOutlinedIcon />}>
              {t("buttons.reject")}
            </Button>
          </Stack>
        </SectionCard>
      ))}

      <RejectReservationDialog
        opened={selectedReservation !== null}
        onClose={() => setSelectedReservation(null)}
        onConfirm={handleConfirm}
        actionLoading={actionLoading}
      />
    </SectionCard>
  );
}

export default ReservationsPage;
