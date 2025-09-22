import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import React, {useEffect, useState} from "react";
import {OrderStatus, Schedule} from "../../types/schedule.ts";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {Alert, Button, Stack, Typography, Snackbar} from "@mui/material";
import Box from "@mui/system/Box";
import {formatTimeRange} from "../../utils/dateFormatting.ts";
import {useTranslation} from "react-i18next";
import ScheduleDetailsDialog from "./ScheduleDetailsDialog.tsx";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import {CancellationReason} from "../../types/cancellation_reasons.ts";
import ConfirmationWithReasonDialog from "../../components/ui/ConfirmationWithReasonDialog.tsx";
import {styled} from "@mui/material/styles";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";

type ConfirmationProps = {
  schedule: Schedule;
  action: "reject" | "cancel";
} | null;

function RequestedSchedulesPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.requested_schedules.${key}`);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<ConfirmationProps>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const showMore = () => setVisibleCount(prev => prev + 20);

  useEffect(() => {
    axiosAuthApi.get<Schedule[]>("/schedule/pending")
      .then(res => setSchedules(res.data))
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
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
    setActionLoading(true);
    setError(null);
    const apiPath = `/schedule/${schedule.id}/${action}` + (reason ? `?reason=${reason}` : "");
    axiosAuthApi.patch(apiPath)
      .then(res => onScheduleUpdated(schedule, res.data))
      .catch(err => setActionError(err?.response.data?.message ?? err.message))
      .finally(() => setActionLoading(false));
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

  const StyledButton = styled(Button)(({theme}) => ({
    fontWeight: "bold", textTransform: "none", height: 40, minWidth: 40, borderRadius: 12, padding: '1rem',
    [theme.breakpoints.down('md')]: {padding: '1.5rem', width: 40, "& .MuiButton-startIcon": {margin: 0}},
  }));

  function renderActions(schedule: Schedule) {
    switch (schedule.status) {
      case OrderStatus.REQUESTED:
        return <>
          <StyledButton size="small" onClick={(e) => handleScheduleAction(schedule, "confirm", e)}
                        variant="contained" startIcon={<TaskAltOutlinedIcon/>} loading={actionLoading} sx={{mr: {xs: 1, md: 2}}}>
            <Box component="span" display={{ xs: "none", md: "inline" }}>{t("pages.employee.schedule_details.confirm")}</Box>
          </StyledButton>
          <StyledButton size="small" onClick={(e) => confirmAction(schedule, "reject", e)}
                        variant="outlined" color="error" startIcon={<CancelOutlinedIcon/>} loading={actionLoading}>
            <Box component="span" display={{ xs: "none", md: "inline" }}>{t("pages.employee.schedule_details.reject")}</Box>
          </StyledButton>
        </>;
      case OrderStatus.ACTIVE:
        return <>
          <StyledButton size="small" onClick={(e) => handleScheduleAction(schedule, "complete", e)}
                        variant="contained" color="success" startIcon={<TaskAltOutlinedIcon/>} loading={actionLoading} sx={{mr: {xs: 1, md: 2}}}>
            <Box component="span" display={{ xs: "none", md: "inline" }}>{t("pages.employee.schedule_details.complete")}</Box>
          </StyledButton>
          <StyledButton size="small" onClick={(e) => confirmAction(schedule, "cancel", e)}
                        variant="outlined" color="error" startIcon={<CancelOutlinedIcon/>} loading={actionLoading}>
            <Box component="span" display={{ xs: "none", md: "inline" }}>{t("pages.employee.schedule_details.cancel")}</Box>
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
      <Title title={<><ScheduleOutlinedIcon /> {tc("title")}</>}
             subtitle={`${schedules.length} ${tc("subtitle")}`} />
      {error && <Alert severity="error" sx={{my: 2}}>{error}</Alert>}
      {pageLoading ? <></> : schedules.length === 0 ?
        <SectionCard size={4}>
          {tc("no_schedules")}
        </SectionCard>
        :
        schedules.slice(0, visibleCount).map(schedule => (
        <SectionCard size={2} sx={{mt: 2, px: {xs: 1.5, sm: 4}, cursor: "pointer"}} key={schedule.id} display="flex" alignItems="center" justifyContent="space-between"
                     onClick={() => setSelectedSchedule(schedule)} >
          <ServiceIcon>
            <Typography fontWeight="bold">{schedule.title}</Typography>
            <Typography fontSize="11px" color="text.secondary">{schedule.guestName ?? t("common.guest_unknown")} | {t("common.room")} {schedule.room ?? t("common.unknown")}</Typography>
            <Box mt={1} fontSize={{xs: 11, sm: 13}}>
              {new Date(schedule.date).toLocaleDateString(t('date.locale'))} | {formatTimeRange(new Date(schedule.date), schedule.duration)}
            </Box>
          </ServiceIcon>
          <Stack direction="row" alignItems="center">
            {renderActions(schedule)}
          </Stack>
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

      {actionToConfirm &&
        <ConfirmationWithReasonDialog
          onCancel={() => setActionToConfirm(null)}
          onConfirm={handleConfirmedAction}
        />
      }

      <Snackbar
        open={!!actionError}
        autoHideDuration={6000}
        onClose={() => setActionError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setActionError(null)} severity="error" sx={{ width: "100%" }}>
          {actionError}
        </Alert>
      </Snackbar>
    </SectionCard>
  );
}

export default RequestedSchedulesPage;
