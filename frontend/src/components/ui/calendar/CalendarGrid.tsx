import {RefObject} from "react";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {Box, Stack, Typography} from "@mui/material";
import {addDays, isSameDay} from "date-fns";
import {Schedule} from "../../../types/schedule.ts";
import {TFunction} from "i18next";
import {formatTimeRange} from "../../../utils/dateFormatting.ts";
import OrderStatusChip from "../OrderStatusChip.tsx";

function CalendarGrid(
  scrollRef: RefObject<HTMLDivElement | null>,
  fullWeekdays: string[],
  currentWeekStart: Date, today: Date,
  t: TFunction, tc: (key: string) => string,
  schedulesOnDay: Partial<Record<number, Schedule[]>>,
  setSelectedSchedule: (value: (((prevState: (Schedule | null)) => (Schedule | null)) | Schedule | null)) => void,
) {

  const ScheduleCard = ({schedule}: {schedule: Schedule}) => (
    <SectionCard clickable size={1.5} onClick={() => setSelectedSchedule(schedule)}
                 sx={{mt: 1, textAlign: "left", position: "relative", bgcolor: "transparent"}}>
      <Typography fontSize="inherit" fontWeight="bold">{schedule.title}</Typography>
      <Typography fontSize={{xs: 10, sm: 11}} color="text.secondary" mb={3}>
        {formatTimeRange(new Date(schedule.date), schedule.duration)}
      </Typography>
      <OrderStatusChip size="small" status={schedule.status} sx={{position: "absolute", bottom: 4, right: 4}} />
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
