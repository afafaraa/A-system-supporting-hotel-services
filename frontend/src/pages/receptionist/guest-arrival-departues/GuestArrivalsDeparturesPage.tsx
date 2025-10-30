import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {ReactNode, useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import SectionTitle from "../../../components/ui/SectionTitle.tsx";
import Reservation from "../../../types/reservation.ts";
import ServiceIcon from "../../../components/ui/ServiceIcon.tsx";
import roomStandardIcon from "../../../utils/roomStandardIcon.tsx";
import {
  Button,
  Stack,
  Typography,
  Badge, BadgeProps, IconButton, Alert,
} from "@mui/material";
import Box from "@mui/system/Box";
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {styled} from "@mui/material/styles";
import {formatDateRange} from "../../../utils/dateFormatting.ts";
import CheckInReservationDialog from "./CheckInReservationDialog.tsx";
import CheckOutReservationDialog from "./CheckOutReservationDialog.tsx";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

const StyledBadge = styled(Badge)<BadgeProps>({'& .MuiBadge-badge': {right: -18, top: 11}});
type ReservationLists = "OVERDUE" | "TODAY" | "UPCOMING";
type OverdueProps = {count: number, open: boolean, list: Reservation[], fetched: boolean, error: string | null};
const initialOverdue: OverdueProps = {count: 0, open: false, list: [], fetched: false, error: null};

function GuestArrivalsDeparturesPage() {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.guest-arrival-departures");

  const [checkIns, setCheckIns] = useState<Reservation[]>([]);
  const [checkInsError, setCheckInsError] = useState<string | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<{reservation: Reservation | null, list: ReservationLists}>({reservation: null, list: "TODAY"});

  const [checkOuts, setCheckOuts] = useState<Reservation[]>([]);
  const [checkOutsError, setCheckOutsError] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<{reservation: Reservation | null, list: ReservationLists}>({reservation: null, list: "TODAY"});

  const [upcomingCheckIns, setUpcomingCheckIns] = useState<Reservation[]>([]);
  const [upcomingCheckInsError, setUpcomingCheckInsError] = useState<string | null>(null);
  const [upcomingCheckOuts, setUpcomingCheckOuts] = useState<Reservation[]>([]);
  const [upcomingCheckOutsError, setUpcomingCheckOutsError] = useState<string | null>(null);

  const [overdueCheckIns, setOverdueCheckIns] = useState<OverdueProps>(initialOverdue);
  const [overdueCheckOuts, setOverdueCheckOuts] = useState<OverdueProps>(initialOverdue);

  useEffect(() => {
    axiosAuthApi.get<Reservation[]>("/reservations/today-check-ins")
      .then(response => setCheckIns(response.data))
      .catch(error => setCheckInsError(error.message));
    axiosAuthApi.get<Reservation[]>("/reservations/today-check-outs")
      .then(response => setCheckOuts(response.data))
      .catch(error => setCheckOutsError(error.message));

    axiosAuthApi.get("/reservations/overdue-check-ins/count")
      .then(response => setOverdueCheckIns(prev => ({...prev, count: response.data.count})))
      .catch(() => setOverdueCheckIns(prev => ({...prev, error: tc("error-overdue-check-ins-count")})));
    axiosAuthApi.get("/reservations/overdue-check-outs/count")
      .then(response => setOverdueCheckOuts(prev => ({...prev, count: response.data.count})))
      .catch(() => setOverdueCheckOuts(prev => ({...prev, error: tc("error-overdue-check-outs-count")})));

    axiosAuthApi.get("/reservations/upcoming-check-ins")
      .then(response => setUpcomingCheckIns(response.data))
      .catch(error => setUpcomingCheckInsError(error.message));
    axiosAuthApi.get("/reservations/upcoming-check-outs")
      .then(response => setUpcomingCheckOuts(response.data))
      .catch(error => setUpcomingCheckOutsError(error.message));
  }, [tc]);

  useEffect(() => {
    if (overdueCheckIns.fetched || !overdueCheckIns.open || overdueCheckIns.count === 0) return;
    axiosAuthApi.get<Reservation[]>("/reservations/overdue-check-ins")
      .then(response => setOverdueCheckIns(prev => ({...prev, list: response.data})))
      .catch(error => setOverdueCheckIns(prev => ({...prev, error: error.message})))
      .finally(() => setOverdueCheckIns(prev => ({...prev, fetched: true})));
  }, [overdueCheckIns.fetched, overdueCheckIns.open, overdueCheckIns.count]);

  useEffect(() => {
    if (overdueCheckOuts.fetched || !overdueCheckOuts.open || overdueCheckOuts.count === 0) return;
    axiosAuthApi.get<Reservation[]>("/reservations/overdue-check-outs")
      .then(response => setOverdueCheckOuts(prev => ({...prev, list: response.data})))
      .catch(error => setOverdueCheckOuts(prev => ({...prev, error: error.message})))
      .finally(() => setOverdueCheckOuts(prev => ({...prev, fetched: true})));
  }, [overdueCheckOuts.fetched, overdueCheckOuts.open, overdueCheckOuts.count]);

  return (
    <SectionCard>
      <SectionTitle title={<><LuggageOutlinedIcon /> {tc("title")}</>}
                    subtitle={tc("subtitle")}/>

      <Stack direction={{xs: "column", md: "row"}} columnGap={2} rowGap={4} alignItems="flex-start">

        {/* CHECK-INS */}
        <Box flex="1 0 0" width="100%">

          {/* OVERDUE CHECK-INS */}
          <SectionCard size={2} mb={2} sx={{backgroundColor: "background.default"}} onMouseLeave={() => {
            if (!selectedCheckIn.reservation) setOverdueCheckIns(prev => ({...prev, open: false}))}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <StyledBadge badgeContent={overdueCheckIns.count} color="secondary" showZero>
                <Typography>{tc("overdue-check-ins")}</Typography>
              </StyledBadge>
              <IconButton onClick={() => setOverdueCheckIns(prev => ({...prev, open: !prev.open}))}
              sx={{transform: overdueCheckIns.open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease"}}>
                <KeyboardArrowDownIcon/>
              </IconButton>
            </Stack>
            {overdueCheckIns.error !== null && <Alert severity="error" sx={{mt: 1}}>{overdueCheckIns.error}</Alert> }
            <Box overflow={overdueCheckIns.open ? "auto" : "hidden"} height={overdueCheckIns.open ? 300 : 0}
                 sx={{transition: "height 0.3s ease"}}>
              {overdueCheckIns.list.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckIn({list: "OVERDUE", reservation})}>
                  {reservation.status !== "CHECKED_IN" &&
                      <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-in-button")}</Button>}
                </ReservationCard>
              ))}
            </Box>
          </SectionCard>

          {/* TODAY CHECK-INS */}
          <SectionCard size={2} mb={2}>
            <SectionTitle smaller title={tc("today-check-ins")} mb={0.3}/>
            <Box overflow="auto" minHeight={200} maxHeight={600}>
              {checkInsError !== null ?
                <Alert severity="error" sx={{mt: 1, mb: 0.3}}>{checkInsError}</Alert>
                :
                checkIns.length === 0 ?
                  <p>{tc("no-check-ins-today")}</p>
                  : (
                    checkIns.map((reservation) => (
                      <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckIn({list: "TODAY", reservation})}>
                        {reservation.status !== "CHECKED_IN" &&
                            <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-in-button")}</Button>}
                      </ReservationCard>
                    ))
                  )
              }
            </Box>
          </SectionCard>

          {/* UPCOMING CHECK-INS */}
          <SectionCard size={2} sx={{backgroundColor: "background.default"}}>
            <SectionTitle smaller title={tc("upcoming-check-ins")} mb={0.3}/>
            <Box overflow="auto" minHeight={400} maxHeight={600}>
              {upcomingCheckInsError !== null ?
                <Alert severity="error" sx={{mt: 1, mb: 0.3}}>{upcomingCheckInsError}</Alert>
                :
                upcomingCheckIns.length === 0 ?
                  <p>{tc("no-upcoming-check-ins")}</p>
                  : (
                    upcomingCheckIns.map((reservation) => (
                      <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckIn({list: "UPCOMING", reservation})}>
                        {reservation.status !== "CHECKED_IN" &&
                            <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-in-button")}</Button>}
                      </ReservationCard>
                    ))
                  )
              }
            </Box>
          </SectionCard>

        </Box>

        {/* CHECK-OUTS */}
        <Box flex="1 0 0" width="100%">

          {/* OVERDUE CHECK-OUTS */}
          <SectionCard size={2} mb={2} sx={{backgroundColor: "background.default"}} onMouseLeave={() => {
            if (!selectedCheckOut.reservation) setOverdueCheckOuts(prev => ({...prev, open: false}))}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <StyledBadge badgeContent={overdueCheckOuts.count} color="secondary" showZero>
                <Typography>{tc("overdue-check-outs")}</Typography>
              </StyledBadge>
              <IconButton onClick={() => setOverdueCheckOuts(prev => ({...prev, open: !prev.open}))}
                          sx={{transform: overdueCheckOuts.open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease"}}>
                <KeyboardArrowDownIcon/>
              </IconButton>
            </Stack>
            {overdueCheckOuts.error !== null && <Alert severity="error" sx={{mt: 1}}>{overdueCheckOuts.error}</Alert> }
            <Box overflow={overdueCheckOuts.open ? "auto" : "hidden"} height={overdueCheckOuts.open ? 300 : 0}
                 sx={{transition: "height 0.3s ease"}}>
              {overdueCheckOuts.list.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckOut({list: "OVERDUE", reservation})}>
                  {reservation.status === "CHECKED_IN" &&
                      <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-out-button")}</Button>}
                </ReservationCard>
              ))}
            </Box>
          </SectionCard>

          {/* TODAY CHECK-OUTS */}
          <SectionCard  size={2} mb={2}>
            <SectionTitle smaller title={tc("today-check-outs")} mb={0.3}/>
            <Box overflow="auto" minHeight={200} maxHeight={600}>
              {checkOutsError !== null ?
                <Alert severity="error" sx={{mt: 1, mb: 0.3}}>{checkOutsError}</Alert>
                :
                checkOuts.length === 0 ?
                  <p>{tc("no-check-outs-today")}</p>
                  : (
                    checkOuts.map((reservation) => (
                      <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckOut({list: "TODAY", reservation})}>
                        {reservation.status !== "COMPLETED" &&
                            <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-out-button")}</Button>}
                      </ReservationCard>
                    ))
                  )
              }
            </Box>
          </SectionCard>

          {/* UPCOMING CHECK-OUTS */}
          <SectionCard size={2} sx={{backgroundColor: "background.default"}}>
            <SectionTitle smaller title={tc("upcoming-check-outs")} mb={0.3}/>
            <Box overflow="auto" minHeight={400} maxHeight={600}>
              {upcomingCheckOutsError !== null ?
                <Alert severity="error" sx={{mt: 1, mb: 0.3}}>{upcomingCheckOutsError}</Alert>
                :
                upcomingCheckOuts.length === 0 ?
                  <p>{tc("no-upcoming-check-outs")}</p>
                  : (
                    upcomingCheckOuts.map((reservation) => (
                      <ReservationCard key={reservation.id} reservation={reservation} onClick={() => setSelectedCheckOut({list: "UPCOMING", reservation})}>
                        {reservation.status !== "COMPLETED" &&
                            <Button variant="outlined" startIcon={<HowToRegOutlinedIcon />}>{tc("check-out-button")}</Button>}
                      </ReservationCard>
                    ))
                  )
              }
            </Box>
          </SectionCard>

        </Box>

      </Stack>

      <CheckInReservationDialog
        reservation={selectedCheckIn.reservation}
        onSuccess={(reservation) => {
          setSelectedCheckIn(prev => ({...prev, reservation}));
          if (selectedCheckIn.list === "OVERDUE")
            setOverdueCheckIns(prev =>
              ({...prev, list: prev.list.map(r => r.id === reservation.id ? reservation : r)}));
          else if (selectedCheckIn.list === "TODAY")
            setCheckIns(prev =>
              prev.map(r => r.id === reservation.id ? reservation : r));
          else if (selectedCheckIn.list === "UPCOMING")
            setUpcomingCheckIns(prev =>
              prev.map(r => r.id === reservation.id ? reservation : r));
        }}
        onClose={() => setSelectedCheckIn(prev =>
          ({...prev, reservation: null}))}
      />

      <CheckOutReservationDialog
        reservation={selectedCheckOut.reservation}
        onSuccess={(reservation) => {
          setSelectedCheckOut(prev => ({...prev, reservation}));
          if (selectedCheckOut.list === "OVERDUE")
            setOverdueCheckOuts(prev =>
              ({...prev, list: prev.list.map(r => r.id === reservation.id ? reservation : r)}));
          else if (selectedCheckOut.list === "TODAY")
            setCheckOuts(prev =>
              prev.map(r => r.id === reservation.id ? reservation : r));
          else if (selectedCheckOut.list === "UPCOMING")
            setUpcomingCheckOuts(prev =>
              prev.map(r => r.id === reservation.id ? reservation : r));
        }}
        onClose={() => setSelectedCheckOut(prev =>
          ({...prev, reservation: null}))}
      />

    </SectionCard>
  );
}

const colorFromStatus: Record<string, string> = {
  "REQUESTED": "error",
  "CONFIRMED": "info",
  "CHECKED_IN": "success",
  "CANCELED": "text.primary"
} as const;

const ReservationCard = ({reservation, onClick, children}: {reservation: Reservation, onClick: () => void, children?: ReactNode}) => {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.guest-arrival-departures");

  return (
    <SectionCard size={2} mt={2} sx={{bgcolor: "transparent"}}
                 clickable onClick={onClick}
                 display="flex" alignItems="center" columnGap={2} rowGap={1} flexWrap="wrap">
      <ServiceIcon icon={roomStandardIcon(reservation.roomStandard)}>
        <Typography fontSize="16px" fontWeight={500}>{tc("room-label")} {reservation.roomNumber} | {reservation.roomStandard.name}</Typography>
        <Typography fontSize="12px" color="text.secondary">{tc("guest-label")}: {reservation.guestFullName}</Typography>
        <Typography fontSize="12px" color="text.secondary">{formatDateRange(reservation.checkIn, reservation.checkOut)}</Typography>
        <Typography fontSize="14px" mt={0.5} color={colorFromStatus[reservation.status] || "text.primary"} borderRadius="9px">
          {reservation.status}
        </Typography>
      </ServiceIcon>
      <Box display="flex" justifyContent="flex-end" flexGrow={1}>{children}</Box>
    </SectionCard>
  );
};

export default GuestArrivalsDeparturesPage;
