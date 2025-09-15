import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { axiosAuthApi } from "../../../middleware/axiosApi.ts";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  useTheme,
  MenuItem,
} from "@mui/material";
import { ServiceProps } from "../available-services/AvailableServiceCard.tsx";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { OrderStatus } from "../../../types/schedule.ts";

type ScheduleProps = {
  id: string;
  employeeFullName: string;
  isOrdered: boolean;
  serviceDate: string;
  weekday: string;
  inCart: boolean;
  status: string;
};

function ServiceSchedulePage() {
  const params = useParams();
  const location = useLocation();
  const serviceFromState = location.state as ServiceProps | undefined;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [service, setService] = useState<ServiceProps>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const [timeSlots, setTimeSlots] = useState<ScheduleProps[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    fetchServiceData();
  }, []);

  useEffect(() => {
    if (service && selectedDate) {
      fetchSchedule(selectedDate);
    }
  }, [service, selectedDate]);

  useEffect(()=>{
    if (serviceFromState) return;
    setLoading(true);
    axiosAuthApi.get(`/services/one/${params.id}`)
      .then(response => setService(response.data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [params.id, serviceFromState])
  const fetchServiceData = async () => {
    setLoading(true);

    try {
      const response = await axiosAuthApi.get(`/services/one/${params.id}`);
      setService(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (date: Date) => {
    try {
      // fetch the *week* schedule
      const response = await axiosAuthApi(
        `/schedule/get/week/id/${params.id}`,
        {
          params: { date: date.toISOString().split("T")[0] },
        }
      );

      const cartItems: string[] = JSON.parse(
        localStorage.getItem("CART") || "[]"
      );

      // mark slots that are already in cart
      const scheduleItems = response.data.map((s: ScheduleProps) => ({
        ...s,
        inCart: cartItems.includes(s.id),
      }));

      // keep only slots for the selected date
      const filtered = scheduleItems.filter((slot: ScheduleProps) => {
        const slotDate = new Date(slot.serviceDate);
        return slotDate.toDateString() === date.toDateString();
      });

      // exclude unavailable
      setTimeSlots(
        filtered.filter((slot) => slot.status === OrderStatus.AVAILABLE)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = (slot: ScheduleProps) => {
    const cart: string[] = JSON.parse(localStorage.getItem("CART") || "[]");
    if (!cart.includes(slot.id)) {
      cart.push(slot.id);
      localStorage.setItem("CART", JSON.stringify(cart));
    }
    setSelectedTime(slot.id);
  };

  if(loading || service == null){
    return <p>Loading...</p>;
  }

  return (
    <main style={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* Service info */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.border}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                <img
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    marginTop: 5,
                    objectFit: "cover",
                  }}
                  src={service.image}
                  alt={service.name}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{ fontWeight: "600", fontSize: "1.5em" }}
                  >
                    {service.name}
                  </Typography>
                  <div
                    style={{
                      fontSize: "0.8em",
                      fontWeight: "600",
                      borderRadius: "4px",
                      backgroundColor: service.disabled
                        ? theme.palette.secondary.error
                        : theme.palette.primary.main,
                      color: "white",
                      padding: "2px 4px",
                      width: "fit-content",
                    }}
                  >
                    {service.disabled ? "Unavailable" : "Available"}
                  </div>
                </div>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ margin: "10px 0px", fontSize: "1em" }}
              >
                {service.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.border}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Book your service
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              </LocalizationProvider>

              {/* Time slot selector */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Select time
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                placeholder="Choose a time slot"
                sx={{ mb: 2 }}
              >
                {timeSlots.length === 0 ? (
                  <MenuItem disabled>No slots available</MenuItem>
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
                        .padStart(2, "0")}:${slotDate
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <MenuItem key={slot.id} value={slot.id}>
                          {timeLabel} — {slot.employeeFullName}
                        </MenuItem>
                      );
                    })
                )}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  const slot = timeSlots.find((s) => s.id === selectedTime);
                  if (slot) handleAddToCart(slot);
                }}
                disabled={!selectedTime}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: "600",
                  textTransform: "none",
                }}
              >
                {t("pages.service_schedule.addToCart") || "Add to Cart"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}

export default ServiceSchedulePage;
