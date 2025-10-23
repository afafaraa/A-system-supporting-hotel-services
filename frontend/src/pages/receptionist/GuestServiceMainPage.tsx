import {useNavigate} from "react-router-dom";
import useTranslationWithPrefix from "../../locales/useTranslationWithPrefix";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import {Alert, CircularProgress, OutlinedInput, Pagination, Stack, Typography} from "@mui/material";
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {TabProp} from "./GuestService.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import Reservation from "../../types/reservation.ts";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";
import roomStandardIcon from "../../utils/roomStandardIcon.tsx";
import {useTranslation} from "react-i18next";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import {formatDateRange} from "../../utils/dateFormatting.ts";
import { Search } from "@mui/icons-material";
import {differenceInCalendarDays} from "date-fns";
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';

interface Props {
  tabs: TabProp[];
}

function GuestServiceMainPage({tabs}: Props) {
  const navigate = useNavigate();
  const today = new Date();
  const {t} = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.guest-service");
  const {t: tc2} = useTranslationWithPrefix("pages.employee.reservations")
  const [ongoingReservations, setOngoingReservations] = useState<Reservation[]>([]);
  const [dataFetchingStatus, setDataFetchingStatus] = useState<{s: "loading" | "error" | "success", i?: string}>({s: "loading"});
  const [filterRoom, setFilterRoom] = useState("");
  const itemsPerPage = 3;
  const [currPage, setCurrPage] = useState(1);

  const NavBlock = ({label, icon, onClick}: {label: string, icon: typeof tabs[0]["icon"], onClick: () => void}) => {
    const Icon = icon;
    return (
      <SectionCard clickable size={2} onClick={onClick} minWidth="200px">
        <Box className="flex-centered" flexDirection="column" gap={1}>
          <Icon sx={{fontSize: "300%"}} color="primary" />
          <Typography fontSize="18px" fontWeight={500} color="text.primary" textAlign="center">{label}</Typography>
        </Box>
      </SectionCard>
    );
  }

  const InfoBox = ({label, value}: {label: string, value: string | number}) => (
    <Box>
      <span style={{fontWeight: "bold"}}>{label}</span>
      <Typography fontSize="inherit" color="text.secondary">{value}</Typography>
    </Box>
  )

  useEffect(() => {
    axiosAuthApi.get<Reservation[]>("/reservations/ongoing")
      .then(async res => {
        const sortedReservations = res.data
          .sort((a: Reservation, b: Reservation) => a.roomNumber.localeCompare(b.roomNumber))
        setOngoingReservations(sortedReservations);
        setDataFetchingStatus({s: "success"});
      })
      .catch(async err => {
        console.error(err);
        setDataFetchingStatus({s: "error", i: err.message});
      });
  }, []);

  const filteredReservations = (filterRoom === '') ? ongoingReservations :
    ongoingReservations.filter(res => res.roomNumber.includes(filterRoom));

  const pageCount = Math.ceil(filteredReservations.length / itemsPerPage);

  const paginatedReservations = filteredReservations.slice(
    (currPage - 1) * itemsPerPage,
    currPage * itemsPerPage
  );

  return (
    <>
      <SectionTitle title={<><PersonOutlineOutlinedIcon /> {tc("title")}</>}
                    subtitle={tc("subtitle")} />

      <Stack direction="row" alignItems="center" mb={2} columnGap={2} rowGap={1} flexWrap="wrap">
        <Typography sx={{textWrap: "nowrap"}} display="flex" alignItems="center" gap={1} fontSize="1.2rem">
          <CollectionsBookmarkOutlinedIcon /> {tc("ongoing-reservations-title")}
        </Typography>
        <Box flexGrow={1} display="flex" justifyContent="flex-end">
          <OutlinedInput
            startAdornment={<Search sx={{color: "text.secondary"}}/>}
            placeholder={tc("find-by-room-input-placeholder")}
            size="small"
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            sx={{gap: 1}}
          />
        </Box>
      </Stack>

      <Stack gap={2} mb={2}>
        {dataFetchingStatus.s === "loading" ? (
          <SectionCard className="flex-centered" size={4}>
            <CircularProgress />
          </SectionCard>
        ) : dataFetchingStatus.s === "error" ? (
            <SectionCard className="flex-centered" size={4}>
              <Alert severity="error">
                {tc("reservations-fetching-error")}<br/>{dataFetchingStatus.i}
              </Alert>
            </SectionCard>
        ) : filteredReservations.length === 0 ? (
          <SectionCard size={4}>
            <Typography fontSize="1em">
              {filterRoom === '' ? tc("reservations-no-results") : tc("reservations-no-results-filtered")}
            </Typography>
          </SectionCard>
        ) :
          paginatedReservations.map((reservation: Reservation) => (
          <SectionCard key={reservation.id} size={2}>
            <ServiceIcon icon={roomStandardIcon(reservation.roomStandard)}>
              <Stack direction="column" gap={0.5}>
                <span style={{fontWeight: "bold", marginBottom: "0.25em"}}>{t(`common.room_standard.${reservation.roomStandard}`)} | {t("common.room")} {reservation.roomNumber}</span>
                <Stack direction="row" columnGap={2} rowGap={0} alignItems="center" color="text.secondary" fontSize="90%" flexWrap="wrap">
                  <span>{differenceInCalendarDays(today, reservation.checkIn)} {tc("days-after-check-in")}</span>
                  <span>|</span>
                  <span>{differenceInCalendarDays(reservation.checkOut, today)} {tc("days-before-check-out")}</span>
                </Stack>
              </Stack>
            </ServiceIcon>
            <Stack direction="row" gap={2} mt={2} justifyContent={{xs: "flex-start", sm: "space-between"}} fontSize="85%" width={{xs: "100%", md: "75%"}} flexWrap="wrap" sx={{textWrap: "nowrap"}}>
              <InfoBox label={tc2("date-of-stay")}
                       value={formatDateRange(reservation.checkIn, reservation.checkOut)} />
              <InfoBox label={tc("reservation-for")}
                       value={`${reservation.guestFullName} (${reservation.guestEmail})`} />
              <InfoBox label={tc2("guests")}
                       value={`${reservation.guestsCount} ${tc2("people")}`} />
              <InfoBox label={tc2("price")}
                       value={`${reservation.reservationPrice.toFixed(2)} $`} />
              <InfoBox label={tc2("paid")}
                       value={t(`common.${reservation.paid ? "yes" : "no"}`)} />
            </Stack>
            {reservation.specialRequests && (
              <SectionCard size={2} sx={{bgcolor: "background.default", borderWidth: 0, fontSize: "90%"}} mt={2}>
                <p style={{display:"flex", alignItems:"center", gap: 6}}>
                  <CommentOutlinedIcon sx={{fontSize: "130%", ml: -0.25}}/> {t("common.special_requests")}
                </p>
                <Typography mt={0.5} fontSize="inherit" color="text.secondary">{reservation.specialRequests}</Typography>
              </SectionCard>
            )}
          </SectionCard>
        ))}
      </Stack>
      <Pagination
        color="primary"
        count={pageCount}
        onChange={(_event: ChangeEvent<unknown>, value: number) => setCurrPage(value)}
        sx={{width: "fit-content", marginInline: "auto"}}/>

      <Stack direction="row" minHeight={40} alignItems="center" mb={2} mt={4}>
        <Typography sx={{textWrap: "nowrap"}} display="flex" alignItems="center" gap={1} fontSize="1.2rem">
          <ListOutlinedIcon /> {tc("other-actions-title")}
        </Typography>
      </Stack>

      <Stack mt={1} direction="row" flexWrap="wrap" gap={2} mb={2} justifyContent="center"
             display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
        {tabs && tabs.slice(1).map(tab => (
          <NavBlock key={tab.name} label={tc(tab.name, {defaultValue: tab.name})} icon={tab.icon} onClick={() => tab.link && navigate(tab.link)} />
        ))}
      </Stack>
    </>
  );
}

export default GuestServiceMainPage;
