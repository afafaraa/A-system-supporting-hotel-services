import {
  MenuItem,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OrderServiceProps } from './OrderServicePage.tsx';
import { useTranslation } from 'react-i18next';
import {addDays, min} from "date-fns";
import {getDateFnsLocale} from "../../../locales/i18n.ts";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import {selectUserDetails} from "../../../redux/slices/userDetailsSlice.ts";
import {useSelector} from "react-redux";
import {useMemo} from "react";

function ServiceCalendar({
  selectedDate,
  timeSlots = [],
  selectedTime,
  serviceAttributeDesc,
  setSelectedTime,
  handleDateChange,
  handleAddToCart,
  specialRequests,
  setSpecialRequests,
}: {
  selectedDate: Date | null;
  timeSlots?: OrderServiceProps[];
  selectedTime: string;
  serviceAttributeDesc: string | null;
  setSelectedTime: (x: string) => void;
  handleDateChange: (date: Date | null) => void;
  handleAddToCart: () => void;
  specialRequests: string | null;
  setSpecialRequests: (value: string | null) => void;
}) {
  const { t } = useTranslation();
  const userDetails = useSelector(selectUserDetails)

  const maxDateForward = useMemo(() => {
    const guestCheckout = userDetails?.guestData?.currentReservation.checkOut;
    const defaultMaxDate = addDays(new Date(), 30);
    return guestCheckout
      ? min([defaultMaxDate, new Date(guestCheckout)])
      : defaultMaxDate;
  }, [userDetails?.guestData?.currentReservation.checkOut])

  const minAllowedTime = new Date();
  minAllowedTime.setHours(minAllowedTime.getHours() + 2);

  const availableTimeSlots = timeSlots.filter(slot =>
    new Date(slot.serviceDate).getTime() >= minAllowedTime.getTime()
  );

  return (
    <SectionCard flexShrink={0} width={{xs: '100%', lg: 'unset'}}>
      <Typography sx={{ fontWeight: '600', fontSize: '20px' }}>
        {t('pages.order_service.bookService')}
      </Typography>
      <Typography mb={3} color="text.secondary">
        {t('pages.order_service.selectDate')} &{' '}
        {t('pages.order_service.selectTime')}
      </Typography>

      <Box flexDirection={{xs: "row", lg: "column"}} style={{display: "flex", gap: "2em", flexWrap: "wrap", justifyContent: "center"}}>
        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale(t("date.locale"))}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate: Date | null) => handleDateChange(newDate)}
              disablePast
              maxDate={maxDateForward}
              sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                padding: 1,
              }}
            />
          </LocalizationProvider>
        </div>
        <div style={{flexGrow: 1}}>
          <Typography mb={1} fontWeight={600}>
            {t('pages.order_service.selectTime')} {`(${availableTimeSlots.length})`}
          </Typography>
          <TextField
            variant="outlined"
            select
            fullWidth
            size="small"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            sx={{"& .MuiOutlinedInput-root": {backgroundColor: "background.default"}}}
          >
            {availableTimeSlots.length === 0 ? (
              <MenuItem disabled>
                {t('pages.order_service.noSlotsAvailable')}
              </MenuItem>
            ) : (
              availableTimeSlots
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

          {serviceAttributeDesc && (<>
            <Typography fontWeight={600} mt={3} mb={1}>
              {t('pages.order_service.orderDetails')}
            </Typography>
            <TextField
              multiline={true}
              maxRows={10}
              contentEditable={false}
              sx={{"& .MuiOutlinedInput-root": {backgroundColor: "background.default"}}}
              fullWidth
              value={serviceAttributeDesc}
            />
          </>)}

          <Typography fontWeight={600} mt={3} mb={1}>
            {t('pages.order_service.specialRequests')}
          </Typography>
          <TextField
            value={specialRequests ?? ""}
            onChange={(e) => setSpecialRequests(e.target.value)}
            multiline={true}
            rows={3}
            placeholder={t('pages.order_service.specialRequests')}
            sx={{"& .MuiOutlinedInput-root": {backgroundColor: "background.default"}}}
            fullWidth
          />
        </div>
      </Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleAddToCart}
        disabled={!selectedTime}
        sx={{
          mt: 3,
          borderRadius: 2,
          py: 1.2,
          fontWeight: '600',
        }}
      >
        {t('pages.order_service.addToCart')}
      </Button>
    </SectionCard>
  );
}

export default ServiceCalendar;
