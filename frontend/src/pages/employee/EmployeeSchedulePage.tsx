import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {addDays, addMinutes, addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {Schedule, ScheduleCard, ScheduleData, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {useTranslation} from "react-i18next";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {getYearWeek, orderStatus} from "../../utils/utils.ts";
import ScheduleDetails from "./ScheduleDetails.tsx";

function EmployeeSchedulePage() {
  const user = useSelector(selectUser);
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [scheduleCache, setScheduleCache] = useState<Map<number, Schedule[]>>(new Map());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.${key}`);

  useEffect(() => {
    if (user === null) return;
    const yearWeek = getYearWeek(currentWeekStart);
    if (tab === 0 && !scheduleCache.has(yearWeek)) {
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
  }, [user, currentWeekStart, scheduleCache, tab]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const renderShiftCard = (schedule: Schedule) => {
    return (
      <ScheduleCard key={schedule.id} shift={schedule} startDate={startDate} onClick={() => setSelectedSchedule(schedule)}>
        <Box gap={5}>
          <Typography fontWeight="bold">{schedule.title}</Typography>
          <Typography>{schedule.room}</Typography>
          <Typography color="text.secondary">
            {schedule.duration ?
              `${format(schedule.date, "HH:mm")} - ${format(addMinutes(schedule.date, schedule.duration), "HH:mm")}`
              : format(schedule.date, "HH:mm")
            }
          </Typography>
          <Box component="span" sx={{px: 1, py: 0.5, borderRadius: 1, color: `${orderStatus[schedule.status].text}`,
            backgroundColor: `${orderStatus[schedule.status].background}`, display: 'inline-block'}}>
            {schedule.status}
          </Box>
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

      <ScheduleTable currentWeekStart={currentWeekStart}
                     handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek}
                     startDate={startDate} endDate={endDate}>
        {tab === 0 && scheduleCache.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        {tab === 1 && <>Nothing...</>}
      </ScheduleTable>

      {selectedSchedule && (
        <ScheduleDetails open={true}
                         onClose={() => setSelectedSchedule(null)}
                         schedule={selectedSchedule}
        />
      )}
    </PageContainer>
  );
}

export default EmployeeSchedulePage;
