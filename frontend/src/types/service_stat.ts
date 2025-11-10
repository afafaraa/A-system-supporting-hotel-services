export interface BasicStat {
  id: string | number;
  name: string;
  orderCount: number | null;
  revenue: string | null;
}

export interface PredictionSummary {
  revenueForecast7Days: number;
  revenueForecast30Days: number;
  occupancyForecast7Days: number;
  occupancyForecast30Days: number;
  confidence: string;
}

export interface Trends {
  revenueGrowthPercent: number;
  occupancyGrowthPercent: number;
  bookingGrowthPercent: number;
  trend: 'rising' | 'falling' | 'stable';
}

export interface WeekdayVsWeekend {
  weekdayAvgOccupancy: number;
  weekendAvgOccupancy: number;
  difference: number;
}

export interface PeakMonth {
  month: string;
  avgOccupancy: number;
  totalRevenue: number;
}

export interface PeakDay {
  dayName: string;
  avgOccupancy: number;
  avgRevenue: number;
}

export interface Seasonality {
  weekdayVsWeekend: WeekdayVsWeekend;
  peakMonths: PeakMonth[];
  peakDaysOfWeek: PeakDay[];
}

export interface ExtendedStats {
  basicStats: BasicStat[];
  predictions: PredictionSummary;
  trends: Trends;
  seasonality: Seasonality;
}

export interface MlPredictionItem {
  date: string;
  predictedRevenue: number;
  predictedOccupancy: number;
  confidence: number;
}

export interface MlPredictionResponse {
  predictions: MlPredictionItem[];
  accuracyRevenue: number;
  accuracyOccupancy: number;
  modelType: string;
}