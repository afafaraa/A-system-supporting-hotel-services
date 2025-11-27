import ServiceIcon from "../../components/ui/ServiceIcon.tsx";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import {formatDateRange, formatTimeRange} from "../../utils/dateFormatting.ts";
import {BillElement} from "../../types/userDetails.ts";
import {ReactNode} from "react";
import {Box, Stack, Typography} from "@mui/material";
import {t} from "i18next";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";

export interface SimpleSchedule {
  type: 'SERVICE';
  id: string;
  title: string;
  date: string; // ISO string
  duration: number; // in minutes
  specialRequests?: string;
  thumbnailUrl?: string;
}

export interface SimpleReservation {
  type: 'RESERVATION';
  id: string;
  roomNumber: string;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
  specialRequests?: string;
  roomStandard: string;
}

const BillElementCard = ({item, data}: {item: BillElement, data?: SimpleSchedule | SimpleReservation}) => (
  <SectionCard size={2} sx={{mb: 2, px: 4}}>
    {data === undefined ? (
      <DefaultBillElementCard type={item.type} item={item} />
    ) : data.type === 'SERVICE' ? (
      (() => {
        const schedule = data as SimpleSchedule;
        return (
          <DetailedBillElementCard item={item} specialRequests={schedule.specialRequests}>
            <ServiceIcon imageUrl={schedule.thumbnailUrl} imageAlt={schedule.title + " thumbnail"}>
              <Typography fontWeight="bold">{schedule.title}</Typography>
              <Typography fontSize="11px" color="text.secondary">{t("common.order_date")}: {new Date(item.addedDate).toLocaleString(t('date.locale'))}</Typography>
              <Typography fontSize="13px" sx={{mt: 0.5}}>{new Date(schedule.date).toLocaleDateString(t('date.locale'))} | {formatTimeRange(new Date(schedule.date), schedule.duration)}</Typography>
            </ServiceIcon>
          </DetailedBillElementCard>
        );
      })()
    ) : (
      (() => {
        const reservation = data as SimpleReservation;
        return (
          <DetailedBillElementCard item={item} specialRequests={reservation.specialRequests}>
            <ServiceIcon icon={MeetingRoomOutlinedIcon}>
              <Typography fontWeight="bold">{t(`common.room_standard.${reservation.roomStandard}`, {defaultValue: reservation.roomStandard})} | {t("common.room")} {reservation.roomNumber}</Typography>
              <Typography fontSize="11px" color="text.secondary">{t("common.order_date")}: {new Date(item.addedDate).toLocaleString(t('date.locale'))}</Typography>
              <Typography fontSize="13px" sx={{mt: 0.5}}>{formatDateRange(new Date(reservation.checkIn), new Date(reservation.checkOut))}</Typography>
            </ServiceIcon>
          </DetailedBillElementCard>
        );
      })()
    )}
  </SectionCard>
)

const DefaultBillElementCard = ({type, item}: {type: BillElement["type"], item: BillElement}) => (
  <Stack direction="row" alignItems="center" gap={2}>
    <ServiceIcon icon={type === "RESERVATION" ? MeetingRoomOutlinedIcon : undefined}>
      <Typography fontWeight="bold">{type === "SERVICE" ? "Usługa" : "Rezerwacja"} {item.id}</Typography>
      <Typography fontSize="11px" color="text.secondary">Data zamówienia: {new Date(item.addedDate).toLocaleString(t('date.locale'))}</Typography>
    </ServiceIcon>
    <Box flexGrow={1} display="flex" justifyContent="flex-end">
      <Typography fontWeight="bold">{item.price.toFixed(2)}$</Typography>
    </Box>
  </Stack>
)

const DetailedBillElementCard = ({children, item, specialRequests}: {children: ReactNode, item: BillElement, specialRequests?: string}) => (
  <Box>
    <Stack direction="row" alignItems="center">
      {children}
      <Box flexGrow={1} display="flex" justifyContent="flex-end">
        <Typography fontWeight="bold">{item.price.toFixed(2)}$</Typography>
      </Box>
    </Stack>
    {specialRequests &&
        <SectionCard size={2} sx={{bgcolor: "background.default", borderWidth: 0, fontSize: "90%"}} mt={1.5}>
            <p style={{display:"flex", alignItems:"center", gap: 6}}>
                <CommentOutlinedIcon sx={{fontSize: "130%", ml: -0.25}}/> {t("common.special_requests")}
            </p>
            <Typography mt={0.5} fontSize="inherit" color="text.secondary">{specialRequests}</Typography>
        </SectionCard>
    }
  </Box>
)

export default BillElementCard;
