import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { Event } from "./WeeklyCalendar";

interface CalendarDayCardProps {
  date: Date;
  events: Event[];
}

const CalendarDayCard: React.FC<CalendarDayCardProps> = ({ date, events }) => {
  return (
    <Card variant="outlined" sx={{ minHeight: 140 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {format(date, "EEE d")}
        </Typography>
        {events.length === 0 && (
          <Typography variant="caption" color="text.disabled">
            No events
          </Typography>
        )}
        {events.map((ev, idx) => (
          <Box
            key={idx}
            sx={{
              mt: 1,
              p: 1,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 1,
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body2">{ev.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {ev.time}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalendarDayCard;
