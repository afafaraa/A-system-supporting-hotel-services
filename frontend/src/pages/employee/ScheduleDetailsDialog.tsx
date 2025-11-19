import {Dialog, DialogContent, IconButton, Stack, Typography, Box, Button, DialogTitle} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
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
import {formatTimeRange} from "../../utils/dateFormatting.ts";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";
import OrderStatusChip from "../../components/ui/OrderStatusChip.tsx";
import {isAfter} from "date-fns";

type Props = {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
  onScheduleUpdated: (oldSchedule: Schedule, newSchedule: Schedule) => void;
}

function ScheduleDetailsDialog({open, onClose, schedule, onScheduleUpdated}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<"reject" | "cancel" | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.employee.schedule_details.${key}`)

  const handleScheduleAction = (
    action: "confirm" | "complete" | "cancel" | "reject",
    reason?: CancellationReason,
  ) => {
    const now = new Date();
    if (action === "complete" && isAfter(new Date(schedule.date), now)) {
      setError(t("common.cannot_complete_service_before_schedule"));
      return;
    }
    setError(null);
    setLoading(true);
    const apiPath = `/schedule/${schedule.id}/${action}` + (reason ? `?reason=${reason}` : "");
    axiosAuthApi.patch(apiPath)
      .then(res => onScheduleUpdated(schedule, res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  const handleConfirmedAction = (reason: CancellationReason) => {
    if (!actionToConfirm) return;
    handleScheduleAction(actionToConfirm, reason);
    setActionToConfirm(null);
  };

  const DialogSection = ({title, children}: {title: ReactElement | string, children: ReactNode}) => (
    <Box fontSize="14px" width="100%">
      <Box display="flex" alignItems="center" gap={1} fontWeight="bold">{title}</Box>
      <Box color="text.secondary" fontSize="12px" mt={0.5} lineHeight={1.4}>{children}</Box>
    </Box>
  )

  const elementsSpacing = {xs: 2, sm: 3} as const;

  return (
    <Dialog open={open} onClose={onClose} sx={{"& .MuiDialog-paper": {p: {xs: 0, sm: 2}, borderRadius: 3, width: "100%"}}}>
      <IconButton onClick={onClose} sx={{position: 'absolute', right: 16, top: 16}}><CloseIcon /></IconButton>
      <DialogTitle mb={1}>
        <ServiceIcon imageUrl={schedule.thumbnailUrl} imageAlt={schedule.title} mb={1}>
          <Typography fontWeight="bold" fontSize="21px">{schedule.title || tc("unknown_service")}</Typography>
        </ServiceIcon>
        <Typography fontSize="14px" color="text.secondary">{tc("subtitle")}</Typography>
      </DialogTitle>

      <DialogContent>

        <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
          <DialogSection title={<><EventOutlinedIcon fontSize="small"/> {tc("date_and_time")}</>} >
            <p>{new Date(schedule.date).toLocaleDateString(t('date.locale'))}</p>
            <p>{formatTimeRange(new Date(schedule.date), schedule.duration)}</p>
          </DialogSection>
          <DialogSection title={tc("status")}>
            <OrderStatusChip size="small" status={schedule.status} sx={{my: 0.2}}/>
          </DialogSection>
        </Stack>

        {schedule.status !== OrderStatus.AVAILABLE && <>
          <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
            <DialogSection title={<><PersonOutlineOutlinedIcon fontSize="small" /> {tc("guest_name")}</>}>
              {schedule.guestName || t("common.guest_unknown")}
            </DialogSection>
            <DialogSection title={<><RoomOutlinedIcon fontSize="small" /> {tc("room_number")}</>}>
              {t("common.room") + " " + schedule.room || tc("no_room")}
            </DialogSection>
          </Stack>

          <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
            {schedule.orderTime &&
              <DialogSection title={<><ScheduleOutlinedIcon fontSize="small" /> {tc("order_time")}</>}>
                {new Date(schedule.orderTime).toLocaleString(t("date.locale"))}
              </DialogSection>
            }
            <DialogSection title={<><CommentOutlinedIcon fontSize="small" /> {t("common.special_requests")}</>}>
              {schedule.specialRequests ?? '—'}
            </DialogSection>
          </Stack>
        </>}

        <Box>
          <DialogSection title={tc("service_description")}>
            <p>{schedule.serviceDescription ?? '—'}</p>
                        <p>{tc("duration")}: {schedule.duration ? schedule.duration + " " + tc("minutes") : "..."} • {tc("price")}: {schedule.price ? schedule.price + " $" : tc("unset")}</p>
          </DialogSection>
        </Box>

        {schedule.status === OrderStatus.REQUESTED &&
          <Box display="flex" gap={1} mt={elementsSpacing}>
            <Button variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={loading} onClick={() => handleScheduleAction("confirm")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none", fontSize: {xs: "12px", sm: "inherit"}, lineHeight: 1.3}}>{tc("confirm")}</Button>
            <Button color="error" variant="outlined" startIcon={<CancelOutlinedIcon/>} loading={loading} onClick={() => setActionToConfirm("reject")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none", fontSize: {xs: "12px", sm: "inherit"}, lineHeight: 1.3}}>{tc("reject")}</Button>
          </Box>
        }

        {schedule.status === OrderStatus.ACTIVE &&
          <Box display="flex" gap={1} mt={elementsSpacing}>
            <Button color="success" variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={loading} onClick={() => handleScheduleAction("complete")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none", fontSize: {xs: "12px", sm: "inherit"}, lineHeight: 1.3}}>{tc("complete")}</Button>
            <Button color="error" variant="outlined" startIcon={<CancelOutlinedIcon/>} loading={loading} onClick={() => setActionToConfirm("cancel")}
                    sx={{flex:"1 0 0", fontWeight: "bold", textTransform: "none", fontSize: {xs: "12px", sm: "inherit"}, lineHeight: 1.3}}>{tc("cancel")}</Button>
          </Box>
        }

        {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}

      </DialogContent>

      {actionToConfirm !== null &&
        <ConfirmationWithReasonDialog
          onCancel={() => setActionToConfirm(null)}
          onConfirm={handleConfirmedAction}
        />
      }
    </Dialog>
  );
}

export default ScheduleDetailsDialog;
