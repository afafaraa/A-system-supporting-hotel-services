import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Chip,
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
  CalendarMonth,
  Weekend,
} from '@mui/icons-material';
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
  Legend,
} from 'recharts';
import { SectionCard } from '../../theme/styled-components/SectionCard.ts';
import SectionTitle from '../../components/ui/SectionTitle.tsx';
import {
  ExtendedStats,
  MlPredictionResponse,
  BasicStat,
} from '../../types/service_stat';

const formatNumber = (num: number | string | null, decimals = 2): string => {
  if (num === null || num === undefined || num === '') return '-';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '-';
  return n.toLocaleString('pl-PL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

function StatsPage() {
  const { t } = useTranslation();
  const tc = useCallback(
    (key: string) => t(`pages.manager.statistics.${key}`),
    [t]
  );

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
        console.log('Extended stats fetched: ', res.data);
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
        return (
          <CalendarToday fontSize="large" sx={{ color: 'primary.main' }} />
        );
      case 2:
        return (
          <PersonOutline fontSize="large" sx={{ color: 'secondary.main' }} />
        );
      case 3:
        return <AttachMoney fontSize="large" sx={{ color: 'success.main' }} />;
      case 4:
        return (
          <PeopleAltOutlined fontSize="large" sx={{ color: 'info.main' }} />
        );
      default:
        return null;
    }
  };

  const formattedPredictions = useMemo(() => {
    if (!mlPredict) return [];
    return mlPredict.predictions.map((p) => ({
      ...p,
      predictedRevenue: parseFloat(p.predictedRevenue.toFixed(2)),
      predictedOccupancy: parseFloat(p.predictedOccupancy.toFixed(2)),
    }));
  }, [mlPredict]);

  const formatedExtended = useMemo(() => {
    if (!extended) return null;

    return {
      ...extended,
      predictions: extended.predictions
        ? {
            ...extended.predictions,
            rrevenueForecast7Days: parseFloat(
              extended.predictions.revenueForecast7Days.toFixed(2)
            ),
            revenueForecast30Days: parseFloat(
              extended.predictions.revenueForecast30Days.toFixed(2)
            ),
            occupancyForecast7Days: parseFloat(
              extended.predictions.occupancyForecast7Days.toFixed(2)
            ),
            occupancyForecast30Days: parseFloat(
              extended.predictions.occupancyForecast30Days.toFixed(2)
            ),
          }
        : undefined,
      trends: {
        ...extended.trends,
        revenueGrowthPercent: parseFloat(
          extended.trends.revenueGrowthPercent.toFixed(2)
        ),
        occupancyGrowthPercent: parseFloat(
          extended.trends.occupancyGrowthPercent.toFixed(2)
        ),
        bookingGrowthPercent: parseFloat(
          extended.trends.bookingGrowthPercent.toFixed(2)
        ),
      },
      seasonality: {
        ...extended.seasonality,
        weekdayVsWeekend: extended.seasonality.weekdayVsWeekend
          ? {
              weekdayAvgOccupancy: parseFloat(
                extended.seasonality.weekdayVsWeekend.weekdayAvgOccupancy.toFixed(
                  2
                )
              ),
              weekendAvgOccupancy: parseFloat(
                extended.seasonality.weekdayVsWeekend.weekendAvgOccupancy.toFixed(
                  2
                )
              ),
              difference: parseFloat(
                extended.seasonality.weekdayVsWeekend.difference.toFixed(2)
              ),
            }
          : undefined,
        peakMonths: extended.seasonality.peakMonths.map((m) => ({
          ...m,
          avgOccupancy: parseFloat(m.avgOccupancy.toFixed(2)),
          totalRevenue: parseFloat(m.totalRevenue.toFixed(2)),
        })),
        peakDaysOfWeek: extended.seasonality.peakDaysOfWeek.map((d) => ({
          ...d,
          avgOccupancy: parseFloat(d.avgOccupancy.toFixed(2)),
          avgRevenue: parseFloat(d.avgRevenue.toFixed(2)),
        })),
      },
      topServices: extended.topServices.map((s) => ({
        ...s,
        improvementPercentage: parseFloat(s.improvementPercentage.toFixed(2)),
      })),
    };
  }, [extended]);

  const getTopServiceLabel = (percent: number) => {
    if (percent === 100) return <Chip label={tc('newService')} color="primary" size="small" />;
    else if (percent > 50) return <Chip label={tc('trending')} color="warning" size="small" />;
    else return <Chip sx={{ visibility: "hidden" }} label=" " size="small" />;
  }

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
                    backgroundColor: 'background.default',
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={0.5}
                        >
                          {tc(s.name)}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {s.orderCount !== null
                            ? formatNumber(s.orderCount, 0)
                            : `${formatNumber(s.revenue, 2)} $`}
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
                    {formatNumber(mlPredict.accuracyRevenue, 2)}%
                  </Typography>
                  <Typography variant="body2">
                    {tc('accuracyOccupancy')}:{' '}
                    {formatNumber(mlPredict.accuracyOccupancy, 2)}%
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
                    <LineChart data={formattedPredictions}>
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
                    <LineChart data={formattedPredictions}>
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
        ) : formatedExtended ? (
          <Grid container spacing={2}>
            {formatedExtended.topServices && (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignContent="center"
                      justifyContent="space-between"
                      mb={2}
                      sx={{ height: '100%' }}
                      
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {tc('topServices')}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {formatedExtended.topServices.map((s) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              height: '100%',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                              },
                              backgroundColor: 'background.default',
                            }}
                          >
                            <CardContent sx={{ height: '100%' }}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                flexDirection="column"
                                height="100%"
                              >
                                <Box mb={4}>
                                  <Typography variant="h5">{s.serviceName}</Typography>
                                </Box>

                                <Box
                                  display="flex"
                                  flexDirection="column"
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    {tc('count')}:
                                  </Typography>
                                  <Box textAlign="center">
                                    <Typography variant="h5" fontWeight="bold">
                                      {s.currentWeekCount}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {tc('change')}:
                                  </Typography>
                                  <Box display="flex" flexDirection="column" textAlign="center" gap={2}>
                                    <Typography variant="h5" fontWeight="bold">
                                      {formatNumber(s.improvementPercentage)}%
                                    </Typography>
                                    {getTopServiceLabel(s.improvementPercentage)}
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {formatedExtended.predictions && (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {tc('forecastPredictions')}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <CalendarMonth color="primary" />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {tc('revenue7Days') || '7-Day Revenue Forecast'}
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold">
                            $
                            {formatNumber(
                              formatedExtended.predictions.revenueForecast7Days,
                              2
                            )}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <CalendarMonth color="primary" />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {tc('revenue30Days') || '30-Day Revenue Forecast'}
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold">
                            $
                            {formatNumber(
                              formatedExtended.predictions
                                .revenueForecast30Days,
                              2
                            )}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <PeopleAltOutlined color="success" />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {tc('occupancy7Days') ||
                                '7-Day Occupancy Forecast'}
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold">
                            {formatNumber(
                              formatedExtended.predictions
                                .occupancyForecast7Days,
                              2
                            )}
                            %
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <PeopleAltOutlined color="success" />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {tc('occupancy30Days') ||
                                '30-Day Occupancy Forecast'}
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold">
                            {formatNumber(
                              formatedExtended.predictions
                                .occupancyForecast30Days,
                              2
                            )}
                            %
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {tc('trends')}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {[
                      {
                        label: tc('revenueGrowth'),
                        value: formatedExtended.trends.revenueGrowthPercent,
                      },
                      {
                        label: tc('occupancyGrowth'),
                        value: formatedExtended.trends.occupancyGrowthPercent,
                      },
                      {
                        label: tc('bookingGrowth'),
                        value: formatedExtended.trends.bookingGrowthPercent,
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
                            {formatNumber(tItem.value, 2)}%
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {formatedExtended.seasonality?.weekdayVsWeekend && (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {tc('weekdayVsWeekend') ||
                        'Weekday vs Weekend Comparison'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                            textAlign: 'center',
                          }}
                        >
                          <CalendarToday color="primary" fontSize="large" />
                          <Typography variant="subtitle1" mt={1}>
                            {tc('weekdayOccupancy') || 'Weekday Avg'}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {formatNumber(
                              formatedExtended.seasonality.weekdayVsWeekend
                                .weekdayAvgOccupancy,
                              2
                            )}
                            %
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Weekend color="secondary" fontSize="large" />
                          <Typography variant="subtitle1" mt={1}>
                            {tc('weekendOccupancy') || 'Weekend Avg'}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {formatNumber(
                              formatedExtended.seasonality.weekdayVsWeekend
                                .weekendAvgOccupancy,
                              2
                            )}
                            %
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                            textAlign: 'center',
                          }}
                        >
                          {formatedExtended.seasonality.weekdayVsWeekend
                            .difference >= 0 ? (
                            <TrendingUp color="success" fontSize="large" />
                          ) : (
                            <TrendingDown color="error" fontSize="large" />
                          )}
                          <Typography variant="subtitle1" mt={1}>
                            {tc('difference') || 'Difference'}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {formatNumber(
                              formatedExtended.seasonality.weekdayVsWeekend
                                .difference,
                              2
                            )}
                            %
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {tc('occupancyByDay') || 'Occupancy & Revenue by Day'}
                  </Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={formatedExtended.seasonality.peakDaysOfWeek}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dayName" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="avgOccupancy"
                        fill="#1976d2"
                        radius={[8, 8, 0, 0]}
                        name="Avg Occupancy %"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="avgRevenue"
                        fill="#2e7d32"
                        radius={[8, 8, 0, 0]}
                        name="Avg Revenue ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {tc('peakMonths')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatedExtended.seasonality.peakMonths}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar
                        dataKey="totalRevenue"
                        fill="#2e7d32"
                        radius={[8, 8, 0, 0]}
                      />
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
