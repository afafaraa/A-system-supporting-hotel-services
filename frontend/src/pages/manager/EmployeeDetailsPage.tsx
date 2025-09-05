import { useParams } from "react-router-dom";
import {useEffect, useState, useCallback, useMemo} from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types";
import {startOfWeek, addWeeks, subWeeks, format, addMinutes, addDays} from "date-fns";
import { ScheduleCard, ScheduleTable} from "../../components/ui/ScheduleTable.tsx";
import {getEndTime, getStartTime, getYearWeek} from "../../utils/utils.ts";
import { useTranslation } from "react-i18next";
import {Schedule} from "../../types/schedule.ts";
import {isAxiosError} from "axios";

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [schedules, setSchedules] = useState<Map<number, Schedule[]>>(new Map());
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.personnelDetails.${key}`);

  const fetchShifts = useCallback(async () => {
    const yearWeek = getYearWeek(currentWeekStart);
    if (schedules.has(yearWeek)) return;
    axiosAuthApi.get<Schedule[]>(`/management/employees/username/${username}/schedule?date=` + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        const updatedMap = new Map(schedules);
        updatedMap.set(yearWeek, res.data);
        setSchedules(updatedMap);
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status !== 404) setError("Unable to fetch schedules: " + err.message);
        } else { setError("An unexpected error occurred while fetching schedules"); }
      });
  }, [currentWeekStart, schedules, username]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosAuthApi.get<Employee>(`/management/employees/username/${username}`);
      console.log(res.data);
      setDetail(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employee details");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchShifts();
    fetchDetails();
  }, [fetchDetails, fetchShifts]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const startDate = useMemo(() =>
    getStartTime(schedules.get(getYearWeek(currentWeekStart))), [schedules, currentWeekStart]);

  const endDate = useMemo(() =>
    getEndTime(schedules.get(getYearWeek(currentWeekStart))), [schedules, currentWeekStart]);

  const renderShiftCard = (schedule: Schedule) => {
    return (
      <ScheduleCard key={schedule.id} schedule={schedule} startDate={startDate}
                    statusName={t(`order_status.${schedule.status}`)} onClick={() => console.log("TO DO")}>
        <Typography fontWeight="bold" noWrap>{schedule.title}</Typography>
        <Typography color="text.secondary">
          {schedule.duration ?
            `${format(schedule.date, "HH:mm")} - ${format(addMinutes(schedule.date, schedule.duration), "HH:mm")}`
            : format(schedule.date, "HH:mm")
          }
        </Typography>
      </ScheduleCard>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display={"flex"} justifyContent="center" p={4}>
        <p>{error}</p>
      </Box>
    )
  }

  return (
    <Box p={2} sx={{ width: "100%", mr: 10 }}>
      <Typography variant="h4" gutterBottom>
        {detail?.name} {detail?.surname}
      </Typography>
      <Box my={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={tc("workSchedule")} />
          <Tab label={tc("employeeData")} />
        </Tabs>
      </Box>
      {tab === 0 && (
        <ScheduleTable
          currentWeekStart={currentWeekStart}
          handlePrevWeek={handlePrevWeek}
          handleNextWeek={handleNextWeek}
          startDate={startDate}
          endDate={endDate}
        >
          {schedules.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        </ScheduleTable>
      )}

      {tab === 1 && detail && (
        <Box display="flex" flexDirection="column" component={Paper} p={4} mt={2} gap={2}>
          <Typography variant="body1">{tc("name")}: <strong>{detail.name} {detail.surname}</strong></Typography>
          <Typography variant="body1">{tc("username")}: <strong>{detail.username}</strong></Typography>
          <Typography variant="body1">{tc("email")}: <strong>{detail.email}</strong></Typography>
          <Typography variant="body1">{tc("role")}: <strong>{detail.role}</strong></Typography>
        </Box>
      )}

    </Box>
  );
}

export default EmployeeDetailsPage;