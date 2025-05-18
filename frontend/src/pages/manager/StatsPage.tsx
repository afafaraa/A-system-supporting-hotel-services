import { useEffect, useState } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Box, Tab, Tabs, Typography, Paper, Card, CardContent, Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";


function StatsPage() {
    const [tab, setTab] = useState(0);
    
    const totalPurchases = 98;
    const totalRevenue = 21321.0;

    const salesData = [
        {date: '17.02', value: 80},
        {date: '18.02', value: 150},
        {date: '19.02', value: 230},
        {date: '20.02', value: 90},
        {date: '21.02', value: 200},
        {date: '22.02', value: 100},
        {date: '23.02', value: 200},
    ];

    const popularServices = [
        {name: 'Room cleaning', percent: 60},
        {name: 'Laundry', percent: 20},
        {name: 'Spa access', percent: 20},
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Box p={2} width={"100%"} mr={10}>
            <Typography variant="h4" gutterBottom>
                Statistics
            </Typography>

            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="General" />
                    <Tab label="Services" />
                </Tabs>
            </Box>

            {tab === 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1">Purchased services</Typography>
                                <Typography variant="h3" mt={1}>
                                    {totalPurchases}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1">Revenue</Typography>
                                <Typography variant="h3" mt={1}>
                                    ${totalRevenue.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle1" gutterBottom>Sales over time</Typography>
                            <LineChart width={500} height={250} data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2}/>
                            </LineChart>
                        </Paper>
                    </Grid>
                        
                </Grid>
            )}

            {tab === 1 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Popular services</Typography>
                            <PieChart width={500} height={250}>
                                <Pie data={popularServices} dataKey="percent" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                    {popularServices.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </Paper>
                    </Grid>
                </Grid>
            )}

        </Box>
    )
}

export default StatsPage;