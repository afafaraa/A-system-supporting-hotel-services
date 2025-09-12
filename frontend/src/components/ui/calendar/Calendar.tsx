import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {Alert, Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery} from "@mui/material";
import Title from "../Title.tsx";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useTranslation} from "react-i18next";
import {MouseEvent, SetStateAction, useEffect, useLayoutEffect, useRef, useState} from "react";
import {startOfWeek, addDays, isSameWeek, getISOWeek} from "date-fns";
import {Schedule} from "../../../types/schedule.ts";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {isAxiosError} from "axios";
import ScheduleDetailsDialog from "../../../pages/employee/ScheduleDetailsDialog.tsx";
import {formatNumericDayMonth} from "../../../utils/dateFormatting.ts";
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import ViewWeekOutlinedIcon from '@mui/icons-material/ViewWeekOutlined';
import CalendarList from "./CalendarList.tsx";
import CalendarGrid from "./CalendarGrid.tsx";

function getYearWeek(date: Date): number {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return year * 100 + week;
}

interface CalendarProps {
  title?: string;
  subtitle?: string;
}

export type MobileArrangementType = "list" | "grid" | null;
const numberToWeekday: Record<string, number> = {"MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6} as const;

function Calendar({title, subtitle}: CalendarProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`ui.calendar.${key}`);
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(today, { weekStartsOn: 1 }));
  const yearWeek = getYearWeek(currentWeekStart);
  const [schedules, setSchedules] = useState<Map<number, Schedule[]>>(new Map());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [savedScrollLeft, setSavedScrollLeft] = useState<number>(0);
  const isXs = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [mobileArrangement, setMobileArrangement] = useState<MobileArrangementType>(localStorage.getItem("calendar_mobile_arrangement") as MobileArrangementType ?? "grid");

  useEffect(() => {
    setError(null);
  }, [currentWeekStart, schedules]);

  useEffect(() => {
    if (schedules.has(yearWeek)) return;
    axiosAuthApi.get<Schedule[]>('/schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        const updated = new Map(schedules);
        updated.set(yearWeek, res.data);
        setSchedules(updated);
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status !== 404) setError("Unable to fetch schedules: " + err.message);
        } else { setError("An unexpected error occurred while fetching schedules"); }
      });
  }, [currentWeekStart, schedules, yearWeek]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, Math.min(savedScrollLeft, el.scrollWidth - el.clientWidth));
  }, [yearWeek, schedules, savedScrollLeft]);

  const changeWeek = (value: SetStateAction<Date>) => {
    setSavedScrollLeft(scrollRef.current?.scrollLeft ?? 0);
    setCurrentWeekStart(value);
  }

  const onScheduleUpdated = (oldSchedule: Schedule, newSchedule: Schedule) => {
    setSelectedSchedule(newSchedule);

    // removed the old schedule
    const oldScheduleYearWeek = getYearWeek(new Date(oldSchedule.date));
    const updated = new Map(schedules);
    const filteredSchedules: Schedule[] | undefined = updated.get(oldScheduleYearWeek)?.filter(s => s.id !== oldSchedule.id);
    if (filteredSchedules) updated.set(oldScheduleYearWeek, filteredSchedules);

    // add the new schedule
    const newScheduleYearWeek = getYearWeek(new Date(newSchedule.date));
    const newSchedules: Schedule[] = updated.get(newScheduleYearWeek) ? [...updated.get(newScheduleYearWeek)!] : [];
    const insertIndex = newSchedules.findIndex(s => new Date(s.date).getTime() > new Date(newSchedule.date).getTime());
    if (insertIndex === -1) newSchedules.push(newSchedule);
    else newSchedules.splice(insertIndex, 0, newSchedule);
    updated.set(newScheduleYearWeek, newSchedules);

    setSchedules(updated);
  }

  const handleMobileArrangementChange = (_event: MouseEvent<HTMLElement>, newValue: MobileArrangementType) => {
    if (newValue === null) return;
    setMobileArrangement(newValue);
    localStorage.setItem("calendar_mobile_arrangement", newValue);
  }

  const CalendarHeader = () => (
    <Box p={1.2} mb={0.8}>
      <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap" mb={1}>
        {/* Calendar title */}
        <Box flexGrow={1}>
          <Title title={<><CalendarTodayOutlinedIcon /> {title}</>}
                 subtitle={subtitle} mb={0}/>
        </Box>
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="nowrap" flexGrow={1} mb={2}>
          {/* Selected week range */}
          <Typography fontWeight="bold" fontSize="1.2rem">
            {formatNumericDayMonth(currentWeekStart)}
            {' - '}
            {formatNumericDayMonth(addDays(currentWeekStart, 6))}
            {' '}{isSameWeek(currentWeekStart, today, {weekStartsOn: 1}) && `(${tc("current_week")})`}
          </Typography>
          {/* Controls for a selected week */}
          <Stack direction="row" spacing={{xs: 1, sm: 3}} height={32}>
            <Button onClick={() => changeWeek(startOfWeek(today, { weekStartsOn: 1 }))} variant="outlined" size="small" sx={{px: 3, mr: 3}}>{tc("today")}</Button>
            <Stack direction="row" spacing={1} height="inherit">
              <Button onClick={() => changeWeek(prev => addDays(prev, -7))} variant="outlined" size="small" sx={{minWidth: 32, width: 32, maxWidth: 32}}><ArrowBackIosNewIcon sx={{fontSize: "130%"}}/></Button>
              <Button onClick={() => changeWeek(prev => addDays(prev, 7))} variant="outlined" size="small" sx={{minWidth: 32, width: 32, maxWidth: 32}}><ArrowForwardIosIcon sx={{fontSize: "130%"}}/></Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/* Mobile elements arrangement controls */}
      {isXs && (
        <ToggleButtonGroup value={mobileArrangement} exclusive onChange={handleMobileArrangementChange} size="small" fullWidth sx={{mb: 1}}>
          <ToggleButton value={"list"} aria-label="list" sx={{gap: 1}}><FormatListBulletedOutlinedIcon /> List</ToggleButton>
          <ToggleButton value={"grid"} aria-label="grid" sx={{gap: 1}}><ViewWeekOutlinedIcon /> Grid</ToggleButton>
        </ToggleButtonGroup>
      )}
      {error && <Alert severity="error" sx={{mb: 1}}>{error}</Alert>}
    </Box>
  )

  const fullWeekdays: string[] = t("date.fullWeekdays", { returnObjects: true }) as string[];
  const schedulesForWeek: Schedule[] = schedules.get(yearWeek) || [];
  const schedulesOnDay: Partial<Record<number, Schedule[]>> = Object.groupBy(schedulesForWeek, (s: Schedule) => numberToWeekday[s.weekday]);

  return (
    <SectionCard size={2} sx={{borderRadius: 4}}>
      <CalendarHeader />

      {(isXs && mobileArrangement === "list") ?
        CalendarList(fullWeekdays, currentWeekStart, today, t, tc, schedulesOnDay, setSelectedSchedule) :
        CalendarGrid(scrollRef, fullWeekdays, currentWeekStart, today, t, tc, schedulesOnDay, setSelectedSchedule)
      }

      {selectedSchedule && (
        <ScheduleDetailsDialog open={true} onClose={() => setSelectedSchedule(null)}
                               schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}
    </SectionCard>
  )
}

export default Calendar;
