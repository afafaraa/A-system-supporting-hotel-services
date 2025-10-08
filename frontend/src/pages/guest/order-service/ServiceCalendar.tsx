import {
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OrderServiceProps } from './OrderServicePage.tsx';
import { useTranslation } from 'react-i18next';

function ServiceCalendar({
  selectedDate,
  timeSlots = [],
  selectedTime,
  setSelectedTime,
  handleDateChange
}: {
  selectedDate: Date | null;
  timeSlots?: OrderServiceProps[];
  selectedTime: string;
  setSelectedTime: (x: string) => void;
  handleDateChange: (date: Date | null) => void;
}) {
  const { t } = useTranslation();

  return (
      <Card
        sx={{
          borderRadius: 2,
          p: '15px 20px',
          flexShrink: 0,
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: '600', fontSize: '20px' }}>
            {t('pages.order_service.bookService')}
          </Typography>
          <Typography mb={3} color="text.secondary">
            {t('pages.order_service.selectDate')} &{' '}
            {t('pages.order_service.selectTime')}
          </Typography>

          <Typography sx={{ mb: 1, fontWeight: '600' }}>
            {t('pages.order_service.selectDate')}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => handleDateChange(newDate)}
              sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: '10px',
                padding: '15px 10px 15px 10px',
                width: '100%',
              }}
            />
          </LocalizationProvider>

          <Typography mt={3} mb={1} fontWeight={600}>
            {t('pages.order_service.selectTime')} {`(${timeSlots.length})`}
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            sx={{
              backgroundColor: "background.default",
              borderRadius: '5px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          >
            {timeSlots.length === 0 ? (
              <MenuItem disabled>
                {t('pages.order_service.noSlotsAvailable')}
              </MenuItem>
            ) : (
              timeSlots
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
                    <MenuItem key={slot.id} value={slot.id}>
                      {timeLabel} — {slot.employeeFullName}
                    </MenuItem>
                  );
                })
            )}
          </TextField>

          <Typography fontWeight={600} mt={3} mb={1}>
            {t('pages.order_service.specialRequests')}
          </Typography>
          <TextField
            placeholder={t('pages.order_service.specialRequests')}
            sx={{
              backgroundColor: "background.default",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
              borderRadius: '5px',
              minHeight: '100px',
            }}
            fullWidth
          />
        </CardContent>
      </Card>
  );
}

export default ServiceCalendar;
