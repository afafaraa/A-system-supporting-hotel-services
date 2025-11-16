import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartItem from './ShoppingCartItem.tsx';
import { selectUserDetails } from '../../../redux/slices/userDetailsSlice.ts';
import {
  selectServicesCart,
  clearServicesCart, setServices, removeService,
} from '../../../redux/slices/servicesCartSlice.ts';
import {
  selectReservationsCart,
  clearReservationsCart, setReservations, removeReservation,
} from '../../../redux/slices/reservationsCartSlice.ts';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

export type ServiceCartProps = {
  type: 'SERVICE';
  id: string;
  name: string;
  employeeId: string;
  employeeFullName: string;
  imageUrl?: string;
  price: number;
  datetime: string | Date;
  specialRequests?: string;
}

export type ReservationCartProps = {
  type: 'RESERVATION',
  roomNumber: string;
  reservationPrice: number;
  roomStandardName: string
  checkIn: string;
  checkOut: string;
  guestCount: number;
  specialRequests?: string;
}

type ShoppingCartPopupProps = {
  open: boolean;
  setOpen: () => void;
};

const ShoppingCartPopup = ({ open, setOpen }: ShoppingCartPopupProps) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);
  const servicesCart = useSelector(selectServicesCart);
  const reservationsCart = useSelector(selectReservationsCart);
  const theme = useTheme();
  const { t } = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.shopping_cart");

  const [servicesCartData, setServicesCartData] = useState<ServiceCartProps[]>([]);
  const [reservationsCartData, setReservationsCartData] = useState<ReservationCartProps[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServicesData = useCallback(async () => {
    const servicesList: ServiceCartProps[] = [];
    const itemsForRemoval: Set<string> = new Set<string>();
    for (const item of servicesCart) {
      try {
        const response = await axiosAuthApi.get<ServiceCartProps>(
          `/schedule/get/cart/id/${item.id}`
        );
        const cartItem: ServiceCartProps = response.data;
        cartItem.type = 'SERVICE';
        if (item.customPrice) cartItem.price = item.customPrice;
        if (item.specialRequests) cartItem.specialRequests = item.specialRequests;
        servicesList.push(cartItem);
      } catch (e) {
        itemsForRemoval.add(item.id);
        console.error('Failed to fetch service data:', e);
      }
    }
    if (itemsForRemoval.size > 0)
      dispatch(setServices(servicesCart.filter(item => !itemsForRemoval.has(item.id))));
    setServicesCartData(servicesList);
  }, [dispatch, servicesCart]);

  const fetchReservationsData = useCallback(async () => {
    const reservationsList: ReservationCartProps[] = [];
    const itemsForRemoval: Set<string> = new Set<string>();
    for (const item of reservationsCart) {
      try {
        const response = await axiosAuthApi.get<{price: number, standardName: string}>(
          `/rooms/${item.id}/for-cart`,
          {params: {from: new Date(item.checkIn).toISOString().split('T')[0], to: new Date(item.checkOut).toISOString().split('T')[0]}}
        );
        const cartItem: ReservationCartProps = {
          type: 'RESERVATION',
          roomNumber: item.id,
          reservationPrice: response.data.price,
          roomStandardName: response.data.standardName,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          guestCount: item.guestCount,
          specialRequests: item.specialRequests,
        };
        reservationsList.push(cartItem);
      } catch (e) {
        itemsForRemoval.add(item.id);
        console.error('Failed to fetch reservation data:', e);
      }
    }
    if (itemsForRemoval.size > 0)
      dispatch(setReservations(reservationsCart.filter(item => !itemsForRemoval.has(item.id))));
    setReservationsCartData(reservationsList);
  }, [dispatch, reservationsCart]);

  useEffect(() => {
    if (open) {
      fetchServicesData().then(null);
      fetchReservationsData().then(null);
    }
  }, [servicesCart, reservationsCart, open, fetchServicesData, fetchReservationsData]);

  const clearShoppingCart = () => {
    setServicesCartData([]);
    setReservationsCartData([]);
    dispatch(clearServicesCart());
    dispatch(clearReservationsCart());
    setError(null);
  };

  const totalCartItems = servicesCartData.length + reservationsCartData.length;

  const orderPayload = () => ({
    schedules: servicesCartData.map(item => ({
      id: item.id,
      specialRequests: item.specialRequests,
      customPrice: item.price,
    })),
      reservations: reservationsCartData.map(item => ({
      roomNumber: item.roomNumber,
      checkIn: new Date(item.checkIn).toISOString().split('T')[0],
      checkOut: new Date(item.checkOut).toISOString().split('T')[0],
      guestsCount: item.guestCount,
      specialRequests: item.specialRequests
    })),
  })

  const initiateCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (totalCartItems === 0) {
        setError('Your cart is empty');
        setIsProcessing(false);
        return;
      }

      const response = await axiosAuthApi.post<{url: string, sessionId: string}>(
        '/payment/create-checkout-session',
        {
          cartItems: orderPayload(),
          currency: 'usd',
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          customerEmail: userDetails?.email,
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error('Checkout session URL not found:', response.data);
        setError(t('error.failedToCreateSession'));
      }
    } catch (e) {
      console.error('Failed to create checkout session:', e);
      setError(t('error.failedToCreateSession'));
      setIsProcessing(false);
    }
  };

  const orderServices = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await axiosAuthApi.post('/guest/order/add-to-tab', orderPayload());
      clearShoppingCart();
    } catch (e) {
      if (isAxiosError(e)) {
        const serverMessage =
          e?.response?.data?.message ??
          e?.response?.data ??
          e?.message ??
          'Unknown error';
        console.error(
          'Order services failed:',
          e?.response?.data ?? e?.message ?? e
        );
        setError(serverMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = useMemo(
    () => {
      const servicesTotal = servicesCartData
        .reduce((acc, curr) => acc + curr.price, 0);
      const reservationsTotal = reservationsCartData
        .reduce((acc, curr) => acc + curr.reservationPrice, 0);
      return servicesTotal + reservationsTotal;
    }, [reservationsCartData, servicesCartData]
  );

  if (!open) return null;
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1200,
        }}
        onClick={setOpen}
      />

      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(95vw, 500px)',
          maxHeight: '95dvh',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          zIndex: 1300,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontSize="20px" fontWeight={600}>
            {tc("title")} ({totalCartItems})
          </Typography>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
            <Button
              fullWidth
              size="small"
              color="error"
              variant="outlined"
              onClick={clearShoppingCart}
              disabled={isProcessing}
              startIcon={<DeleteOutlinedIcon />}
            >
              {tc("clearCart")}
            </Button>
            <IconButton onClick={setOpen}>
              <CloseIcon />
            </IconButton>
          </div>
        </Box>

        {error && (
          <Typography component="p" variant="caption" color="error">
            {t(error)}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1, overflowY: 'auto'}}>
          {servicesCartData.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                {tc("services")} ({servicesCartData.length})
              </Typography>
              {servicesCartData.map((item, index) => (
                <ShoppingCartItem
                  key={`service-${index}`}
                  item={item}
                  removeItself={() => {
                    dispatch(removeService({id: item.id}));
                    setServicesCartData(cart => cart.filter((c) => !(c.id === item.id)));
                  }}
                />
              ))}
            </>
          )}

          {reservationsCartData.length > 0 && (
            <>
              {servicesCartData.length > 0 && <Divider sx={{ my: 2 }} />}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                {tc("reservations")} ({reservationsCartData.length})
              </Typography>
              {reservationsCartData.map((item, index) => (
                <ShoppingCartItem
                  key={`reservation-${index}`}
                  item={item}
                  removeItself={() => {
                    dispatch(removeReservation({
                      id: item.roomNumber,
                      checkIn: item.checkIn,
                      checkOut: item.checkOut,
                      guestCount: item.guestCount,
                    }));
                    setReservationsCartData(cart => cart.filter((c) => !(c.roomNumber === item.roomNumber)));
                  }}
                />
              ))}
            </>
          )}

          {totalCartItems === 0 && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {tc("noItems")}
            </Typography>
          )}
        </Box>

        <div style={{position: 'sticky', bottom: 0, marginTop: '1rem'}}>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: theme.palette.primary.light,
            padding: '20px',
            marginBottom: '12px',
          }}
        >
          <Typography fontWeight="600">{tc("summary")}:</Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">{tc("cartValue")}:</Typography>
            <Typography variant="body1" fontWeight="700">
              {totalPrice.toFixed(2)} $
            </Typography>
          </div>
        </Box>

        <div style={{ display: 'flex', gap: '10px'}}>
          <Button
            fullWidth
            variant="outlined"
            onClick={orderServices}
            disabled={totalCartItems === 0 || isProcessing}
          >
            {tc("addToBill")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={initiateCheckout}
            disabled={totalCartItems === 0 || isProcessing}
            loading={isProcessing}
          >
            {tc("proceedToPayment")}
          </Button>
        </div>
        </div>
      </Box>
    </>
  );
};

export default ShoppingCartPopup;
