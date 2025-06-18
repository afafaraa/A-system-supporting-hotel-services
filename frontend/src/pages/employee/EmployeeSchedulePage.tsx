import {useEffect, useState} from "react";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Alert, Box, Tab, Tabs, Typography} from "@mui/material";
import {addDays, addMinutes, addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {OrderStatus, Schedule, ScheduleCard, ScheduleData, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {useTranslation} from "react-i18next";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {getYearWeek, orderStatus} from "../../utils/utils.ts";
import ScheduleDetails from "./ScheduleDetails.tsx";
import {isAxiosError} from "axios";

// TAB 0: Confirmed by employee
// TAB 1: Reserved by guest, but not confirmed by employee
// TAB 2: Only assigned to employee, not reserved by guest

function EmployeeSchedulePage() {
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [confirmedSchedule, setConfirmedSchedule] = useState<Map<number, Schedule[]>>(new Map());
  const [unconfirmedSchedule, setUnconfirmedSchedule] = useState<Map<number, Schedule[]>>(new Map());
  const [allSchedules, setAllSchedules] = useState<Map<number, Schedule[]>>(new Map());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.${key}`);

  useEffect(() => {
    setInfo(null);
    setError(null);
  }, [currentWeekStart, tab]);
  
  const updateSchedulesData = (data: ScheduleData, yearWeek: number) => {
    setAllSchedules(prev => {
      const newMap = new Map(prev);
      newMap.set(yearWeek, data.schedules);
      return newMap;
    });
    setConfirmedSchedule(prev => {
      const newMap = new Map(prev);
      newMap.set(yearWeek, data.schedules.filter(s => [OrderStatus.active, OrderStatus.completed, OrderStatus.canceled].includes(s.status)))
      return newMap;
    })
    setUnconfirmedSchedule(prev => {
      const newMap = new Map(prev);
      newMap.set(yearWeek, data.schedules.filter(s => s.status === OrderStatus.requested))
      return newMap;
    })
    setStartDate(new Date(data.startDate)); // TODO
    setEndDate(new Date(data.endDate));     // TODO
  }

  useEffect(() => {
    const yearWeek = getYearWeek(currentWeekStart);
    if (allSchedules.has(yearWeek)) return;
    axiosAuthApi.get<ScheduleData>('/schedule/week-schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => updateSchedulesData(res.data, yearWeek))
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status === 404) setInfo("No available schedules was found for this week"); // TODO
          else setError("Unable to fetch schedules: " + err.message);
        } else {
          setError("An unexpected error occurred while fetching schedules");
        }
      });
  }, [allSchedules, currentWeekStart, tab]);

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
        <Tab label={tc("confirmed")} />
        <Tab label={tc("unconfirmed")} />
        <Tab label={tc("all")} />
      </Tabs>

      <ScheduleTable currentWeekStart={currentWeekStart}
                     handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek}
                     startDate={startDate} endDate={endDate}
                     InfoContainer={
                      <>
                        {info && <Alert severity="info" sx={{border: '1px solid blue', my: 2}}>{info}.</Alert>}
                        {error && <Alert severity="error" sx={{border: '1px solid red', my: 2}}>{error}.</Alert>}
                      </>
                     }>
        {tab === 0 && confirmedSchedule.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        {tab === 1 && unconfirmedSchedule.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        {tab === 2 && allSchedules.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
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
