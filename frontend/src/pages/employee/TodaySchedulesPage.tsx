import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import {Schedule} from "../../types/schedule.ts";
import {Typography, Button, Alert} from "@mui/material";
import Box from "@mui/system/Box";
import {useTranslation} from "react-i18next";
import ScheduleDetailsDialog from "./ScheduleDetailsDialog.tsx";
import {formatTimeRange} from "../../utils/dateFormatting.ts";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";
import OrderStatusChip from "../../components/ui/OrderStatusChip.tsx";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

function TodaySchedulesPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.today_schedules.${key}`);
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
      <SectionTitle title={<><ScheduleOutlinedIcon /> {tc("title")}</>}
                    subtitle={`${schedules.length} ${tc("subtitle")}`} />
      {error && <Alert severity="error" sx={{my: 2}}>{error}</Alert>}
      {pageLoading ? <></> : schedules.length === 0 ?
        <SectionCard size={4}>
          {tc("no_schedules")}
        </SectionCard>
        :
        schedules.slice(0, visibleCount).map(schedule => (
        <SectionCard clickable size={2} sx={{mt: 2, px: {xs: 1.5, sm: 4}}} key={schedule.id}
                     onClick={() => setSelectedSchedule(schedule)} >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <ServiceIcon imageUrl={schedule.thumbnailUrl} imageAlt={schedule.title}>
              <Typography fontWeight="bold">{schedule.title}</Typography>
              <Typography fontSize="11px" color="text.secondary">{schedule.guestName ?? t("common.guest_unknown")} | {t("common.room")} {schedule.room ?? t("common.unknown")}</Typography>
              <Typography fontSize="13px" sx={{mt: 1}}>{formatTimeRange(new Date(schedule.date), schedule.duration)}</Typography>
            </ServiceIcon>
            <OrderStatusChip size="big" status={schedule.status} />
          </Box>
          {schedule.specialRequests &&
            <SectionCard size={2} sx={{bgcolor: "background.default", borderWidth: 0, fontSize: "90%"}} mt={2}>
              <p style={{display:"flex", alignItems:"center", gap: 6}}>
                <CommentOutlinedIcon sx={{fontSize: "130%", ml: -0.25}}/> {t("common.special_requests")}
              </p>
              <Typography mt={0.5} fontSize="inherit" color="text.secondary">{schedule.specialRequests}</Typography>
            </SectionCard>
          }
        </SectionCard>
      ))}

      {visibleCount < schedules.length &&
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="outlined" onClick={showMore} sx={{width: "300px"}}>{t("ui.show_more")}</Button>
        </Box>
      }

      {selectedSchedule && (
        <ScheduleDetailsDialog open={true} onClose={() => setSelectedSchedule(null)} schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}
    </SectionCard>
  );
}

export default TodaySchedulesPage;
