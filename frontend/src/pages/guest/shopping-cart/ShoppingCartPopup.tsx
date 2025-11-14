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
  clearServicesCart, setServices,
} from '../../../redux/slices/servicesCartSlice.ts';
import {
  selectReservationsCart,
  clearReservationsCart, setReservations,
} from '../../../redux/slices/reservationsCartSlice.ts';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { RoomStandard } from '../../../types/room.ts';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

export type CartProps = {
  id: string;
  type: 'SERVICE' | 'RESERVATION';
  name?: string;
  employeeId?: string;
  employeeFullName?: string;
  imageUrl?: string;
  price?: number;
  datetime?: string;
  standard?: RoomStandard;
  pricePerNight?: number;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  roomNumber?: number;
  specialRequests?: string;
};

type ShoppingCartPopupProps = {
  open: boolean;
  setOpen: () => void;
};

const ShoppingCartPopup = ({ open, setOpen }: ShoppingCartPopupProps) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);
  const servicesCart = useSelector(selectServicesCart);
  const reservationsCart = useSelector(selectReservationsCart);
  const theme = useTheme();
  const { t } = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.shopping_cart");

  const [servicesCartData, setServicesCartData] = useState<CartProps[]>([]);
  const [reservationsCartData, setReservationsCartData] = useState<CartProps[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateReservationPrice = (
    checkIn?: string,
    checkOut?: string,
    pricePerNight?: number
  ): number => {
    if (!checkIn || !checkOut || !pricePerNight) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(
      1,
      Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    return nights * pricePerNight;
  };

  const fetchServicesData = useCallback(async () => {
    const servicesList: CartProps[] = [];
    const itemsForRemoval: Set<string> = new Set<string>();
    for (const item of servicesCart) {
      try {
        const response = await axiosAuthApi.get(
          `/schedule/get/cart/id/${item.id}`
        );
        const cartItem: CartProps = response.data;
        cartItem.type = 'SERVICE';
        if (item.customPrice) cartItem.price = item.customPrice;
        if (item.specialRequests) cartItem.specialRequests = item.specialRequests;
        if (cartItem) servicesList.push(cartItem);
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
    const reservationsList: CartProps[] = [];
    const itemsForRemoval: Set<string> = new Set<string>();
    for (const item of reservationsCart) {
      try {
        const response = await axiosAuthApi.get(`/rooms/by/number/${item.id}`);
        const cartItem: CartProps = response.data;
        cartItem.id = response.data.number;
        cartItem.checkIn = item.checkIn;
        cartItem.checkOut = item.checkOut;
        cartItem.guestCount = item.guestCount;
        cartItem.type = 'RESERVATION';
        if (item.specialRequests) cartItem.specialRequests = item.specialRequests;
        if (cartItem) reservationsList.push(cartItem);
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
  const allCartItems = useMemo(() => [...servicesCartData, ...reservationsCartData], [servicesCartData, reservationsCartData]);

  const initiateCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (totalCartItems === 0) {
        setError('Your cart is empty');
        setIsProcessing(false);
        return;
      }

      const cartItems = allCartItems.map((item) => ({
        id: item.id,
        type: item.type,
        ...(item.type === 'RESERVATION' && {
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          guestCount: item.guestCount,
        }),
      }));

      const response = await axiosAuthApi.post(
        '/payment/create-checkout-session',
        {
          cartItems,
          currency: 'eur',
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
      for (const item of servicesCartData) {
        await axiosAuthApi.post(`/guest/order/services`, {
          id: item.id,
          username: user?.username,
        });
      }

      for (const item of reservationsCartData) {
        const normalizeDate = (d?: string) => {
          if (!d) return d;
          const dt = new Date(d);
          return dt.toISOString().slice(0, 10);
        };

        const payload = {
          roomNumber: String(item.roomNumber ?? item.id),
          checkIn: normalizeDate(item.checkIn),
          checkOut: normalizeDate(item.checkOut),
          guestsCount: item.guestCount ?? 1,
          specialRequests: item.name ?? '',
          guestUsername: user?.username,
        };

        await axiosAuthApi.post(`/guest/reservation/add-to-tab`, payload);
      }

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
    () =>
      allCartItems.reduce((acc, curr) => {
        if (curr.type === 'SERVICE') {
          return acc + (curr.price ?? 0);
        }
        if (curr.type === 'RESERVATION') {
          return (
            acc +
            calculateReservationPrice(
              curr.checkIn,
              curr.checkOut,
              curr.pricePerNight
            )
          );
        }
        return acc;
      }, 0),
    [allCartItems]
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
                  index={index}
                  item={item}
                  cart={servicesCartData}
                  setCart={setServicesCartData}
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
                  index={index}
                  item={item}
                  cart={reservationsCartData}
                  setCart={setReservationsCartData}
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
