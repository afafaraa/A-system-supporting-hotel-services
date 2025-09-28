import { useNavigate, useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { axiosAuthApi } from '../../middleware/axiosApi';
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { Employee } from '../../types';
import { useTranslation } from 'react-i18next';
import { ArrowBack } from '@mui/icons-material';
import { SectionCard } from '../../theme/styled-components/SectionCard';
import Calendar from "../../components/ui/calendar/Calendar.tsx";

function EmployeeDetailsPage() {
  const { username } = useParams<{ username: string }>();
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const tc = useCallback((key: string) => t(`pages.manager.employee_details.${key}`), [t]);
  const navigate = useNavigate();

  const fetchDetails = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosAuthApi.get<Employee>(
        `/management/employees/username/${username}`
      );
      setDetail(res.data);
    } catch (err) {
      console.error(err);
      setError(tc('errorFetch'));
    } finally {
      setLoading(false);
    }
  }, [username, tc]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!detail) {
    return (
      <Typography sx={{ textAlign: 'center', mt: 4 }}>
        {tc("notFound")}
      </Typography>
    );
  }

  return (
    <SectionCard position="relative">
      <Button
        variant="text"
        startIcon={<ArrowBack />}
        onClick={() => {
          navigate('/employees');
        }}
        sx={{ mb: 1 }}
      >
        {t('buttons.back')}
      </Button>
      <Typography variant="h5" fontWeight="bold">
        {tc('title')}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        mb={3}
        gutterBottom
      >
        {tc('subtitle')}
      </Typography>
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              {tc('full_name')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {`${detail.name} ${detail.surname}`}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              {tc("email")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {detail.email}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              {tc("department")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t(`common.department.${(detail.employeeData?.department ?? "").toLowerCase()}`)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold">
              {tc("assigned_services")}
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent="flex-start"
              mt={1}
            >
              {detail.employeeData?.sectors?.map((area: string, idx: number) => (
                <Chip
                  key={idx}
                  label={t(`common.sectors.${area.toLowerCase()}`)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Calendar title={t("pages.employee.calendar.title")}
                subtitle={tc("subtitle")}
                fetchingUrl={`/management/employees/username/${username}/schedule?date=`}
      />
    </SectionCard>
  );
}

export default EmployeeDetailsPage;
