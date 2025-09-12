import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import {Box, Typography, Stack} from "@mui/material";
import {addDays, isSameDay} from "date-fns";
import {Schedule} from "../../../types/schedule.ts";
import {TFunction} from "i18next";
import ServiceIcon from "../ServiceIcon.tsx";
import {formatTimeRange} from "../../../utils/dateFormatting.ts";

function CalendarList(
  fullWeekdays: string[],
  currentWeekStart: Date, today: Date,
  t: TFunction, tc: (key: string) => string,
  schedulesOnDay: Partial<Record<number, Schedule[]>>,
  setSelectedSchedule: (value: (((prevState: (Schedule | null)) => (Schedule | null)) | Schedule | null)) => void,
) {

  const ScheduleCard = ({schedule}: {schedule: Schedule}) => (
    <SectionCard size={3} sx={{mt: 1, bgcolor: "transparent", cursor: "pointer"}}
                 onClick={() => setSelectedSchedule(schedule)}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <ServiceIcon>
          <Typography fontSize="inherit" fontWeight="bold">{schedule.title}</Typography>
          <Typography fontSize="smaller" color="text.secondary">
            {schedule.guestName ?? t("common.guest_unknown")} | {t("common.room")} {schedule.room ?? t("common.unknown")}
          </Typography>
        </ServiceIcon>
        <Box display="flex" flexDirection="column" alignItems="flex-end" textAlign="right" gap={0.5}>
          <Typography fontSize="smaller" color="text.secondary">
            {formatTimeRange(new Date(schedule.date), schedule.duration)}
          </Typography>
          <Box p={0.5} fontSize="smaller" fontWeight="bold" width="fit-content"
               color={`calendar.text`} bgcolor={`calendar.${schedule.status}`} borderRadius={1.5} lineHeight={1}>
            {t(`order_status.${schedule.status}`)}
          </Box>
        </Box>
      </Stack>
    </SectionCard>
  )

  return fullWeekdays.map((dayOfWeek, index) => {
    const currentDay = addDays(currentWeekStart, index);
    const isToday = isSameDay(currentDay, today);
    return (
      <Box key={index} alignItems="center" justifyContent="center" mb={2}>
        <SectionCard size={4} style={{paddingInline: "0.5rem"}}
                     sx={{bgcolor: isToday ? "primary.light" : "background.main"}}>
          <Stack direction="row" justifyContent="space-between" mx={1} mb={schedulesOnDay[index] && 2}>
            <div>
              <Typography fontSize="bigger" fontWeight="bold">{dayOfWeek}</Typography>
              <Typography fontSize="inherit" lineHeight="inherit">
                {currentDay.toLocaleDateString(t('date.locale'), {
                  day: 'numeric',
                  month: 'short'
                })} {isToday && `(${tc("today")})`}
              </Typography>
            </div>
            {!schedulesOnDay[index] && <Typography fontSize="inherit">{tc("no_services_this_day")}</Typography>}
          </Stack>

          {schedulesOnDay[index]?.map((schedule: Schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule}/>
          ))}
        </SectionCard>
      </Box>
    )
  });
}

export default CalendarList;
