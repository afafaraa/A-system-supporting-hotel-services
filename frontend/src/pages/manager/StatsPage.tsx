import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { axiosAuthApi } from '../../middleware/axiosApi';
import { useTranslation } from 'react-i18next';
import {
  CalendarToday,
  PersonOutline,
  AttachMoney,
  PeopleAltOutlined,
} from '@mui/icons-material';
import { ServiceStat } from '../../types/service_stat';

function StatsPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.statistics.${key}`);

  const [stats, setStats] = useState<ServiceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosAuthApi.get<ServiceStat[]>('management/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <Grid container spacing={3} sx={{ mt: 5 }}>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.id}>
          <Card sx={{borderRadius: "12px", p: 0.5}}>
            <CardContent sx={{ width: '100%', minHeight: 100 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2">{tc(stat.name)}</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stat.orderCount !== null
                      ? stat.orderCount
                      : stat.revenue + ' $'}
                  </Typography>
                </Box>
                {stat.id === 1 && (
                  <CalendarToday
                    fontSize="large"
                    sx={{ color: 'primary.main' }}
                  />
                )}
                {stat.id === 2 && (
                  <PersonOutline
                    fontSize="large"
                    sx={{ color: 'lightGreen' }}
                  />
                )}
                {stat.id === 3 && (
                  <AttachMoney fontSize="large" sx={{ color: 'lightGreen' }} />
                )}
                {stat.id === 4 && (
                  <PeopleAltOutlined
                    fontSize="large"
                    sx={{ color: 'primary.main' }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default StatsPage;
