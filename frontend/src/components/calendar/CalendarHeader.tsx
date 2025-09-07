import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import { addDays } from "date-fns";

interface CalendarHeaderProps {
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentWeek, setCurrentWeek }) => {
  const handlePrevWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const handleNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
  const handleToday = () => setCurrentWeek(new Date());

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" my={2}>
      <IconButton onClick={handlePrevWeek}>
        <ArrowBack />
      </IconButton>
      <Button startIcon={<Today />} onClick={handleToday}>
        Today
      </Button>
      <IconButton onClick={handleNextWeek}>
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

export default CalendarHeader;
