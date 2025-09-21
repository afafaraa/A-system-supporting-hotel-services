import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';
import Grid from '@mui/material/Grid';
import { OrderStatus } from '../../../types/schedule.ts';
import { selectShoppingCart } from '../../../redux/slices/shoppingCartSlice.ts';
import { useSelector } from 'react-redux';
import ServiceDescription from './ServiceDescription.tsx';
import ServiceCalendar from './ServiceCalendar.tsx';
import AppLink from "../../../components/ui/AppLink.tsx";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [service, setService] = useState<ServiceProps>();
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<OrderServiceProps[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const cartItems = useSelector(selectShoppingCart);

  const fetchServiceData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosAuthApi.get(`/services/one/${params.id}`);
      setService(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchSchedule = useCallback(async (date: Date) => {
    try {
      const response = await axiosAuthApi(
        `/schedule/get/week/id/${params.id}`,
        {
          params: { date: date.toISOString().split('T')[0] },
        }
      );

      const scheduleItems = response.data.map((s: OrderServiceProps) => ({
        ...s,
        inCart: cartItems.includes(s.id),
      }));

      const filtered = scheduleItems.filter((slot: OrderServiceProps) => {
        const slotDate = new Date(slot.serviceDate);
        return slotDate.toDateString() === date.toDateString();
      });

      setTimeSlots(
        filtered.filter((slot: OrderServiceProps) => slot.status === OrderStatus.AVAILABLE)
      );
    } catch (error) {
      console.error(error);
    }
  }, [cartItems, params.id]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  useEffect(() => {
    if (service && selectedDate) {
      fetchSchedule(selectedDate);
    }
  }, [service, selectedDate, fetchSchedule]);

  useEffect(() => {
    if (serviceFromState) return;
    setLoading(true);
    axiosAuthApi
      .get(`/services/one/${params.id}`)
      .then((response) => setService(response.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [params.id, serviceFromState]);

  if (loading || service == null) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ width: '100%' }}>
      <AppLink to="/guest/available" display="inline-block" color="text.primary" mb={1}>{"< Go back"}</AppLink>
      <Grid container spacing={3} columns={{ xs: 1, md: 2}}>
        <ServiceDescription
          service={service}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <ServiceCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      </Grid>
    </main>
  );
}

export default OrderServicePage;
