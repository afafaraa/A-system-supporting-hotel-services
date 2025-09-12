import { useMemo, useState } from "react";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { format, addDays, startOfWeek } from "date-fns";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCard from "./CalendarDayCard";

export interface Slot {
  id: string;
  serviceId: string;
  title: string;
  date: string;
  duration: number;
  weekday: string;
  guestName: string | null;
  room: string | null;
  orderTime: string | null;
  status: "AVAILABLE" | "ACTIVE" | "CANCELED" | "COMPLETED" | "REQUESTED";
}

type EventsMap = Record<string, Slot[]>;

function groupByDate(slots: Slot[]): EventsMap {
  return slots.reduce((acc, slot) => {
    const key = format(new Date(slot.date), "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {} as EventsMap);
}

const mockData: Slot[] = [
  {
    id: "68bb295775b66a4b486aaab9",
    serviceId: "68bb295775b66a4b486aaaa4",
    title: "Room cleaning",
    date: "2025-09-08T08:30",
    duration: 75,
    weekday: "MONDAY",
    guestName: "Charlie Brown",
    room: "316",
    orderTime: "2025-09-07T21:30",
    status: "CANCELED",
  },
  {
    id: "68bb295775b66a4b486aaac1",
    serviceId: "68bb295775b66a4b486aaaa4",
    title: "Room cleaning",
    date: "2025-09-08T12:00",
    duration: 75,
    weekday: "THURSDAY",
    guestName: "Alice Johnson",
    room: "121",
    orderTime: "2025-09-10T19:00",
    status: "COMPLETED",
  },
  {
    id: "68bb295775b66a4b486aab86",
    serviceId: "68bb295775b66a4b486aaaa7",
    title: "Gym session",
    date: "2025-09-12T11:00",
    duration: 60,
    weekday: "FRIDAY",
    guestName: "Charlie Brown",
    room: "316",
    orderTime: "2025-09-09T19:31:26.995",
    status: "ACTIVE",
  },
];

function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days: Date[] = [...Array(7)].map((_, i) => addDays(start, i));
  const events = useMemo(() => groupByDate(mockData), []);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mt: 5, border: `1px solid`, borderColor: 'divider' }}>
      <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      mb={3}  
      >
        <CalendarHeader currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} isMobile={isMobile} />
        <Box 
          display="grid" 
          gridTemplateColumns={isMobile ? "1fr" : "repeat(7, 1fr)"}
          gap={2} 
          width="100%"
          alignItems="start"
          gridAutoRows="auto"
        >
          {(isMobile ? [currentWeek] : days).map((day) => (
          <CalendarDayCard
            key={day.toISOString()}
            date={day}
            events={events[format(day, "yyyy-MM-dd")] || []}
          />
        ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default WeeklyCalendar;
