import {ReactElement, ReactNode} from "react";
import Box from "@mui/system/Box";
import ServiceIcon from "../../../components/ui/ServiceIcon";
import roomStandardIcon from "../../../utils/roomStandardIcon.tsx";
import Reservation from "../../../types/reservation.ts";
import Typography from "@mui/material/Typography";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";
import {formatDateRange} from "../../../utils/dateFormatting.ts";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

const DialogSection = ({title, children}: {title: ReactElement | string, children: ReactNode}) => (
  <Box fontSize="14px" flexBasis="calc(50% - 8px)">
    <Box display="flex" alignItems="center" gap={1} fontWeight="bold">{title}</Box>
    <Box color="text.secondary" fontSize="12px" mt={0.5} lineHeight={1.4}>{children}</Box>
  </Box>
)

const ReservationTitle = ({reservation}: {reservation: Reservation}) => {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.common");
  return (
    <ServiceIcon icon={roomStandardIcon(reservation.roomStandard)}>
      <Typography fontWeight="600" fontSize="21px" lineHeight={1.6}>{tc("reservation-title", {room: reservation.roomNumber})}</Typography>
      <Typography fontWeight="500" fontSize="16px" lineHeight={1.6} color="text.secondary" display="flex" alignItems="center" gap={1} sx={{ml: "-2px"}}><PersonOutlineOutlinedIcon /> {reservation.guestFullName}</Typography>
    </ServiceIcon>
  );
}

const ReservationDetails = ({reservation}: {reservation: Reservation}) => {
  const {t} = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.reservation-dialog.common");
  return <>
    <Stack mt={1} direction="row" flexWrap="wrap" gap={2} mb={2}>
      <DialogSection title={tc("reservation-id")}>
        {reservation.id}
      </DialogSection>
      <DialogSection title={tc("reservation-status")}>
        {reservation.status}
      </DialogSection>
      <DialogSection title={tc("stay-dates")}>
        {formatDateRange(reservation.checkIn, reservation.checkOut)}
      </DialogSection>
      <DialogSection title={tc("room-standard")}>
        {reservation.roomStandard}
      </DialogSection>
      <DialogSection title={tc("guest-email")}>
        {reservation.guestEmail}
      </DialogSection>
      <DialogSection title={tc("guest-count")}>
        {reservation.guestsCount}
      </DialogSection>
      <DialogSection title={tc("reservation-price")}>
        {reservation.reservationPrice} $ {reservation.paid && " | " + tc("paid")}
      </DialogSection>
    </Stack>
    <SectionCard size={2} sx={{bgcolor: "background.default", borderWidth: 0, fontSize: "90%"}}>
      <p style={{display: "flex", alignItems: "center", gap: 6}}><CommentOutlinedIcon
        sx={{fontSize: "130%", ml: -0.25}}/> {t("common.special_requests")}</p>
      <Typography mt={0.5} fontSize="inherit" color="text.secondary">{reservation.specialRequests ?? "—"}</Typography>
    </SectionCard>
  </>;
}

export {ReservationTitle, ReservationDetails};
