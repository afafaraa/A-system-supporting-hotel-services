import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Title from "../../components/ui/Title.tsx";
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import {Schedule} from "../../types/schedule.ts";
import {Stack, Typography} from "@mui/material";
import Box from "@mui/system/Box";
import {useTranslation} from "react-i18next";
import ScheduleDetailsDialog from "./ScheduleDetailsDialog.tsx";
import {getScheduleTimeSpan} from "../../utils/utils.ts";

function TodaySchedulesPage() {
  const {t} = useTranslation();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    axiosAuthApi.get<Schedule[]>("/schedule/today")
      .then(res => {
        setSchedules(res.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      })
      .catch(err => console.error(err));
  }, []);

  const onScheduleUpdated = (oldSchedule: Schedule, newSchedule: Schedule) => {
    if (selectedSchedule) setSelectedSchedule(newSchedule);
    setSchedules(prev => prev.map(s => s.id === oldSchedule.id ? newSchedule : s));
  }

  return (
    <SectionCard>
      <Title title={<><ScheduleOutlinedIcon /> Today's Services</>}
             subtitle={`${schedules.length} services scheduled for today`} />
      {schedules.map(schedule => (
        <SectionCard size={2} sx={{mt: 2, px: {xs: 1.5, sm: 4}, cursor: "pointer"}} key={schedule.id} display="flex" alignItems="center" justifyContent="space-between"
                     onClick={() => setSelectedSchedule(schedule)} >
          <Stack direction="row" alignItems="center" gap={{xs: 1.5, sm: 3}}>
            <Box bgcolor="primary.medium" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
              <AirportShuttleOutlinedIcon color="primary" fontSize="large" />
            </Box>
            <Box>
              <Typography fontWeight="bold">{schedule.title}</Typography>
              <Typography fontSize="11px" color="text.secondary">{schedule.guestName ?? "Guest unknown"} | Room {schedule.room ?? "unknown"}</Typography>
              <Typography fontSize="13px" sx={{mt: 1}}>{getScheduleTimeSpan(new Date(schedule.date), schedule.duration, t('date.locale'))}</Typography>
            </Box>
          </Stack>
          <Typography fontSize="12px" fontWeight="bold" px={{xs: 1, sm: 2}} py={0.5} borderRadius={1}
                      color="calendar.text" bgcolor={"calendar." + schedule.status}>
            {t(`order_status.${schedule.status}`)}
          </Typography>
        </SectionCard>
      ))}

      {selectedSchedule && (
        <ScheduleDetailsDialog open={true} onClose={() => setSelectedSchedule(null)} schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}
    </SectionCard>
  );
}

export default TodaySchedulesPage;
