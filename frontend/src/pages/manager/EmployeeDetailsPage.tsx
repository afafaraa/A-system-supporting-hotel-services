import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types";
import {startOfWeek, addWeeks, subWeeks, format, addMinutes} from "date-fns";
import {Schedule, ScheduleCard, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {DateWithHour} from "../../utils/utils.ts";


//to do: add shifts from EmployeeData instead of exampleShifts
// shifts: Shift[];

const exampleShifts: Schedule[] = [
  { id: '1', serviceId: "123", weekday: "MONDAY", date: DateWithHour(8), duration: (12-8)*60, title: 'Cleaning', room: 'Room 301', status: 'IN_PROGRESS', guestName: "John Doe", orderTime: undefined },
  { id: '2', serviceId: "123", weekday: "TUESDAY", date: DateWithHour(10), duration: (15-10)*60, title: 'Cleaning', room: 'Room 302', status: 'REQUESTED', guestName: "Jane Smith", orderTime: undefined },
  { id: '3', serviceId: "123", weekday: "WEDNESDAY", date: DateWithHour(7), duration: (11-7)*60, title: 'Cleaning', room: 'Room 305', status: 'REQUESTED', guestName: "Alice Johnson", orderTime: undefined },
  { id: '4', serviceId: "123", weekday: "FRIDAY", date: DateWithHour(14), duration: (20-14)*60, title: 'Cleaning', room: 'Room 310', status: 'REQUESTED', guestName: "Bob Brown", orderTime: undefined },
  { id: '5', serviceId: "123", weekday: "SATURDAY", date: DateWithHour(7), duration: (15-7)*60, title: 'Cleaning', room: 'Floor 1', status: 'REQUESTED', guestName: "Charlie White", orderTime: undefined },
];

const MIN_HOUR = DateWithHour(6);
const MAX_HOUR = DateWithHour(22);

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

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
    fetchDetail();
  }, [fetchDetail]);

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
      <Box mt={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Work Schedule" />
          <Tab label="Employee data" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <ScheduleTable currentWeekStart={currentWeekStart}
                       handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek}
                       startDate={MIN_HOUR} endDate={MAX_HOUR}>
          {exampleShifts.map((shift) => {
            return (
              <ScheduleCard key={shift.id} shift={shift} startDate={MIN_HOUR} onClick={() => console.log("TO DO")}>
                <Box gap={5}>
                  <Typography fontWeight="bold">{shift.title}</Typography>
                  <Typography>{shift.room}</Typography>
                  <Typography color="text.secondary">
                    {shift.duration ?
                      `${format(shift.date, "HH:mm")} - ${format(addMinutes(shift.date, shift.duration), "HH:mm")}`
                      : format(shift.date, "HH:mm")
                    }
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
          <Typography variant="body1">Status: <strong>{detail.occupation}</strong></Typography>
        </Box>
      )}

    </Box>
  );
}

export default EmployeeDetailsPage;