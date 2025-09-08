import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import React, {useEffect, useState} from "react";
import {OrderStatus, Schedule} from "../../types/schedule.ts";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {Button, Stack, Typography} from "@mui/material";
import Box from "@mui/system/Box";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import {getScheduleTimeSpan} from "../../utils/utils.ts";
import {useTranslation} from "react-i18next";
import ScheduleDetailsDialog from "./ScheduleDetailsDialog.tsx";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import {CancellationReason} from "../../types/cancellation_reasons.ts";
import ConfirmationWithReasonDialog from "../../components/ui/ConfirmationWithReasonDialog.tsx";
import {styled} from "@mui/material/styles";

type ConfirmationProps = {
  schedule: Schedule;
  action: "reject" | "cancel";
} | null;

function RequestedSchedulesPage() {
  const {t} = useTranslation();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<ConfirmationProps>(null);

  useEffect(() => {
    axiosAuthApi.get<Schedule[]>("/schedule/pending")
      .then(res => {
        setSchedules(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const onScheduleUpdated = (oldSchedule: Schedule, newSchedule: Schedule) => {
    if (selectedSchedule) setSelectedSchedule(newSchedule);
    setSchedules(prev => prev.map(s => s.id === oldSchedule.id ? newSchedule : s));
  }

  const handleScheduleAction = (
    schedule: Schedule,
    action: "confirm" | "complete" | "cancel" | "reject",
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    reason?: CancellationReason,
  ) => {
    e?.stopPropagation();
    setLoading(true);
    setError(null);
    const apiPath = `/schedule/${schedule.id}/${action}` + (reason ? `?reason=${reason}` : "");
    axiosAuthApi.patch(apiPath)
      .then(res => onScheduleUpdated(schedule, res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  const confirmAction = (schedule: Schedule, action: "cancel" | "reject", e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setActionToConfirm({schedule, action});
  };

  const handleConfirmedAction = (reason: CancellationReason) => {
    if (!actionToConfirm) return;
    handleScheduleAction(actionToConfirm.schedule, actionToConfirm.action, undefined, reason);
    setActionToConfirm(null);
  };

  const StyledButton = styled(Button)({fontWeight: "bold", textTransform: "none"})

  function renderActions(schedule: Schedule) {
    switch (schedule.status) {
      case OrderStatus.requested:
        return <>
          <StyledButton onClick={(e) => handleScheduleAction(schedule, "confirm", e)}
                        variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={loading} sx={{mr: 2}}>
            {t("pages.my_schedule.details.confirm")}
          </StyledButton>
          <StyledButton onClick={(e) => confirmAction(schedule, "reject", e)}
                        variant="outlined" color="error" startIcon={<CancelOutlinedIcon/>} loading={loading}>
            {t("pages.my_schedule.details.reject")}
          </StyledButton>
        </>;
      case OrderStatus.active:
        return <>
          <StyledButton onClick={(e) => handleScheduleAction(schedule, "complete", e)}
                        variant="contained" color="success" startIcon={<TaskAltOutlinedIcon/>} loading={loading} sx={{mr: 2}}>
            {t("pages.my_schedule.details.complete")}
          </StyledButton>
          <StyledButton onClick={(e) => confirmAction(schedule, "cancel", e)}
                        variant="outlined" color="error" startIcon={<CancelOutlinedIcon/>} loading={loading}>
            {t("pages.my_schedule.details.cancel")}
          </StyledButton>
        </>;
      default:
        return (
          <Typography fontSize="12px" fontWeight="bold" px={2} py={0.5} borderRadius={1}
                      color="calendar.text" bgcolor={"calendar." + schedule.status}>
            {t(`order_status.${schedule.status}`)}
          </Typography>
        );
    }
  }

  return (
    <SectionCard>
      <Title title={<><ScheduleOutlinedIcon /> Pending Service Requests</>}
             subtitle={`${schedules.length} services waiting for approval`} />
      {schedules.map(schedule => (
        <SectionCard size={2} sx={{mt: 2, px: 4, cursor: "pointer"}} key={schedule.id} display="flex" alignItems="center" justifyContent="space-between"
                     onClick={() => setSelectedSchedule(schedule)} >
          <Stack direction="row" alignItems="center" gap={3}>
            <Box bgcolor="primary.medium" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
              <AirportShuttleOutlinedIcon color="primary" fontSize="large" />
            </Box>
            <Box>
              <Typography fontWeight="bold">{schedule.title}</Typography>
              <Typography fontSize="11px" color="text.secondary">{schedule.guestName ?? "Guest unknown"} | Room {schedule.room ?? "unknown"}</Typography>
              <Typography fontSize="13px" sx={{mt: 1}}>{new Date(schedule.date).toLocaleDateString(t('date.locale'))} | {getScheduleTimeSpan(new Date(schedule.date), schedule.duration, t('date.locale'))}</Typography>
            </Box>
          </Stack>
          <div>
            {renderActions(schedule)}
          </div>
        </SectionCard>
      ))}

      {selectedSchedule && (
        <ScheduleDetailsDialog open={true} onClose={() => setSelectedSchedule(null)} schedule={selectedSchedule} onScheduleUpdated={onScheduleUpdated} />
      )}

      {error && <Typography color="error" sx={{mt: 2}}>{error}</Typography>}

      {actionToConfirm &&
        <ConfirmationWithReasonDialog
          onCancel={() => setActionToConfirm(null)}
          onConfirm={handleConfirmedAction}
        />
      }
    </SectionCard>
  );
}

export default RequestedSchedulesPage;
