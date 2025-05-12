import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAuthApi } from '../../middleware/axiosApi';
import {
    Box,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

interface Weekday {
    day: string;
    startHour: number;
    endHour: number;
}

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    disabled: boolean;
    duration: string;
    maxAvailable: number;
    type: string;
    weekday: Weekday;
}

function ServicesListPage() {
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filterName, setFilterName] = useState('');
    const [filterAvailability, setFilterAvailability] = useState<'all' | 'true' | 'false'>('all');
    const [filterType, setFilterType] = useState<'ALL' | 'GENERAL_SERVICE' | 'PLACE_RESERVATION'>('ALL');

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // TO DO: add pagination
        axiosAuthApi.get<Service[]>('/services/available')
            .then(res => setAllServices(res.data))
            .catch(() => setError('Failed to fetch services'))
            .finally(() => setLoading(false));
    }, []);

    const filteredServices = useMemo(() => {
        return allServices.filter(s => {
            if (filterName && !s.name.toLowerCase().includes(filterName.toLowerCase())) {
                return false;
            }
            if (filterAvailability !== 'all') {
                const isUnavailable = s.disabled;
                if (filterAvailability === 'true' && !isUnavailable) return false;
                if (filterAvailability === 'false' && isUnavailable) return false;
            }
            if (filterType !== 'ALL' && s.type !== filterType) {
                return false;
            }
            return true;
        });
    }, [allServices, filterName, filterAvailability, filterType]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={2} sx={{ width: '100%', mr:10 }}>
            <Typography variant="h4" gutterBottom>Services</Typography>

            <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
                <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        label="Name"
                        size="small"
                        value={filterName}
                        onChange={e => setFilterName(e.target.value)}
                    />
                    <FormControl size="small" sx={{ width: 140 }}>
                        <InputLabel id="availability-label">Availability</InputLabel>
                        <Select
                            labelId="availability-label"
                            label="Availability"
                            value={filterAvailability}
                            onChange={e => setFilterAvailability(e.target.value as "all" | "true" | "false")}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="true">Unavailable</MenuItem>
                            <MenuItem value="false">Available</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ width: 180 }}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            label="Type"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value as "ALL" | "GENERAL_SERVICE" | "PLACE_RESERVATION")}
                        >
                            <MenuItem value="ALL">All</MenuItem>
                            <MenuItem value="GENERAL_SERVICE">GENERAL_SERVICE</MenuItem>
                            <MenuItem value="PLACE_RESERVATION">PLACE_RESERVATION</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button variant="contained" onClick={() => navigate('/management/services/new')}>
                    Add Service
                </Button>
            </Box>

            <Paper>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Service Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Availability</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredServices.map(s => (
                            <TableRow key={s.id} hover>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.description}</TableCell>
                                <TableCell>{s.price}</TableCell>
                                <TableCell>{s.type}</TableCell>
                                <TableCell>{s.disabled ? 'Unavailable' : 'Available'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/management/services/${s.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredServices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No services match your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

export default ServicesListPage;