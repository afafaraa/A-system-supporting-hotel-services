import { useState } from "react";
import { Box, Tab, Tabs, Typography, Paper, Card, CardContent } from "@mui/material";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
    PieChart, Pie, Cell, Legend as ReLegend
} from "recharts";

function StatsPage() {
    const [tab, setTab] = useState(0);

    // TO DO: Fetch data from backend
    const totalPurchases = 98;
    const totalRevenue = 21321.0;

    const salesData = [
        { date: '17.02', value: 80 },
        { date: '18.02', value: 150 },
        { date: '19.02', value: 230 },
        { date: '20.02', value: 90 },
        { date: '21.02', value: 200 },
        { date: '22.02', value: 100 },
        { date: '23.02', value: 200 },
    ];

    const popularServices = [
        { name: 'Room cleaning', percent: 60 },
        { name: 'Laundry', percent: 20 },
        { name: 'Spa access', percent: 20 },
    ];

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
        </Box>
    );
}

export default StatsPage;
