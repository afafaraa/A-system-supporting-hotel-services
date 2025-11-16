import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';
import {addService, selectServicesCart} from '../../../redux/slices/servicesCartSlice.ts';
import {useDispatch, useSelector} from 'react-redux';
import ServiceDescription from './ServiceDescription.tsx';
import ServiceCalendar from './ServiceCalendar.tsx';
import AppLink from "../../../components/ui/AppLink.tsx";
import ServiceAttributeDetails from "./ServiceAttributeDetails.tsx";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {useTranslation} from "react-i18next";
import ServiceReviews from "./ServiceReviews.tsx";

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
  const cartItems = useSelector(selectServicesCart);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [serviceAttributes, setServiceAttributes] = useState<{desc: string | null, price: number | null}>({desc: null, price: null});
  const [specialRequests, setSpecialRequests] = useState<string | null>(null);

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
          inCart: cartItems.some(item => item.id === s.id),
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

  const handleAddToCart = () => {
    if (!selectedTime) return;
    const slot = timeSlots.find((s) => s.id === selectedTime);
    if (!slot) return;
    dispatch(addService({ id: selectedTime, specialRequests: concatSpecialRequests(), customPrice: serviceAttributes.price ?? undefined }));
    setAddedToCart(true);
  }

  const concatSpecialRequests = (): string | null => {
    if (serviceAttributes.desc && specialRequests) return `${serviceAttributes.desc}\n${specialRequests}`;
    return serviceAttributes.desc ?? specialRequests ?? null;
  }

  return (
    <main style={{ width: '100%' }}>
      <AppLink to="/guest/available" display="inline-block" color="text.primary" mb={1}>{'< ' + t('pages.order_service.goBack')}</AppLink>
      <Stack flexDirection={{xs: "column", lg: "row"}} gap={3} alignItems="flex-start">
        <Stack flexDirection="column" gap="inherit" flexGrow={1} width="100%">
          <ServiceDescription
            service={service}
            selectedTime={selectedTime}
            handleAddToCart={handleAddToCart}
          />
          <ServiceAttributeDetails
            service={service}
            setServiceAttributes={setServiceAttributes}
          />
          <ServiceReviews ratings={service.rating}/>
        </Stack>
        <ServiceCalendar
          selectedDate={selectedDate}
          serviceAttributeDesc={serviceAttributes.desc}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          handleDateChange={handleDateChange}
          handleAddToCart={handleAddToCart}
          specialRequests={specialRequests}
          setSpecialRequests={setSpecialRequests}
        />
      </Stack>

      <Snackbar
        open={addedToCart}
        autoHideDuration={6000}
        onClose={() => setAddedToCart(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setAddedToCart(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {t('pages.order_service.addedToCartMessage')}
        </Alert>
      </Snackbar>
    </main>
  );
}

export default OrderServicePage;
