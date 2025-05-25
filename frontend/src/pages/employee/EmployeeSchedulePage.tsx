import React, {useEffect, useState} from "react";
//import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Box, Button, Paper, Tab, Tabs, Typography} from "@mui/material";
import {addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

interface Shift {
  id: string,
  weekday: number; // 0 = Monday, 6 = Sunday
  startHour: number; // 0-23
  endHour: number; // 0-23
  title: string;
  room: string;
  status: string;
}

function EmployeeSchedulePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const MIN_HOUR = 6;
  const MAX_HOUR = 22;
  const TOTAL_HOURS = MAX_HOUR - MIN_HOUR;
  const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + MIN_HOUR);

  const exampleShifts: Shift[] = [
    { id: '1', weekday: 0, startHour: 8, endHour: 12, title: 'Cleaning', room: 'Room 301', status: 'IN_PROGRESS'},
    { id: '2', weekday: 1, startHour: 10, endHour: 15, title: 'Cleaning', room: 'Room 302', status: 'REQUESTED' },
    { id: '3', weekday: 2, startHour: 7, endHour: 11, title: 'Cleaning', room: 'Room 305', status: 'REQUESTED' },
    { id: '4', weekday: 4, startHour: 14, endHour: 20, title: 'Cleaning', room: 'Room 310', status: 'REQUESTED' },
    { id: '5', weekday: 5, startHour: 7, endHour: 15, title: 'Cleaning', room: 'Floor 1', status: 'REQUESTED' },
  ];

  const exampleShifts2: Shift[] = [
    { id: '6', weekday: 0, startHour: 7, endHour: 8, title: 'Maintenance', room: 'Room 401', status: 'IN_PROGRESS'},
    { id: '7', weekday: 0, startHour: 10, endHour: 13, title: 'Cleaning', room: 'Room 402', status: 'REQUESTED' },
    { id: '8', weekday: 1, startHour: 9, endHour: 12, title: 'Serving dishes', room: 'Room 405', status: 'REQUESTED' },
    { id: '9', weekday: 3, startHour: 15, endHour: 21, title: 'Maintenance', room: 'Room 410', status: 'REQUESTED' },
    { id: '10', weekday: 5, startHour: 8, endHour: 16, title: 'Maintenance', room: 'Floor 2', status: 'REQUESTED' },
  ];

  useEffect(() => {
    if (user === null) return;
    //axiosAuthApi.get('/employee/schedule');
  }, [user]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const Calendar = ({tab}: {tab: number}) => {
    return (
      <>
        <WeekSwitchContainer/>
        <WeekDayLabelsContainer/>
        <Box
          display="grid"
          gridTemplateColumns="50px repeat(7, 1fr)"
          gridTemplateRows={`repeat(10, 60px)`}
          position="relative"
        >
          <TableTimeGrid/>
          {tab === 0 && exampleShifts.map(renderShiftCard)}
          {tab === 1 && exampleShifts2.map(renderShiftCard)}
        </Box>
      </>
    )
  }

  const WeekSwitchContainer = () => {
    return (
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
    );
  };

  const WeekDayLabelsContainer = () => {
    return (
      <Box
        display="grid"
        gridTemplateColumns="50px repeat(7, 1fr)"
        alignItems="center"
        bgcolor="#e0e0e0"
      >
        <Box />
        {(t("date.shortWeekdays", { returnObjects: true }) as string[])
          .map((h, idx) => (
            <Box key={idx} textAlign="center" fontWeight="bold" py={1}>
              {h}
            </Box>
          ))
        }
      </Box>
    );
  };

  const TableTimeGrid = () => {
    return (
      <>
        {hours.map((hour, row) => (
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
      </>
    )
  }

  const renderShiftCard = (shift: Shift) => {
    const col = shift.weekday + 2;
    const startRow = shift.startHour - MIN_HOUR + 1;
    const rowSpan = shift.endHour - shift.startHour;
    return (
      <Paper
        key={shift.id}
        elevation={3}
        sx={{
          gridColumn: col,
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
          <Button size="small" variant="outlined" onClick={() => navigate('/employee/service/' + shift.id)}>
            Show
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <PageContainer title="My Schedule">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Current" />
        <Tab label="Unassigned" />
      </Tabs>
      <Calendar tab={tab}/>
    </PageContainer>
  );
}

export default EmployeeSchedulePage;
