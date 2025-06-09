import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography, Paper, Card, CardContent } from "@mui/material";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
    PieChart, Pie, Cell, Legend as ReLegend
} from "recharts";
import { axiosAuthApi } from "../../middleware/axiosApi";
import StarRating from "../guest/available-services/StarRating";
type PopularService = { name: string; percent: number };
type ServiceStat = {
    id: string | number;
    name: string;
    orderCount: number;
    revenue: number;
    rating: number;
    averageRating: number;
};
type SalesData = { date: string; value: number };

function StatsPage() {
    const [tab, setTab] = useState(0);

    const [totalPurchases, setTotalPurchases] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [popularServices, setPopularServices] = useState<PopularService[]>([]);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [generalRes, serviceRes] = await Promise.all([
                    axiosAuthApi.get("/management/stats"),
                    axiosAuthApi.get("/management/stats/services")
                ]);
                const generalData = generalRes.data;
                setTotalPurchases(generalData.totalPurchases);
                setTotalRevenue(generalData.totalRevenue);
                setPopularServices(generalData.popularServices);
                setSalesData(generalData.salesOverTime);

                const serviceData = serviceRes.data;
                setServiceStats(serviceData);
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        };
        fetchStats();
    }, []);

    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Box p={2} width="100%" mr={4}>
            <Typography variant="h4" gutterBottom>
                Statistics
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="General" />
                <Tab label="Services" />
            </Tabs>

            {tab === 0 && (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    gridTemplateRows="auto auto auto"
                    gap={2}
                >
                    <Card sx={{ gridColumn: 1, gridRow: 1 }}>
                        <CardContent>
                            <Typography variant="subtitle1">Purchased services</Typography>
                            <Typography variant="h3" mt={1}>
                                {totalPurchases}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ gridColumn: 2, gridRow: 1 }}>
                        <CardContent>
                            <Typography variant="subtitle1">Revenue</Typography>
                            <Typography variant="h3" mt={1}>
                                {totalRevenue.toLocaleString()}$
                            </Typography>
                        </CardContent>
                    </Card>

                    <Paper sx={{ p: 2, gridColumn: 3, gridRow: '1 / 4' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Popular services
                        </Typography>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={popularServices}
                                dataKey="percent"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                            >
                                {popularServices.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <ReTooltip />
                            <ReLegend />
                        </PieChart>
                    </Paper>

                    <Paper sx={{ p: 2, gridColumn: '1 / 3', gridRow: '2 / 4' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Sales over time
                        </Typography>
                        <LineChart
                            width={500}
                            height={250}
                            data={salesData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ReTooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </Paper>
                </Box>
            )}
            {tab === 1 && (
                <Box display="flex" flexDirection="column" gap={2}>
                    {serviceStats.map((service) => (
                        <Card key={service.id}>
                            <CardContent>
                                <Typography variant="h6">{service.name}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                                    <Box>
                                        <Typography variant="body2">Orders: {service.orderCount}</Typography>
                                        <Typography variant="body2">Revenue: {service.revenue.toFixed(2)}$</Typography>
                                    </Box>
                                    <Box textAlign="right">
                                        <StarRating rating={[service.rating]} />
                                        <Typography variant="body2">
                                            Avg: {service.averageRating.toFixed(2)} / 5
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default StatsPage;
