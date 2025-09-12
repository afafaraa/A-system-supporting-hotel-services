import { useState, useEffect } from "react";
import {Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { useTranslation } from "react-i18next";
import { CalendarToday, PersonOutline, AttachMoney, PeopleAltOutlined } from "@mui/icons-material";

type ServiceStat = {
    id: string | number;
    name: string;
    orderCount?: number;
    revenue?: number;
};

const mockData: ServiceStat[] = [
    { id: 1, name: 'Today\'s Bookings', orderCount: 12, revenue: undefined },
    { id: 2, name: 'Check-ins', orderCount: 8, revenue: undefined },
    { id: 3, name: 'Revenue', orderCount: undefined, revenue: 420 },
    { id: 4, name: 'Total Guests', orderCount: 6, revenue: undefined },
];

function StatsPage() {
    const { t } = useTranslation();
    const tc = (key: string) => t(`pages.stats.${key}`);

    return (
        <Grid container spacing={3} sx={{ mt: 5 }}>
            {mockData.map((stat) => (
                <Grid 
                    size={{ xs: 12, sm: 6, md: 3 }} 
                    key={stat.id}
                    
                >
                    <Card>
                        <CardContent sx={{ width: '100%', minHeight: 100 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" flexDirection="column"  gap={1}>   
                                    <Typography variant="body2">{stat.name}</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stat.orderCount !== undefined
                                            ? stat.orderCount
                                            : stat.revenue + " $" }
                                    </Typography>
                                </Box>
                                {stat.id === 1 && <CalendarToday fontSize="large" sx={{ color: 'primary.main' }} />}
                                {stat.id === 2 && <PersonOutline fontSize="large" sx={{ color: 'lightGreen' }} />}
                                {stat.id === 3 && <AttachMoney fontSize="large" sx={{ color: 'lightGreen' }} />}
                                {stat.id === 4 && <PeopleAltOutlined fontSize="large" sx={{ color: 'primary.main' }} />}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default StatsPage;
