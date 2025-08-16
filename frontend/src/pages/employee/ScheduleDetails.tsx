import {Dialog, DialogContent, IconButton, Stack, Typography, Box, Divider, Button} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import EventIcon from '@mui/icons-material/Event';
import { format, addMinutes } from 'date-fns';
import { useTranslation } from "react-i18next";
import {Schedule, OrderStatus} from "../../types/schedule.ts";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useState} from "react";
import ConfirmationWithReasonDialog from "../../components/layout/ConfirmationWithReasonDialog.tsx"
import {CancellationReason} from "../../types/cancellation_reasons.ts";

type Props = {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
  onScheduleUpdated: (oldSchedule: Schedule, newSchedule: Schedule) => void;
}

function ScheduleDetails({open, onClose, schedule, onScheduleUpdated}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<"reject" | "cancel" | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.details.${key}`);

  function getDay(date: Date) {
    const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
    const dayOfWeek = shortWeekdays[(date.getDay() + 6) % 7];
    const dateStr = date.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'long', year: 'numeric'});
    const sep = t('date.separator');
    return `${dayOfWeek}${sep} ${dateStr}`
  }

  const handleConfirmSchedule = () => {
    setLoading(true);
    setError(null);
    axiosAuthApi.patch(`/schedule/${schedule.id}/confirm`)
      .then(res => {
        onScheduleUpdated(schedule, res.data)
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  const handleRejectSchedule = (reason: CancellationReason) => {
    setLoading(true);
    setError(null);
    axiosAuthApi.patch(`/schedule/${schedule.id}/reject?reason=${reason}`)
      .then(res => {
        onScheduleUpdated(schedule, res.data)
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  const handleCompleteSchedule = () => {
    setLoading(true);
    setError(null);
    axiosAuthApi.patch(`/schedule/${schedule.id}/complete`)
      .then(res => {
        onScheduleUpdated(schedule, res.data)
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  const handleCancelSchedule = (reason: CancellationReason) => {
    setLoading(true);
    setError(null);
    axiosAuthApi.patch(`/schedule/${schedule.id}/cancel?reason=${reason}`)
      .then(res => {
        onScheduleUpdated(schedule, res.data)
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  const confirmAction = (action: "reject" | "cancel") => {
    setActionToConfirm(action);
    setConfirmationOpen(true);
  };

  const handleConfirmedAction = (reason: CancellationReason) => {
    if (actionToConfirm === "reject") {
      handleRejectSchedule(reason);
    } else if (actionToConfirm === "cancel") {
      handleCancelSchedule(reason);
    }
    setConfirmationOpen(false);
    setActionToConfirm(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton onClick={onClose} sx={{position: 'absolute', right: 8, top: 8}}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold" pt={1} pb={0.5}>
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

          {schedule.status !== OrderStatus.available &&
            <>
              <Box display="flex" alignItems="center" gap={2}>
                <PersonIcon color="action" />
                <Typography>{schedule.guestName || "Unknown guest"}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <RoomIcon color="action" />
                <Typography>{schedule.room || "No room assigned"}</Typography>
              </Box>
            </>
          }

          <Divider />

          <Box sx={{ mt: 2 }}>
            <Typography fontSize="0.9rem" fontWeight="bold">
              {tc("status")}:
              <Box component="span" sx={{ml: 1, px: 1.2, py: 0.4, borderRadius: 1, color: `calendar.${schedule.status}.background`,
                backgroundColor: `calendar.${schedule.status}.primary`, display: 'inline-block'}}>
                {t(`order_status.${schedule.status}`)}
              </Box>
            </Typography>
          </Box>

          {schedule.orderTime &&
            <Typography color="text.secondary" fontSize="0.9rem">
              {tc("orderTime")}: {new Date(schedule.orderTime).toLocaleString(t("date.locale"))}
            </Typography>
          }

          {schedule.status === OrderStatus.requested &&
            <>
              <Button variant="contained" startIcon={<CheckCircleIcon/>} loading={loading} onClick={handleConfirmSchedule}
                      sx={{fontWeight: "bold", textTransform: "none"}}>{tc("confirm")}</Button>
              <Button color="error" variant="contained" startIcon={<CancelIcon/>} loading={loading} onClick={() => confirmAction("reject")}
                      sx={{fontWeight: "bold", textTransform: "none"}}>{tc("reject")}</Button>
            </>
          }

          {schedule.status === OrderStatus.active &&
            <>
              <Button color="success" variant="contained" startIcon={<CheckCircleIcon/>} loading={loading} onClick={handleCompleteSchedule}
                      sx={{fontWeight: "bold", textTransform: "none"}}>{tc("complete")}</Button>
              <Button color="error" variant="contained" startIcon={<CancelIcon/>} loading={loading} onClick={() => confirmAction("cancel")}
                      sx={{fontWeight: "bold", textTransform: "none"}}>{tc("cancel")}</Button>
            </>
          }

          {error && <Typography color="error" variant="body2">{error}</Typography>}

        </Stack>
      </DialogContent>

      <ConfirmationWithReasonDialog
        open={confirmationOpen}
        title={t("confirmation_dialog.title")}
        description={
          actionToConfirm === "reject"
            ? t("confirmation_dialog.description.reject")
            : t("confirmation_dialog.description.cancel")
        }
        onCancel={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmedAction}
        confirmText={t("confirmation_dialog.confirm")}
        cancelText={t("confirmation_dialog.cancel")}
      />

    </Dialog>
  );
}

export default ScheduleDetails;
