import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { format, isToday } from "date-fns";
import { Slot } from "./WeeklyCalendar";

interface CalendarDayCardProps {
  date: Date;
  events: Slot[];
}

function CalendarDayCard({ date, events }: CalendarDayCardProps) {
  const highlightToday = isToday(date);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        minHeight: 120,
        borderColor: highlightToday ? 'primary.main' : 'divider',
        backgroundColor: highlightToday ? 'primary.medium' : 'background.paper'
      }}
      elevation={2}
      >
      <CardContent sx={{ p: 1 }}>
        <Box textAlign="center" mb={1}>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {format(date, "EEE")}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {format(date, "d")}
          </Typography>
        </Box>
        
        {events.map((ev) => (
          <Box
            key={ev.id}
            sx={{
              mt: 1,
              p: 1,
              border: "1px solid",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" fontWeight={500}>{ev.title}</Typography>
            <Typography variant="caption" color="text.primary">
              {format(new Date(ev.date), "HH:mm")} ({ev.duration} min) 
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalendarDayCard;
