import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
// import { axiosAuthApi } from "../../middleware/axiosApi";
import {
  Box,
  // CircularProgress,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import { Employee } from "../../types";
// import {
//   startOfWeek,
//   addDays,
// } from "date-fns";
// import { getYearWeek } from "../../utils/utils.ts";
// import { useTranslation } from "react-i18next";
// import { Schedule } from "../../types/schedule.ts";
// import { isAxiosError } from "axios";
import { ArrowBack } from "@mui/icons-material";
import WeeklyCalendar from "./tempComponents/calendar/WeeklyCalendar.tsx";

const tempAreas: string[] = ["Breakfast", "Lunch", "Dinner"];

function EmployeeDetailsPage() {
  const [detail, setDetail] = useState<Employee | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [currentWeekStart, setCurrentWeekStart] = useState(
  //   startOfWeek(new Date(), { weekStartsOn: 1 })
  // );
  // const [schedules, setSchedules] = useState<Map<number, Schedule[]>>(
  //   new Map()
  // );
  // const { t } = useTranslation();
  // const tc = (key: string) => t(`pages.personnelDetails.${key}`);
  const navigate = useNavigate();

  // const fetchShifts = useCallback(async () => {
  //   const yearWeek = getYearWeek(currentWeekStart);
  //   if (schedules.has(yearWeek)) return;
  //   axiosAuthApi
  //     .get<Schedule[]>(
  //       `/management/employees/username/${username}/schedule?date=` +
  //         addDays(currentWeekStart, 1).toISOString()
  //     )
  //     .then((res) => {
  //       const updatedMap = new Map(schedules);
  //       updatedMap.set(yearWeek, res.data);
  //       setSchedules(updatedMap);
  //     })
  //     .catch((err) => {
  //       if (isAxiosError(err)) {
  //         if (err.response?.status !== 404)
  //           setError("Unable to fetch schedules: " + err.message);
  //       } else {
  //         setError("An unexpected error occurred while fetching schedules");
  //       }
  //     });
  // }, [currentWeekStart, schedules, username]);

  // const fetchDetails = useCallback(async () => {
  //   setLoading(true);

  //   try {
  //     const res = await axiosAuthApi.get<Employee>(
  //       `/management/employees/username/${username}`
  //     );
  //     console.log(res.data);
  //     setDetail(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch employee details");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [username]);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 5,
        border: `1px solid`,
        borderColor: "divider",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Employee Information
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            mb={3}
            gutterBottom
          >
            View employee information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => {
            navigate("/employees");
          }}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              Full Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {detail?.name} {detail?.surname}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {detail?.email}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              Department
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Food & Beverage
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              Asigned Services
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent="flex-start"
              mt={1}
            >
              {tempAreas?.map((area: string, idx: number) => (
                <Chip
                  key={idx}
                  label={area}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <WeeklyCalendar />
    </Paper>
  );
}

export default EmployeeDetailsPage;
