import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Title from "../../components/ui/Title.tsx";
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import {Schedule} from "../../types/schedule.ts";
import {Stack, Typography, Button, Alert} from "@mui/material";
import Box from "@mui/system/Box";
import {useTranslation} from "react-i18next";
import ScheduleDetailsDialog from "./ScheduleDetailsDialog.tsx";
import {formatTimeRange} from "../../utils/dateFormatting.ts";

function TodaySchedulesPage() {
  const {t} = useTranslation();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const showMore = () => setVisibleCount(prev => prev + 20);

  useEffect(() => {
    axiosAuthApi.get<Schedule[]>("/schedule/today")
      .then(res => setSchedules(res.data))
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, []);

  const onScheduleUpdated = (oldSchedule: Schedule, newSchedule: Schedule) => {
    if (selectedSchedule) setSelectedSchedule(newSchedule);
    setSchedules(prev => prev.map(s => s.id === oldSchedule.id ? newSchedule : s));
  }

  return (
    <SectionCard>
      <Title title={<><ScheduleOutlinedIcon /> Today's Services</>}
             subtitle={`${schedules.length} services scheduled for today`} />
      {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
      {pageLoading ? <></> : schedules.length === 0 ?
        <SectionCard size={4}>
          No schedules found for today.
        </SectionCard>
        :
        schedules.slice(0, visibleCount).map(schedule => (
        <SectionCard size={2} sx={{mt: 2, px: {xs: 1.5, sm: 4}, cursor: "pointer"}} key={schedule.id} display="flex" alignItems="center" justifyContent="space-between"
                     onClick={() => setSelectedSchedule(schedule)} >
          <Stack direction="row" alignItems="center" gap={{xs: 1.5, sm: 3}}>
            <Box bgcolor="primary.medium" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
              <AirportShuttleOutlinedIcon color="primary" fontSize="large" />
            </Box>
            <Box>
              <Typography fontWeight="bold">{schedule.title}</Typography>
              <Typography fontSize="11px" color="text.secondary">{schedule.guestName ?? "Guest unknown"} | Room {schedule.room ?? "unknown"}</Typography>
              <Typography fontSize="13px" sx={{mt: 1}}>{formatTimeRange(new Date(schedule.date), schedule.duration)}</Typography>
            </Box>
          </Stack>
          <Typography fontSize="12px" fontWeight="bold" px={{xs: 1, sm: 2}} py={0.5} borderRadius={1}
                      color="calendar.text" bgcolor={"calendar." + schedule.status}>
            {t(`order_status.${schedule.status}`)}
          </Typography>
        </SectionCard>
      ))}

      {visibleCount < schedules.length &&
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="outlined" onClick={showMore} sx={{width: "300px"}}>Show more ↓</Button>
        </Box>
      }

      {selectedSchedule && (
        <ScheduleDetailsDialog open={true} onClose={() => setSelectedSchedule(null)} schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}
    </SectionCard>
  );
}

export default TodaySchedulesPage;
