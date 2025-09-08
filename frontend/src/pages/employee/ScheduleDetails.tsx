import {Dialog, DialogContent, IconButton, Stack, Typography, Box, Button, DialogTitle} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import EventIcon from '@mui/icons-material/Event';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { useTranslation } from "react-i18next";
import {Schedule, OrderStatus} from "../../types/schedule.ts";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {ReactElement, ReactNode, useState} from "react";
import ConfirmationWithReasonDialog from "../../components/ui/ConfirmationWithReasonDialog.tsx"
import {CancellationReason} from "../../types/cancellation_reasons.ts";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import {getScheduleTimeSpan} from "../../utils/utils.ts";

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

  const DialogSection = ({title, children}: {title: ReactElement | string, children: ReactNode}) => (
    <Box fontSize="14px" width="100%">
      <Box display="flex" alignItems="center" gap={1} fontWeight="bold">{title}</Box>
      <Box color="text.secondary" fontSize="12px" mt={0.5} lineHeight={1.4}>{children}</Box>
    </Box>
  )

  const elementsSpacing = 3 as const;

  return (
    <Dialog open={open} onClose={onClose} sx={{"&	.MuiDialog-paper": {p: 2, borderRadius: 3}}}>
      <IconButton onClick={onClose} sx={{position: 'absolute', right: 16, top: 16}}><CloseIcon /></IconButton>
      <Box width="50vw"></Box>
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={2} mb={1}>
          <Box bgcolor="primary.medium" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
            <AirportShuttleOutlinedIcon color="primary" fontSize="large" />
          </Box>
          <Typography fontWeight="bold" fontSize="21px">{schedule.title || tc("unknownService")}</Typography>
        </Stack>
        <Typography fontSize="14px" color="text.secondary">Service request details and client information</Typography>
      </DialogTitle>

      <DialogContent>

        <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
          <DialogSection title={<><EventIcon fontSize="small"/> Date & time</>} >
            <p>{new Date(schedule.date).toLocaleDateString(t('date.locale'))}</p>
            <p>{getScheduleTimeSpan(new Date(schedule.date), schedule.duration, t('date.locale'))}</p>
          </DialogSection>
          <DialogSection title={tc("status")}>
            <Box display="inline-block" px={1.5} py={0.2} my={0.2} borderRadius={1} color="calendar.text" bgcolor={`calendar.${schedule.status}`} fontWeight="bold">
              {t(`order_status.${schedule.status}`)}
            </Box>
          </DialogSection>
        </Stack>

        {schedule.status !== OrderStatus.available && <>
          <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
            <DialogSection title={<><PersonOutlineOutlinedIcon fontSize="small" /> Guest name</>}>
              {schedule.guestName || "Unknown guest"}
            </DialogSection>
            <DialogSection title={<><RoomOutlinedIcon fontSize="small" /> Room number</>}>
              {"Room " + schedule.room || "No room assigned"}
            </DialogSection>
          </Stack>

          <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
            {schedule.orderTime &&
              <DialogSection title={<><ScheduleOutlinedIcon fontSize="small" /> {tc("orderTime")}</>}>
                {new Date(schedule.orderTime).toLocaleString(t("date.locale"))}
              </DialogSection>
            }
            <DialogSection title={<><CommentOutlinedIcon fontSize="small" /> Special requests</>}>
                Nothing to show, not implemented yet.
            </DialogSection>
          </Stack>
        </>}

        <Box>
          <DialogSection title={"Service description"}>
            <p>Some description for that particular service</p>
            <p>Duration: {schedule.duration ? schedule.duration + " minutes" : "..."} • Price: {schedule.price ?? "unset"}</p>
          </DialogSection>
        </Box>

        {schedule.status === OrderStatus.requested &&
          <Box display="flex" gap={1} mt={elementsSpacing}>
            <Button variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={loading} onClick={handleConfirmSchedule}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none"}}>{tc("confirm")}</Button>
            <Button color="error" variant="outlined" startIcon={<CancelOutlinedIcon/>} loading={loading} onClick={() => confirmAction("reject")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none"}}>{tc("reject")}</Button>
          </Box>
        }

        {schedule.status === OrderStatus.active &&
          <Box display="flex" gap={1} mt={elementsSpacing}>
            <Button color="success" variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={loading} onClick={handleCompleteSchedule}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none"}}>{tc("complete")}</Button>
            <Button color="error" variant="outlined" startIcon={<CancelOutlinedIcon/>} loading={loading} onClick={() => confirmAction("cancel")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none"}}>{tc("cancel")}</Button>
          </Box>
        }

        {error && <Typography color="error" variant="body2">{error}</Typography>}

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
