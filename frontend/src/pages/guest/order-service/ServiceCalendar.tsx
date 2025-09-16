import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OrderServiceProps } from './OrderServicePage.tsx';

function ServiceCalendar({
  selectedDate,
  setSelectedDate,
  timeSlots = [],
  selectedTime,
  setSelectedTime,
}: {
  selectedDate: Date | null;
  setSelectedDate: (x: Date | null) => void;
  timeSlots?: OrderServiceProps[];
  selectedTime: string;
  setSelectedTime: (x: string) => void;
}) {
  const theme = useTheme();

  // Filter slots for the selected date
  const filteredSlots = selectedDate
    ? timeSlots.filter((slot) => {
        const slotDate = new Date(slot.serviceDate);
        return (
          slotDate.getFullYear() === selectedDate.getFullYear() &&
          slotDate.getMonth() === selectedDate.getMonth() &&
          slotDate.getDate() === selectedDate.getDate()
        );
      })
    : [];

  return (
    <Grid flexGrow={1} item xs={12} md={6}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.primary.border}`,
          p: '15px 20px',
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: '600', fontSize: '20px' }}>
            Book your service
          </Typography>
          <Typography mb={3} color="text.secondary">
            Select your preferred date and time
          </Typography>

          <Typography sx={{ mb: 1, fontWeight: '600' }}>Select date</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              sx={{
                border: `1px solid ${theme.palette.primary.border}`,
                borderRadius: '10px',
                padding: '15px 10px 15px 10px',
                width: '100%',
              }}
            />
          </LocalizationProvider>

          <Typography mt={3} mb={1} fontWeight={600}>
            Select time
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          >
            {filteredSlots.length === 0 ? (
              <MenuItem disabled>No slots available</MenuItem>
            ) : (
              filteredSlots
                .sort(
                  (a, b) =>
                    new Date(a.serviceDate).getTime() -
                    new Date(b.serviceDate).getTime()
                )
                .map((slot) => {
                  const slotDate = new Date(slot.serviceDate);
                  const timeLabel = `${slotDate
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${slotDate
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}`;

                  return (
                    <MenuItem key={slot.id} value={String(slot.id)}>
                      {timeLabel} — {slot.employeeFullName}
                    </MenuItem>
                  );
                })
            )}
          </TextField>
          <Typography fontWeight={600} mt={3} mb={1}>Special Requests</Typography>
          <TextField
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
              borderRadius: '10px',
              minHeight: '100px'
            }}
            fullWidth
          ></TextField>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ServiceCalendar;
