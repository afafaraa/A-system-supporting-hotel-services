import { useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types/index";
import { startOfWeek, addWeeks, subWeeks, format } from "date-fns";


//to do: add shifts from EmployeeData instead of exampleShifts
// shifts: Shift[];


const dayIndex: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const exampleShifts = [
  { id: '1', weekday: 'Monday', startHour: 8, endHour: 12, title: 'Cleaning', room: 'Room 301', status: 'IN_PROGRESS'},
  { id: '2', weekday: 'Tuesday', startHour: 10, endHour: 15, title: 'Cleaning', room: 'Room 302', status: 'REQUESTED' },
  { id: '3', weekday: 'Wednesday', startHour: 7, endHour: 11, title: 'Cleaning', room: 'Room 305', status: 'REQUESTED' },
  { id: '4', weekday: 'Friday', startHour: 14, endHour: 20, title: 'Cleaning', room: 'Room 310', status: 'REQUESTED' },
  { id: '5', weekday: 'Saturday', startHour: 7, endHour: 15, title: 'Cleaning', room: 'Floor 1', status: 'REQUESTED' },
];

const MIN_HOUR = 6;
const MAX_HOUR = 22;
const TOTAL_HOURS = MAX_HOUR - MIN_HOUR;

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));


  const headers = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];
  const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + MIN_HOUR);

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
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button variant="outlined" onClick={handlePrevWeek}>
              ← Previous Week
            </Button>
            <Typography variant="h5">
              {format(currentWeekStart, "dd.MM")} - {format(addWeeks(currentWeekStart, 1), "dd.MM")}
            </Typography>
            <Button variant="outlined" onClick={handleNextWeek}>
              Next Week →
            </Button>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="50px repeat(7, 1fr)"
            alignItems="center"
            bgcolor="#e0e0e0" 
          >
            <Box />
            {headers.map((h, idx) => (
              <Box key={idx} textAlign="center" fontWeight="bold" py={1}>
                {h}
              </Box>
            ))}
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="50px repeat(7, 1fr)"
            gridTemplateRows={`repeat(${TOTAL_HOURS}, 60px)`}
            position="relative"
          >
            {hours.slice(0, -1).map((hour, row) => (
              <React.Fragment key={hour}>
                <Box
                  gridColumn={1}
                  gridRow={row + 1}
                  borderRight="1px solid #ccc"
                  pr={1}
                  fontSize="0.75rem"
                  color="#666"
                >
                  {hour}:00
                </Box>
                {Array.from({ length: 7 }).map((_, col) => (
                  <Box
                    key={`bg-${row}-${col}`}
                    gridColumn={col + 2}
                    gridRow={row + 1}
                    bgcolor={row % 2 === 0 ? '#f5f5f5' : '#ffffff'}
                    borderLeft="1px solid #eee"
                    borderBottom="1px solid #eee"
                  />
                ))}
              </React.Fragment>
            ))}
            {exampleShifts.map((shift) => {
              const col = dayIndex[shift.weekday];
              const startRow = shift.startHour - MIN_HOUR + 1;
              const rowSpan = shift.endHour - shift.startHour;

              return (
                <Paper
                  key={shift.id}
                  elevation={3}
                  sx={{
                    gridColumn: col + 2,
                    gridRow: `${startRow} / span ${rowSpan}`,
                    zIndex: 2,
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    mx: 0.5,
                  }}
                >
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
                </Paper>
              );
            })}
          </Box>
        </Box>
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