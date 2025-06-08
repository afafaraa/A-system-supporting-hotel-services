import {Dialog, DialogContent, IconButton, Stack, Typography, Box, Divider} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import EventIcon from '@mui/icons-material/Event';
import { format, addMinutes } from 'date-fns';
import { useTranslation } from "react-i18next";
import { Schedule } from "../../components/layout/ScheduleTable.tsx";
import { orderStatus } from "../../utils/utils.ts"

type Props = {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
}

function ScheduleDetails({open, onClose, schedule}: Props) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.details.${key}`);

  function getDay(date: Date) {
    const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
    const dayOfWeek = shortWeekdays[(date.getDay() + 6) % 7];
    const dateStr = date.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'long', year: 'numeric'});
    const sep = t('date.separator');
    return `${dayOfWeek}${sep} ${dateStr}`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton onClick={onClose} sx={{position: 'absolute', right: 8, top: 8}}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" pt={1.5}>
            {schedule.title || tc("unknownService")}
          </Typography>

          <Divider />

          <Box display="flex" alignItems="center" gap={2}>
            <EventIcon color="action" />
            <Typography>
              {getDay(new Date(schedule.date))}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <AccessTimeIcon color="action" />
            <Typography>
              {schedule.duration ?
                `${format(schedule.date, "HH:mm")} - ${format(addMinutes(schedule.date, schedule.duration), "HH:mm")}`
                : format(schedule.date, "HH:mm")
              }
            </Typography>
          </Box>

          {schedule.guestName && (
            <Box display="flex" alignItems="center" gap={2}>
              <PersonIcon color="action" />
              <Typography>{schedule.guestName}</Typography>
            </Box>
          )}

          {schedule.room && (
            <Box display="flex" alignItems="center" gap={2}>
              <RoomIcon color="action" />
              <Typography>{schedule.room}</Typography>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography fontSize="0.9rem">
              {tc("status")}:
              <Box component="span" sx={{ml: 1, px: 1.5, py: 0.5, borderRadius: 1, color: `${orderStatus[schedule.status].text}`,
                backgroundColor: `${orderStatus[schedule.status].background}`, display: 'inline-block'}}>
                {schedule.status}
              </Box>
            </Typography>
          </Box>

          {schedule.orderTime && (
            <Typography color="text.secondary" fontSize="0.9rem">
              {tc("orderTime")}: {schedule.orderTime}
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleDetails;
