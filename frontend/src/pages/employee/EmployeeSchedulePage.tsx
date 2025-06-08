import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {addDays, addMinutes, addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {useNavigate} from "react-router-dom";
import {Schedule, ScheduleCard, ScheduleData, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {useTranslation} from "react-i18next";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {getYearWeek} from "../../utils/utils.ts";

function EmployeeSchedulePage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [scheduleCache, setScheduleCache] = useState<Map<number, Schedule[]>>(new Map());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.${key}`);

  useEffect(() => {
    if (user === null) return;
    const yearWeek = getYearWeek(currentWeekStart);
    if (!scheduleCache.has(yearWeek)) {
      axiosAuthApi.get<ScheduleData>('/employee/week-schedule?date=' + addDays(currentWeekStart, 1).toISOString())
        .then(res => {
          console.log("Response:", res);
          setScheduleCache(prev => {
            const newMap = new Map(prev);
            newMap.set(yearWeek, res.data.schedules);
            setStartDate(new Date(res.data.startDate));
            setEndDate(new Date(res.data.endDate));
            return newMap;
          });
        })
        .catch(err => console.log("Error:", err));
    }
  }, [user, currentWeekStart, scheduleCache]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const renderShiftCard = (shift: Schedule) => {
    return (
      <ScheduleCard key={shift.id} shift={shift} startDate={startDate} onClick={() => navigate('/employee/service/' + shift.id)}>
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
      </ScheduleCard>
    );
  }

  return (
    <PageContainer title={tc("title")}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={tc("current")} />
        <Tab label={tc("unassigned")} />
      </Tabs>

      <button onClick={() => console.log("Current week schedule:", scheduleCache) }>Wciśnij</button>
      <ScheduleTable currentWeekStart={currentWeekStart}
                     handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek}
                     startDate={startDate} endDate={endDate}>
        {tab === 0 && scheduleCache.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        {tab === 1 && <>Nothing...</>}
      </ScheduleTable>
    </PageContainer>
  );
}

export default EmployeeSchedulePage;
