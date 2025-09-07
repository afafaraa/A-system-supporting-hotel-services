import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { format, addDays, startOfWeek } from "date-fns";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCard from "./CalendarDayCard";

export interface Event {
  title: string;
  time: string;
}

type EventsMap = Record<string, Event[]>;

const WeeklyCalendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // poniedziałek jako start tygodnia
  const days: Date[] = [...Array(7)].map((_, i) => addDays(start, i));

  // przykładowe eventy
  const events: EventsMap = {
    "2025-02-04": [
      { title: "Lunch Service", time: "12:00" },
      { title: "Lunch Service", time: "13:00" },
      { title: "Lunch Service", time: "14:30" },
    ],
    "2025-02-09": [{ title: "Breakfast Service", time: "09:00" }],
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Weekly Calendar
      </Typography>
      <CalendarHeader currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
        {days.map((day) => (
          <CalendarDayCard
            key={day.toISOString()}
            date={day}
            events={events[format(day, "yyyy-MM-dd")] || []}
          />
        ))}
      </Box>
    </Box>
  );
};

export default WeeklyCalendar;
