import {RefObject} from "react";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {Box, Stack, Typography} from "@mui/material";
import {addDays, isSameDay} from "date-fns";
import {Schedule} from "../../../types/schedule.ts";
import {TFunction} from "i18next";
import {formatTimeRange} from "../../../utils/dateFormatting.ts";

function CalendarGrid(
  scrollRef: RefObject<HTMLDivElement | null>,
  fullWeekdays: string[],
  currentWeekStart: Date, today: Date,
  t: TFunction, tc: (key: string) => string,
  schedulesOnDay: Partial<Record<number, Schedule[]>>,
  setSelectedSchedule: (value: (((prevState: (Schedule | null)) => (Schedule | null)) | Schedule | null)) => void,
) {

  const scheduleCardStyle = {
    mt: 1, textAlign: "left", cursor: "pointer", position: "relative",
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    "&:hover": {transform: 'scale(1.10)', boxShadow: 3}, bgcolor: "transparent",
  };

  const ScheduleCard = ({schedule}: {schedule: Schedule}) => (
    <SectionCard size={1.5} sx={scheduleCardStyle} onClick={() => setSelectedSchedule(schedule)}>
      <Typography fontSize="inherit" fontWeight="bold">{schedule.title}</Typography>
      <Typography fontSize={{xs: 10, sm: 11}} color="text.secondary" mb={3}>
        {formatTimeRange(new Date(schedule.date), schedule.duration)}
      </Typography>
      <Box px={0.8} py={0.6} position="absolute" bottom={4} right={4} fontSize={11} fontWeight="bold"
           color={`calendar.text`} bgcolor={`calendar.${schedule.status}`}
           sx={{borderRadius: 1.5}}>
        {t(`order_status.${schedule.status}`)}
      </Box>
    </SectionCard>
  )

  return <Stack direction="row" spacing={2} ref={scrollRef} sx={{
    overflowX: "auto",
    transform: "scaleY(-1)", "& > div": {transform: "scaleY(-1)"}, // for scroll to be on top
    scrollbarColor: theme => `${theme.palette.primary.main} ${theme.palette.primary.light}`,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    "@supports (-moz-appearance: none)": {scrollbarWidth: "auto"},
    "@supports not (scrollbar-color: red blue)": {
      "&::-webkit-scrollbar": {height: 8, borderRadius: "99px"},
      "&::-webkit-scrollbar-track": {bgcolor: "primary.light", borderRadius: "99px"},
      "&::-webkit-scrollbar-thumb": {background: "primary.main", borderRadius: "99px"},
    }
  }}>
    {fullWeekdays.map((dayOfWeek, index) => {

      const currentDay = addDays(currentWeekStart, index);
      const isToday = isSameDay(currentDay, today);
      return (
        <Box key={index} textAlign="center" alignItems="center" justifyContent="center" minWidth={140} width="100%" pt={1}>
          <SectionCard size={2} sx={{fontWeight: "bold", bgcolor: isToday ? "primary.light" : "background.main", paddingX: {xs: 0.5, sm: 1}, borderRadius: 4}}>
            <Typography fontSize="inherit" fontWeight="inherit">{dayOfWeek}</Typography>
            <Typography mb={2} fontSize="smaller" lineHeight="inherit">
              {currentDay.toLocaleDateString(t('date.locale'), {
                day: 'numeric',
                month: 'short'
              })} {isToday && `(${tc("today")})`}
            </Typography>
            {schedulesOnDay[index]?.map((schedule: Schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule}/>
            ))}
          </SectionCard>
        </Box>
      )

    })}
  </Stack>;
}

export default CalendarGrid;
