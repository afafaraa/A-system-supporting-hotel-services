import {useEffect, useMemo, useState} from "react";
import AuthenticatedHeader from "../../components/layout/AuthenticatedHeader.tsx";
import {Alert, Tab, Tabs, Typography} from "@mui/material";
import {addDays, addMinutes, addWeeks, format, startOfWeek, subWeeks} from "date-fns";
import {ScheduleCard, ScheduleTable} from "../../components/layout/ScheduleTable.tsx";
import {Schedule, OrderStatus} from "../../types/schedule.ts";
import {useTranslation} from "react-i18next";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {getEndTime, getStartTime, getYearWeek} from "../../utils/utils.ts";
import ScheduleDetails from "./ScheduleDetails.tsx";
import {isAxiosError} from "axios";

// TAB 0: Confirmed by employee
// TAB 1: Reserved by guest, but not confirmed by employee
// TAB 2: Only assigned to employee, not reserved by guest
type TabIndex = 0 | 1 | 2;

const tabFilters: Record<TabIndex, (s: Schedule) => boolean> = {
  0: s => [OrderStatus.active, OrderStatus.completed, OrderStatus.canceled].includes(s.status),
  1: s => s.status === OrderStatus.requested,
  2: () => true
};

function EmployeeSchedulePage() {
  const [tab, setTab] = useState<TabIndex>(0);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [scheduleMap, setScheduleMap] = useState<Record<TabIndex, Map<number, Schedule[]>>>({0: new Map(), 1: new Map(), 2: new Map()});
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.my_schedule.${key}`);
  
  useEffect(() => {
    setError(null);
    setInfo(null);
  }, [currentWeekStart, scheduleMap, tab]);

  useEffect(() => {
    const yearWeek = getYearWeek(currentWeekStart);
    if (scheduleMap[2].has(yearWeek)) return;
    axiosAuthApi.get<Schedule[]>('/schedule?date=' + addDays(currentWeekStart, 1).toISOString())
      .then(res => {
        const updated: Record<TabIndex, Map<number, Schedule[]>> = {
          0: new Map(scheduleMap[0]),
          1: new Map(scheduleMap[1]),
          2: new Map(scheduleMap[2])
        };
        (Object.keys(tabFilters) as unknown as TabIndex[]).forEach(i => {
          updated[i].set(yearWeek, res.data.filter(tabFilters[i]));
        });
        setScheduleMap(updated);
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response?.status !== 404) setError("Unable to fetch schedules: " + err.message);
        } else { setError("An unexpected error occurred while fetching schedules"); }
      });
  }, [currentWeekStart, scheduleMap, tab]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const startDate = useMemo(() =>
    getStartTime(scheduleMap[tab].get(getYearWeek(currentWeekStart))), [scheduleMap, tab, currentWeekStart]);

  const endDate = useMemo(() =>
    getEndTime(scheduleMap[tab].get(getYearWeek(currentWeekStart))), [scheduleMap, tab, currentWeekStart]);

  const renderShiftCard = (schedule: Schedule) => {
    return (
      <ScheduleCard key={schedule.id} schedule={schedule} startDate={startDate}
                    statusName={t(`order_status.${schedule.status}`)} onClick={() => setSelectedSchedule(schedule)}>
        <Typography fontWeight="bold" noWrap>{schedule.title}</Typography>
        <Typography color="text.secondary">
          {schedule.duration ?
            `${format(schedule.date, "HH:mm")} - ${format(addMinutes(schedule.date, schedule.duration), "HH:mm")}`
            : format(schedule.date, "HH:mm")
          }
        </Typography>
      </ScheduleCard>
    );
  }

  return (
    <>
      <AuthenticatedHeader title={tc("title")} />
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
        {scheduleMap[tab].get(getYearWeek(currentWeekStart))?.map(renderShiftCard)}
      </ScheduleTable>

      {selectedSchedule && (
        <ScheduleDetails open={true}
                         onClose={() => setSelectedSchedule(null)}
                         schedule={selectedSchedule}
        />
      )}
    </>
  );
}

export default EmployeeSchedulePage;
