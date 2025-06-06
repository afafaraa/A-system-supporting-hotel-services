import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Box, Button, Tab, Tabs, Typography} from "@mui/material";
import {addWeeks, startOfWeek, subWeeks} from "date-fns";
import {useNavigate} from "react-router-dom";
import {Schedule, ScheduleCard, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";

function EmployeeSchedulePage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const startHour = 6;
  const endHour = 22;

  const exampleShifts: Schedule[] = [
    { id: '1', weekday: 0, startHour: 8, endHour: 12, title: 'Cleaning', room: 'Room 301', status: 'IN_PROGRESS'},
    { id: '2', weekday: 1, startHour: 10, endHour: 15, title: 'Cleaning', room: 'Room 302', status: 'REQUESTED' },
    { id: '3', weekday: 2, startHour: 7, endHour: 11, title: 'Cleaning', room: 'Room 305', status: 'REQUESTED' },
    { id: '4', weekday: 4, startHour: 14, endHour: 20, title: 'Cleaning', room: 'Room 310', status: 'REQUESTED' },
    { id: '5', weekday: 5, startHour: 7, endHour: 15, title: 'Cleaning', room: 'Floor 1', status: 'REQUESTED' },
  ];

  const exampleShifts2: Schedule[] = [
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
      <ScheduleTable currentWeekStart={currentWeekStart}
                     handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek}
                     startHour={startHour} endHour={endHour}>
        <>
          {tab === 0 && exampleShifts.map(renderShiftCard)}
          {tab === 1 && exampleShifts2.map(renderShiftCard)}
        </>
      </ScheduleTable>
    )
  }

  const renderShiftCard = (shift: Schedule) => {
    return (
      <ScheduleCard key={shift.id} shift={shift} startHour={startHour}>
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
      </ScheduleCard>
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
