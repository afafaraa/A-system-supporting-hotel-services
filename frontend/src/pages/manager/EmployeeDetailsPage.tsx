import { useParams } from "react-router-dom";
import {useEffect, useState, useCallback} from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../../types";
import { useTranslation } from "react-i18next";
import Calendar from "../../components/ui/calendar/Calendar.tsx";

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.personnelDetails.${key}`);

  const fetchDetails = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosAuthApi.get<Employee>(`/management/employees/username/${username}`);
      console.log(res.data);
      setDetail(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employee details");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display={"flex"} justifyContent="center" p={4}>
        <p>{error}</p>
      </Box>
    )
  }

  return (
    <Box p={2} sx={{ width: "100%", mr: 10 }}>
      <Typography variant="h4" gutterBottom>
        {detail?.name} {detail?.surname}
      </Typography>
      <Box my={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={tc("workSchedule")} />
          <Tab label={tc("employeeData")} />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Calendar />
      )}

      {tab === 1 && detail && (
        <Box display="flex" flexDirection="column" component={Paper} p={4} mt={2} gap={2}>
          <Typography variant="body1">{tc("name")}: <strong>{detail.name} {detail.surname}</strong></Typography>
          <Typography variant="body1">{tc("username")}: <strong>{detail.username}</strong></Typography>
          <Typography variant="body1">{tc("email")}: <strong>{detail.email}</strong></Typography>
          <Typography variant="body1">{tc("role")}: <strong>{detail.role}</strong></Typography>
        </Box>
      )}

    </Box>
  );
}

export default EmployeeDetailsPage;