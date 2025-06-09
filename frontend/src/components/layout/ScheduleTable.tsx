import {Box, Button, Paper, Typography} from "@mui/material";
import {addDays, format} from "date-fns";
import React from "react";
import {useTranslation} from "react-i18next";
import {weekDayToInt} from "../../utils/utils.ts";

export interface ScheduleData {
  schedules: Schedule[],
  startDate: Date,
  endDate: Date,
}

export interface Schedule {
  id: string,
  serviceId: string,
  title: string | undefined,
  date: Date,
  duration: number | undefined,
  weekday: string,
  guestName: string | undefined,
  room: string | undefined,
  orderTime: string | undefined,
  status: string,
}

interface ScheduleTableHeaderProps extends WeekSwitchContainerProps {
  children: React.ReactNode;
  startDate: Date;
  endDate: Date;
  InfoContainer?: React.ReactNode;
}

interface WeekSwitchContainerProps {
  currentWeekStart: Date;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

const density = 4;
const rowSize = 60; // in pixels

export const ScheduleTable = ({children, startDate, endDate, currentWeekStart, handlePrevWeek, handleNextWeek, InfoContainer}: ScheduleTableHeaderProps) => {
  const startHour = startDate.getHours();
  const endHour = endDate.getMinutes() != 0 ? endDate.getHours() + 1 : endDate.getHours();
  const hours = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => i + startHour);

  return (
    <>
      <WeekSwitchContainer currentWeekStart={currentWeekStart}
                           handlePrevWeek={handlePrevWeek}
                           handleNextWeek={handleNextWeek}/>
      <WeekDayLabelsContainer/>
      {InfoContainer && <Box>{InfoContainer}</Box>}
      <Box
        display="grid"
        gridTemplateColumns="50px repeat(7, 1fr)"
        gridTemplateRows={`repeat(${hours.length * density}, ${rowSize / density}px)`}
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
        {format(currentWeekStart, "dd.MM")} - {format(addDays(currentWeekStart, 6), "dd.MM")}
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
            gridRow={`${density * row + 1} / span ${density}`}
            borderRight="1px solid #ccc"
            fontSize="0.8rem"
            color="text.secondary"
          >
            {hour}:00
          </Box>
          {Array.from({ length: 7 }).map((_, col) => (
            <Box
              key={`bg-${row}-${col}`}
              gridColumn={col + 2}
              gridRow={`${density * row + 1} / span ${density}`}
              bgcolor={row % 2 === 0 ? '#f5f5f5' : '#ffffff'}
              borderLeft="1px solid #eaeaea"
              borderBottom="1px solid #eaeaea"
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
  startDate: Date;
  onClick: () => void;
}

export const ScheduleCard = ({children, shift, startDate, onClick}: ScheduleCardProps) => {
  const col = weekDayToInt[shift.weekday] + 2;
  const date = new Date(shift.date);
  const shiftStart = date.getHours() + date.getMinutes() / 60
  const startRow = shiftStart - startDate.getHours();
  const rowSpan = shift.duration ? (shift.duration / 60) : 1;
  return (
    <Paper
      key={shift.id}
      elevation={3}
      onClick={onClick}
      sx={{
        gridColumn: col,
        gridRow: `${Math.round(startRow * density + 1)} / span ${Math.round(rowSpan * density)}`,
        zIndex: `${Math.round(startRow * density + 1)}`,
        p: 1,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        mx: 0.5,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.10)',
          cursor: 'pointer',
          zIndex: 1000,
        },
      }}
    >
      {children}
    </Paper>
  );
}
