import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';
import { selectShoppingCart } from '../../../redux/slices/shoppingCartSlice.ts';
import { useSelector } from 'react-redux';
import ServiceDescription from './ServiceDescription.tsx';
import ServiceCalendar from './ServiceCalendar.tsx';
import AppLink from "../../../components/ui/AppLink.tsx";
import ServiceAttributeDetails from "./ServiceAttributeDetails.tsx";
import Stack from "@mui/material/Stack";

export type OrderServiceProps = {
  id: string;
  employeeFullName: string;
  isOrdered: boolean;
  serviceDate: string;
  weekday: string;
  inCart: boolean;
  status: string;
};

function OrderServicePage() {
  const params = useParams();
  const location = useLocation();
  const serviceFromState = location.state as ServiceProps | undefined;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [service, setService] = useState<ServiceProps>();
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<OrderServiceProps[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const cartItems = useSelector(selectShoppingCart);

  const fetchServiceData = useCallback(() => {
    if (serviceFromState) {
      setService(serviceFromState);
      return;
    }
    setLoading(true);
    axiosAuthApi
      .get(`/services/one/${params.id}`)
      .then((response) => setService(response.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [params.id, serviceFromState]);

  const fetchSchedule = useCallback((date: Date) => {
    axiosAuthApi
      .get(`/schedule/today/by-service-id/${params.id}/available?date=${date.toISOString()}`)
      .then(response => {
        const scheduleItems = response.data.map((s: OrderServiceProps) => ({
          ...s,
          inCart: cartItems.includes({ id: s.id, type: 'SERVICE' }),
        }));
        setTimeSlots(scheduleItems);
      })
      .catch(error => {
        console.log(error)
      });
  }, [cartItems, params.id]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  useEffect(() => {
    if (service && selectedDate) fetchSchedule(selectedDate);
  }, [service, selectedDate, fetchSchedule]);

  if (loading || service == null) {
    return <p>Loading...</p>;
  }

  const handleDateChange = (date: Date | null) => {
    if (date && date !== selectedDate) {
      setSelectedTime('');
      setTimeSlots([]);
      setSelectedDate(date);
    }
  }

  return (
    <main style={{ width: '100%' }}>
      <AppLink to="/guest/available" display="inline-block" color="text.primary" mb={1}>{"< Go back"}</AppLink>
      <Stack flexDirection={{xs: "column", lg: "row"}} gap={3} alignItems="flex-start">
        <Stack flexDirection="column" gap="inherit" flexGrow={1}>
          <ServiceDescription
            service={service}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
          <ServiceAttributeDetails service={service} />
        </Stack>
        <ServiceCalendar
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          handleDateChange={handleDateChange}
        />
      </Stack>
    </main>
  );
}

export default OrderServicePage;
