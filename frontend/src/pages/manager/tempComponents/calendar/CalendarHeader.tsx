import { Box, Button, IconButton, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, CalendarMonth } from "@mui/icons-material";
import { addDays } from "date-fns";

interface CalendarHeaderProps {
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  isMobile: boolean;
}

function CalendarHeader({
  currentWeek,
  setCurrentWeek,
  isMobile,
}: CalendarHeaderProps) {
  const handlePrev = () =>
    setCurrentWeek(addDays(currentWeek, isMobile ? -1 : -7));
  const handleNext = () =>
    setCurrentWeek(addDays(currentWeek, isMobile ? 1 : 7));
  const handleToday = () => setCurrentWeek(new Date());

  return (
    <>
      <Box>
        <Box display="flex" alignItems="flex-start" flexDirection="row">
          <CalendarMonth fontSize="large" />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Weekly Calendar
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Your weekly service schedule
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
        <Button
          sx={{
            border: "1px solid",
            borderColor: "divider",
            color: "text.primary",
          }}
          onClick={handleToday}
        >
          Today
        </Button>
        <IconButton
          onClick={handlePrev}
          sx={{
            border: 1,
            borderRadius: 2,
            borderColor: "divider",
            width: 40,
            height: 40,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            border: 1,
            borderRadius: 2,
            borderColor: "divider",
            width: 40,
            height: 40,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </>
  );
}

export default CalendarHeader;
