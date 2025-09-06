import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import {Alert, Button, Stack} from "@mui/material";
import Title from "./Title.tsx";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {startOfWeek, addDays, isSameDay, isSameWeek, format, addMinutes} from "date-fns";
import {Typography, Box} from "@mui/material";
import {Schedule} from "../../types/schedule.ts";
import {getYearWeek} from "../../utils/utils.ts";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {isAxiosError} from "axios";
import ScheduleDetails from "../../pages/employee/ScheduleDetails.tsx";

function Calendar() {
  const { t } = useTranslation();
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(today, { weekStartsOn: 1 }));
  const yearWeek = getYearWeek(currentWeekStart);
  const [schedules, setSchedules] = useState<Map<number, Schedule[]>>(new Map());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [currentWeekStart, schedules]);

  useEffect(() => {
    if (schedules.has(yearWeek)) return;
    axiosAuthApi.get<Schedule[]>('/schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        const updated = new Map(schedules);
        updated.set(yearWeek, res.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setSchedules(updated);
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status !== 404) setError("Unable to fetch schedules: " + err.message);
        } else { setError("An unexpected error occurred while fetching schedules"); }
      });
  }, [currentWeekStart, schedules, yearWeek]);
  
  const handleTodayButtonClick = () => setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  const handlePrevWeekButtonClick = () => setCurrentWeekStart(prev => addDays(prev, -7));
  const handleNextWeekButtonClick = () => setCurrentWeekStart(prev => addDays(prev, 7));

  const onScheduleUpdated = (oldSchedule: Schedule, newSchedule: Schedule) => {
    setSelectedSchedule(newSchedule);

    // removed the old schedule
    const oldScheduleYearWeek = getYearWeek(new Date(oldSchedule.date));
    const updated = new Map(schedules);
    const filteredSchedules: Schedule[] | undefined = updated.get(oldScheduleYearWeek)?.filter(s => s.id !== oldSchedule.id);
    if (filteredSchedules) updated.set(oldScheduleYearWeek, filteredSchedules);

    // add the new schedule
    const newScheduleYearWeek = getYearWeek(new Date(newSchedule.date));
    const newSchedules: Schedule[] = updated.get(newScheduleYearWeek) || [];
    newSchedules.push(newSchedule);
    newSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    updated.set(newScheduleYearWeek, newSchedules);

    setSchedules(updated);
  }

  // ------------- CALENDAR HEADER -------------
  const CalendarTitle = () => (
    <Title title={<><CalendarTodayOutlinedIcon /> Weekly Calendar</>}
           subtitle={"Your weekly service schedule"} />
  )

  const CurrentWeekInfo = () => (
    <Typography fontWeight="bold" fontSize="1.2rem">
      {format(currentWeekStart, "dd.MM")} - {format(addDays(currentWeekStart, 6), "dd.MM")} {isSameWeek(currentWeekStart, today, {weekStartsOn: 1}) && "(Current)"}
    </Typography>
  )

  const ControlPanel = () => (
    <Stack direction="row" spacing={{xs: 1, sm: 3}} height={32}>
      <Button onClick={handleTodayButtonClick} variant="outlined" size="small" sx={{px: 3, mr: 3}}>Today</Button>
      <Stack direction="row" spacing={1} height="inherit">
        <Button onClick={handlePrevWeekButtonClick} variant="outlined" size="small" sx={{minWidth: 32, width: 32, maxWidth: 32}}><ArrowBackIosNewIcon sx={{fontSize: "130%"}}/></Button>
        <Button onClick={handleNextWeekButtonClick} variant="outlined" size="small" sx={{minWidth: 32, width: 32, maxWidth: 32}}><ArrowForwardIosIcon sx={{fontSize: "130%"}}/></Button>
      </Stack>
    </Stack>
  )

  const CalendarHeader = () => <>
    <Stack display={{xs: "none", md: "flex"}} direction="row" justifyContent="space-between">
      <CalendarTitle />
      <CurrentWeekInfo />
      <ControlPanel />
    </Stack>
    <Box display={{xs: "block", md: "none"}}>
      <CalendarTitle />
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <CurrentWeekInfo />
        <ControlPanel />
      </Stack>
    </Box>
    {error && <Alert severity="error" sx={{mb: 1}}>{error}</Alert>}
  </>
  // -------------------------------------------

  const numberToWeekday: Record<string, number> = {"MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6} as const;

  const CalendarGrid = () => {
    const shortWeekdays: string[] = t("date.shortWeekdays", { returnObjects: true }) as string[];
    const schedulesForWeek: Schedule[] = schedules.get(yearWeek) || [];
    const schedulesOnDay: Partial<Record<number, Schedule[]>> = Object.groupBy(schedulesForWeek, (s: Schedule) => numberToWeekday[s.weekday]);

    return (
      <Stack direction="row" spacing={2} sx={{
        overflowX: "auto",
        transform: "scaleY(-1)", "& > div": {transform: "scaleY(-1)"}, // for scroll to be on top
        //scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
        "&::-webkit-scrollbar": { height: 8, borderRadius: "99px" },
        "&::-webkit-scrollbar-track": { bgcolor: "primary.light", borderRadius: "99px" },
        "&::-webkit-scrollbar-thumb": { background: theme => `linear-gradient(90deg,${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`, borderRadius: "99px" }
      }}>
        {shortWeekdays.map((dayOfWeek, index) => {

          const currentDay = addDays(currentWeekStart, index);
          const isToday = isSameDay(currentDay, today);
          return (
            <Box key={index} textAlign="center" alignItems="center" justifyContent="center" minWidth={140} width="100%" pt={2}>
              <SectionCard size={1.5} sx={{fontWeight: "bold", bgcolor: isToday ? "primary.light" : "background.main"}}>
                <Typography mb={2} fontSize="inherit" fontWeight="inherit" lineHeight="inherit">
                  {dayOfWeek}<br/>{ currentDay.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'numeric'}) } {isToday && "(Today)"}
                </Typography>
                {schedulesOnDay[index]?.map((schedule: Schedule) => (
                  <SectionCard size={1.5} sx={{...scheduleCardStyle, bgcolor: "transparent"}} onClick={() => setSelectedSchedule(schedule)}>
                    <ScheduleCard key={schedule.id} schedule={schedule}/>
                  </SectionCard>
                ))}
              </SectionCard>
            </Box>
          )

        })}
      </Stack>
    )
  }

  const scheduleCardStyle = {
    mt: 1, textAlign: "left", cursor: "pointer", position: "relative",
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    "&:hover": {transform: 'scale(1.10)', boxShadow: 3}
  };

  const ScheduleCard = ({schedule}: {schedule: Schedule}) => (
    <>
      <Typography fontSize="inherit" fontWeight="bold">{schedule.title}</Typography>
      <Typography fontSize="inherit" color="text.secondary" mb={1.5}>
        {schedule.duration ?
          `${format(schedule.date, "HH:mm")} - ${format(addMinutes(schedule.date, schedule.duration), "HH:mm")}`
          : format(schedule.date, "HH:mm")
        }
      </Typography>
      <Box px={0.8} py={0.4} position="absolute" bottom={0} right={0} fontSize={11} fontWeight="bold"
           color={`calendar.${schedule.status}.background`} bgcolor={`calendar.${schedule.status}.primary`}
           sx={{borderTopLeftRadius: 10}}>
        {t(`order_status.${schedule.status}`)}
      </Box>
    </>
  )

  return (
    <SectionCard>
      <CalendarHeader />

      <CalendarGrid />

      {selectedSchedule && (
        <ScheduleDetails open={true} onClose={() => setSelectedSchedule(null)}
                         schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}
    </SectionCard>
  )
}

export default Calendar;
