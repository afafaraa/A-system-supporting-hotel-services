import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { axiosAuthApi } from '../../middleware/axiosApi';
import { useTranslation } from 'react-i18next';
import {
  CalendarToday,
  PersonOutline,
  AttachMoney,
  PeopleAltOutlined,
  InfoOutlined,
  TrendingDown,
  TrendingUp,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { ExtendedStats, MlPredictionResponse, BasicStat } from '../../types/service_stat';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
} from 'recharts';
import { SectionCard } from '../../theme/styled-components/SectionCard.ts';
import SectionTitle from '../../components/ui/SectionTitle.tsx';

function StatsPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.statistics.${key}`);

  const [basicStats, setBasicStats] = useState<BasicStat[]>([]);
  const [loadingBasic, setLoadingBasic] = useState(true);

  const [mlPredict, setMlPredict] = useState<MlPredictionResponse>();
  const [loadingML, setLoadingMl] = useState(true);

  const [extended, setExtended] = useState<ExtendedStats>();
  const [loadingExtended, setLoadingExtended] = useState(true);

  useEffect(() => {
    const fetchBasic = async () => {
      try {
        const res = await axiosAuthApi.get<BasicStat[]>('/management/stats');
        setBasicStats(res.data);
      } catch (err) {
        console.error('Failed to fetch basic stats ', err);
      } finally {
        setLoadingBasic(false);
      }
    };

    fetchBasic();
  }, []);

  useEffect(() => {
    const fetchMl = async () => {
      try {
        const res = await axiosAuthApi.get<MlPredictionResponse>(
          '/management/stats/ml/predict'
        );
        setMlPredict(res.data);
      } catch (err) {
        console.error('Failed to fetch ml predict ', err);
      } finally {
        setLoadingMl(false);
      }
    };

    fetchMl();
  }, []);

  useEffect(() => {
    const fetchExtended = async () => {
      try {
        const res = await axiosAuthApi.get<ExtendedStats>(
          '/management/stats/extended'
        );
        setExtended(res.data);
      } catch (err) {
        console.error('Failed to fetch stats ', err);
      } finally {
        setLoadingExtended(false);
      }
    };

    fetchExtended();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getIcon = (id: number | string) => {
    switch (id) {
      case 1:
        return <CalendarToday fontSize="large" sx={{ color: 'primary.main' }} />;
      case 2:
        return <PersonOutline fontSize="large" sx={{ color: 'secondary.main' }} />;
      case 3:
        return <AttachMoney fontSize="large" sx={{ color: 'success.main' }} />;
      case 4:
        return <PeopleAltOutlined fontSize="large" sx={{ color: 'info.main' }} />;
      default:
        return null;
    }
  };

  return (
    <SectionCard>
      <Box mb={4}>
        <SectionTitle
          title={
            <>
              <BarChartIcon /> {tc('basicStatsTitle')}
            </>
          }
          subtitle={tc('basicStatsSubtitle')}
          mb={3}
        />

        {loadingBasic ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {basicStats.map((s) => (
              <Grid key={s.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    backgroundColor: 'background.default'
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          {tc(s.name)}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {s.orderCount !== null
                            ? s.orderCount
                            : `${s.revenue} $`}
                        </Typography>
                      </Box>
                      {getIcon(s.id)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          {mlPredict && (
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">
                    {tc('model')}: <strong>{mlPredict.modelType}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {tc('accuracyRevenue')}:{' '}
                    {mlPredict.accuracyRevenue.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2">
                    {tc('accuracyOccupancy')}:{' '}
                    {mlPredict.accuracyOccupancy.toFixed(2)}%
                  </Typography>
                </Box>
              }
            >
              <IconButton size="small">
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <SectionTitle
            title={tc('aiPredictionsTitle')}
            subtitle={tc('aiPredictionsSubtitle')}
            mb={0}
          />
        </Box>

        {loadingML ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : mlPredict ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" mb={2} fontWeight={600}>
                    {tc('predictedRevenue')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={mlPredict.predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                      />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="predictedRevenue"
                        stroke="#1976d2"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" mb={2} fontWeight={600}>
                    {tc('predictedOccupancy')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={mlPredict.predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                      />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="predictedOccupancy"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">{tc('noMlData')}</Typography>
        )}
      </Box>

      <Box>
        <SectionTitle
          title={tc('extendedInsightsTitle')}
          subtitle={tc('extendedInsightsSubtitle')}
          mb={3}
        />

        {loadingExtended ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : extended ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {tc('trends')}
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      {
                        label: tc('revenueGrowth'),
                        value: extended.trends.revenueGrowthPercent,
                      },
                      {
                        label: tc('occupancyGrowth'),
                        value: extended.trends.occupancyGrowthPercent,
                      },
                      {
                        label: tc('bookingGrowth'),
                        value: extended.trends.bookingGrowthPercent,
                      },
                    ].map((tItem) => (
                      <Grid key={tItem.label} size={{ xs: 12, sm: 4 }}>
                        <Card
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            backgroundColor: 'background.default',
                          }}
                        >
                          {tItem.value >= 0 ? (
                            <TrendingUp color="success" fontSize="large" />
                          ) : (
                            <TrendingDown color="error" fontSize="large" />
                          )}
                          <Typography variant="subtitle1" mt={1}>
                            {tItem.label}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {tItem.value.toFixed(2)}%
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {tc('occupancyByDay')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={extended.seasonality.peakDaysOfWeek}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dayName" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="avgOccupancy" fill="#1976d2" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {tc('peakMonths')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={extended.seasonality.peakMonths}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="totalRevenue" fill="#2e7d32" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">{tc('noExtendedData')}</Typography>
        )}
      </Box>
    </SectionCard>
  );
}

export default StatsPage;