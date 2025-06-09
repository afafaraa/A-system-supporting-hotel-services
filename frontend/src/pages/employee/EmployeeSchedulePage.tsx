import {useEffect, useState} from "react";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Alert, Box, Tab, Tabs, Typography} from "@mui/material";
import {addDays, addMinutes, addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {Schedule, ScheduleCard, ScheduleData, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {useTranslation} from "react-i18next";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {getYearWeek, orderStatus} from "../../utils/utils.ts";
import ScheduleDetails from "./ScheduleDetails.tsx";
import {isAxiosError} from "axios";

function EmployeeSchedulePage() {
  const [tab, setTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [assignedScheduleCache, setAssignedScheduleCache] = useState<Map<number, Schedule[]>>(new Map());
  const [unassignedScheduleCache, setUnassignedScheduleCache] = useState<Map<number, Schedule[]>>(new Map());
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

  useEffect(() => {
    if (tab !== 0) return;
    const yearWeek = getYearWeek(currentWeekStart);
    if (assignedScheduleCache.has(yearWeek)) return;
    axiosAuthApi.get<ScheduleData>('/employee/week-schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        console.log("Response:", res);
        setAssignedScheduleCache(prev => {
          const newMap = new Map(prev);
          newMap.set(yearWeek, res.data.schedules);
          setStartDate(new Date(res.data.startDate));
          setEndDate(new Date(res.data.endDate));
          return newMap;
        });
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status === 404) setInfo("No assigned schedules found for this week");
          else setError("Unable to fetch schedules: " + err.message);
        } else {
          setError("An unexpected error occurred while fetching schedules");
        }
      });
  }, [assignedScheduleCache, currentWeekStart, tab]);

  useEffect(() => {
    if (tab !== 1) return;
    const yearWeek = getYearWeek(currentWeekStart);
    if (unassignedScheduleCache.has(yearWeek)) return;
    axiosAuthApi.get<ScheduleData>('/schedule/available/week-schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        console.log("Response2:", res);
        setUnassignedScheduleCache(prev => {
          const newMap = new Map(prev);
          newMap.set(yearWeek, res.data.schedules);
          setStartDate(new Date(res.data.startDate));
          setEndDate(new Date(res.data.endDate));
          return newMap;
        });
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status === 404) setInfo("No available schedules was found for this week");
          else setError("Unable to fetch schedules: " + err.message);
        } else {
          setError("An unexpected error occurred while fetching schedules");
        }
      });
  }, [unassignedScheduleCache, currentWeekStart, tab]);

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
                     startDate={startDate} endDate={endDate}
                     InfoContainer={
                      <>
                        {info && <Alert severity="info" sx={{border: '1px solid blue', my: 2}}>{info}.</Alert>}
                        {error && <Alert severity="error" sx={{border: '1px solid red', my: 2}}>{error}.</Alert>}
                      </>
                     }>
        {tab === 0 && assignedScheduleCache.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
        {tab === 1 && unassignedScheduleCache.get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
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
