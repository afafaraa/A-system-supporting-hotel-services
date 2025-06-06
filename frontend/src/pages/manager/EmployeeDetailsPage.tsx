import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types";
import { startOfWeek, addWeeks, subWeeks } from "date-fns";
import {Schedule, ScheduleCard, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";


//to do: add shifts from EmployeeData instead of exampleShifts
// shifts: Shift[];

const exampleShifts: Schedule[] = [
  { id: '1', weekday: 0, startHour: 8, endHour: 12, title: 'Cleaning', room: 'Room 301', status: 'IN_PROGRESS'},
  { id: '2', weekday: 1, startHour: 10, endHour: 15, title: 'Cleaning', room: 'Room 302', status: 'REQUESTED' },
  { id: '3', weekday: 2, startHour: 7, endHour: 11, title: 'Cleaning', room: 'Room 305', status: 'REQUESTED' },
  { id: '4', weekday: 4, startHour: 14, endHour: 20, title: 'Cleaning', room: 'Room 310', status: 'REQUESTED' },
  { id: '5', weekday: 5, startHour: 7, endHour: 15, title: 'Cleaning', room: 'Floor 1', status: 'REQUESTED' },
];

const MIN_HOUR = 6;
const MAX_HOUR = 22;

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
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
                       startHour={MIN_HOUR} endHour={MAX_HOUR}>
          {exampleShifts.map((shift) => {
            return (
              <ScheduleCard key={shift.id} shift={shift} startHour={MIN_HOUR}>
                <Box gap={5}>
                  <Typography fontWeight="bold">{shift.title}</Typography>
                  <Typography>{shift.room}</Typography>
                  <Typography color="text.secondary">
                    {shift.startHour}:00-{shift.endHour}:00
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