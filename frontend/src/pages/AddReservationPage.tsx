import { useEffect, useState } from 'react';
import axiosApi from '../middleware/axiosApi';
import {
    Box,
    FormControl,
    TextField,
    Typography,
    Button,
    MenuItem,
    Alert
} from '@mui/material';

interface Room {
    number: string;
    floor: number;
    capacity: number;
}

interface Credentials {
    username: string;
    password: string;
}

export default function AddGuestPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: ''
    });
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('ACCESS_TOKEN');

    useEffect(() => {
        axiosApi.get<Room[]>('/rooms',{ headers: { Authorization: `Bearer ${token}` } })
          .then(res => setRooms(res.data))
          .catch(() => setError('Nie udało się pobrać listy pokoi'));
    }, []);

    if (!token) {
        setError('Brak tokena. ');
        return;
    }



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setCredentials(null);



        const payload = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            room: { id: formData.roomId },
            checkInDate: new Date(formData.checkInDate).toISOString(),
            checkOutDate: new Date(formData.checkOutDate).toISOString()
        };

        try {
            const res = await axiosApi.post<Credentials>(
                '/secured/add/guest',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCredentials(res.data);
            setFormData({
                name: '',
                surname: '',
                email: '',
                roomId: '',
                checkInDate: '',
                checkOutDate: ''
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Błąd podczas dodawania gościa');
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" mb={3} textAlign="center">
                {credentials ? 'Gość dodany!' : 'Dodaj Gościa'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!credentials && (
                <FormControl component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                        label="Imię"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Nazwisko"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        select
                        label="Pokój"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        required
                    >
                        {rooms.map(room => (
                            <MenuItem key={room.number} value={room.number}>
                                Piętro {room.floor}, pokój {room.number} (miejsc: {room.capacity})
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="datetime-local"
                        label="Zameldowanie"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        type="datetime-local"
                        label="Wymeldowanie"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" color="secondary" onClick={() => {
                            setFormData({ name: '', surname: '', email: '', roomId: '', checkInDate: '', checkOutDate: '' });
                            setError(null);
                        }}>
                            Wyczyść
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Zapisz
                        </Button>
                    </Box>
                </FormControl>
            )}

            {credentials && (
                <Box mt={3} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>Dane dostępu dla gościa:</Typography>
                    <Typography>Username: <strong>{credentials.username}</strong></Typography>
                    <Typography>Password: <strong>{credentials.password}</strong></Typography>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => setCredentials(null)}>
                        Dodaj kolejnego
                    </Button>
                </Box>
            )}
        </Box>
    );
}
