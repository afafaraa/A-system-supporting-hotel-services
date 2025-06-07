import {Box, Button, Paper, Typography} from "@mui/material";
import {addWeeks, format} from "date-fns";
import React from "react";
import {useTranslation} from "react-i18next";

export interface Schedule {
  id: string,
  weekday: number; // 0 = Monday, 6 = Sunday
  startHour: number; // 0-23
  endHour: number; // 0-23
  title: string;
  room: string;
  status: string;
}

interface ScheduleTableHeaderProps extends WeekSwitchContainerProps {
  children: React.ReactNode;
  startHour: number;
  endHour: number;
}

interface WeekSwitchContainerProps {
  currentWeekStart: Date;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export const ScheduleTable = ({children, startHour, endHour, currentWeekStart, handlePrevWeek, handleNextWeek}: ScheduleTableHeaderProps) => {
  const hours = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => i + startHour);

  return (
    <>
      <WeekSwitchContainer currentWeekStart={currentWeekStart}
                           handlePrevWeek={handlePrevWeek}
                           handleNextWeek={handleNextWeek}/>
      <WeekDayLabelsContainer/>
      <Box
        display="grid"
        gridTemplateColumns="50px repeat(7, 1fr)"
        gridTemplateRows={`repeat(10, 60px)`}
        position="relative"
      >
        <TableTimeGrid hours={hours}/>
        {children}
      </Box>
    </>
  )
}

const WeekSwitchContainer = ({currentWeekStart, handlePrevWeek, handleNextWeek}: WeekSwitchContainerProps) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Button variant="outlined" onClick={handlePrevWeek}>
        ← {t("schedule_table.previousWeek")}
      </Button>
      <Typography variant="h5">
        {format(currentWeekStart, "dd.MM")} - {format(addWeeks(currentWeekStart, 1), "dd.MM")}
      </Typography>
      <Button variant="outlined" onClick={handleNextWeek}>
        {t("schedule_table.nextWeek")} →
      </Button>
    </Box>
  );
};

const WeekDayLabelsContainer = () => {
  const { t } = useTranslation();
  const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
  return (
    <Box
      display="grid"
      gridTemplateColumns="50px repeat(7, 1fr)"
      alignItems="center"
      bgcolor="#e0e0e0"
    >
      <Box />
      {shortWeekdays
        .map((h, idx) => (
          <Box key={idx} textAlign="center" fontWeight="bold" py={1}>
            {h}
          </Box>
        ))
      }
    </Box>
  );
};

const TableTimeGrid = ({hours}: {hours: number[]}) => {
  return (
    <>
      {hours.map((hour, row) => (
        <React.Fragment key={hour}>
          <Box
            gridColumn={1}
            gridRow={row + 1}
            borderRight="1px solid #ccc"
            pr={1}
            fontSize="0.75rem"
            color="#666"
          >
            {hour}:00
          </Box>
          {Array.from({ length: 7 }).map((_, col) => (
            <Box
              key={`bg-${row}-${col}`}
              gridColumn={col + 2}
              gridRow={row + 1}
              bgcolor={row % 2 === 0 ? '#f5f5f5' : '#ffffff'}
              borderLeft="1px solid #eee"
              borderBottom="1px solid #eee"
            />
          ))}
        </React.Fragment>
      ))}
    </>
  )
}

interface ScheduleCardProps {
  children: React.ReactNode;
  shift: Schedule;
  startHour: number;
}

export const ScheduleCard = ({children, shift, startHour}: ScheduleCardProps) => {
  const col = shift.weekday + 2;
  const startRow = shift.startHour - startHour + 1;
  const rowSpan = shift.endHour - shift.startHour;
  return (
    <Paper
      key={shift.id}
      elevation={3}
      sx={{
        gridColumn: col,
        gridRow: `${startRow} / span ${rowSpan}`,
        zIndex: 2,
        p: 1,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        mx: 0.5,
      }}
    >
      {children}
    </Paper>
  );
}
