import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types";
import { Shift } from "../../types";
import {startOfWeek, addWeeks, subWeeks, format, addMinutes} from "date-fns";
import { ScheduleCard, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {DateWithHour} from "../../utils/utils.ts";


const MIN_HOUR = DateWithHour(6);
const MAX_HOUR = DateWithHour(22);

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [shifts, setShifts] = useState<Shift[]>([]);

  const fetchShifts = useCallback(async () => {
    try {
      const res = await axiosAuthApi.get<Shift[]>(
        `/schedule/get/week/employee/${username}?date=${format(currentWeekStart, 'yyyy-MM-dd')}`
      );
      setShifts(res.data);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
  }, [username, currentWeekStart]);

  const fetchDetail = useCallback(async () => {
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
    fetchDetail();
  }, [fetchDetail, fetchShifts]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

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
          <Tab label="Work Schedule" />
          <Tab label="Employee data" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <ScheduleTable
          currentWeekStart={currentWeekStart}
          handlePrevWeek={handlePrevWeek}
          handleNextWeek={handleNextWeek}
          startDate={MIN_HOUR}
          endDate={MAX_HOUR}
        >
          {shifts.map((shift) => {
            const shiftDate = DateWithHour(shift.startHour);
            const duration = (shift.endHour - shift.startHour) * 60;

            return (
              <ScheduleCard
                key={shift.id}
                shift={{
                  id: shift.id,
                  serviceId: shift.serviceId ?? "",          
                  title: shift.title,
                  date: shiftDate,
                  duration,
                  weekday: shift.weekday,
                  guestName: shift.guest,
                  room: undefined,      
                  orderTime: undefined,
                  status: shift.status,
                }}
                startDate={MIN_HOUR}
                onClick={() => console.log("TO DO")}
              >
                <Box gap={5}>
                  <Typography fontWeight="bold">{shift.title}</Typography>
                  <Typography>{shift.guest}</Typography>
                  <Typography color="text.secondary">
                    {duration
                      ? `${format(shiftDate, "HH:mm")} - ${format(addMinutes(shiftDate, duration), "HH:mm")}`
                      : format(shiftDate, "HH:mm")}
                  </Typography>
                  <Typography>{shift.status}</Typography>
                </Box>
                <Box mt={1} textAlign="center">
                  <Button size="small" variant="outlined">
                    Edytuj
                  </Button>
                </Box>
              </ScheduleCard>
            );
          })}
        </ScheduleTable>
      )}

      {tab === 1 && detail && (
        <Box display="flex" flexDirection="column" component={Paper} p={4} mt={2} gap={2}>
          <Typography variant="body1">Name: <strong>{detail.name} {detail.surname}</strong></Typography>
          <Typography variant="body1">Username: <strong>{detail.username}</strong></Typography>
          <Typography variant="body1">Email: <strong>{detail.email}</strong></Typography>
          <Typography variant="body1">Role: <strong>{detail.role}</strong></Typography>
        </Box>
      )}

    </Box>
  );
}

export default EmployeeDetailsPage;