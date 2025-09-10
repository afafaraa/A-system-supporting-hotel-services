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
  const tc = (key: string) => t(`pages.my_schedule.details.${key}`);

  const handleScheduleAction = (
    action: "confirm" | "complete" | "cancel" | "reject",
    reason?: CancellationReason,
  ) => {
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
    <Dialog open={open} onClose={onClose} sx={{"& .MuiDialog-paper": {p: {xs: 0, sm: 2}, borderRadius: 3}}}>
      <IconButton onClick={onClose} sx={{position: 'absolute', right: 16, top: 16}}><CloseIcon /></IconButton>
      <Box width="50vw"></Box>
      <DialogTitle mb={1}>
        <ServiceIcon mb={1}>
          <Typography fontWeight="bold" fontSize="21px">{schedule.title || tc("unknownService")}</Typography>
        </ServiceIcon>
        <Typography fontSize="14px" color="text.secondary">Service request details and client information</Typography>
      </DialogTitle>

      <DialogContent>

        <Stack direction="row" spacing={elementsSpacing} mb={elementsSpacing}>
          <DialogSection title={<><EventOutlinedIcon fontSize="small"/> Date & time</>} >
            <p>{new Date(schedule.date).toLocaleDateString(t('date.locale'))}</p>
            <p>{formatTimeRange(new Date(schedule.date), schedule.duration)}</p>
          </DialogSection>
          <DialogSection title={tc("status")}>
            <Box display="inline-block" px={1.5} py={0.2} my={0.2} borderRadius={1} color="calendar.text" bgcolor={`calendar.${schedule.status}`} fontWeight="bold">
              {t(`order_status.${schedule.status}`)}
            </Box>
          </DialogSection>
        </Stack>

        {schedule.status !== OrderStatus.AVAILABLE && <>
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

        {error && <Typography color="error" variant="body2">{error}</Typography>}

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
