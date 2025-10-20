import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartItem from './ShoppingCartItem.tsx';
import { selectUserDetails } from '../../../redux/slices/userDetailsSlice.ts';
import {
  selectShoppingCart,
  clearCart,
} from '../../../redux/slices/shoppingCartSlice.ts';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { RoomStandard } from '../../../types/room.ts';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useTranslation } from 'react-i18next';

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
};

type ShoppingCartPopupProps = {
  open: boolean;
  setOpen: () => void;
};

const ShoppingCartPopup = ({ open, setOpen }: ShoppingCartPopupProps) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);
  const shoppingCart = useSelector(selectShoppingCart);
  const theme = useTheme();
  const { t } = useTranslation();

  const [cart, setCart] = useState<CartProps[]>([]);
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

  const fetchCartData = useCallback(async () => {
    const cartList: CartProps[] = [];
    if (shoppingCart.length > 0) {
      for (const item of shoppingCart) {
        let cartItem: CartProps;
        try {
          if (item.type === 'SERVICE') {
            const response = await axiosAuthApi.get(
              `/schedule/get/cart/id/${item.id}`
            );
            cartItem = response.data;
            cartItem.type = item.type;
            if (cartItem) cartList.push(cartItem);
          } else if (item.type === 'RESERVATION') {
            const response = await axiosAuthApi.get(
              `/rooms/by/number/${item.id}`
            );
            cartItem = response.data;
            cartItem.id = response.data.number;
            cartItem.checkIn = item.checkIn;
            cartItem.checkOut = item.checkOut;
            cartItem.guestCount = item.guestCount;
            cartItem.type = item.type;
            if (cartItem) cartList.push(cartItem);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setCart(cartList);
  }, [shoppingCart]);

  useEffect(() => {
    if (open) {
      fetchCartData();
    }
  }, [shoppingCart, open, fetchCartData]);

  const clearShoppingCart = () => {
    setCart([]);
    dispatch(clearCart());
  };

  const initiateCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (cart.length === 0) {
        setError('Your cart is empty');
        setIsProcessing(false);
        return;
      }

      const amountCents = Math.round(totalPrice * 100);

      if (amountCents <= 0) {
        setError('Invalid cart total');
        setIsProcessing(false);
        return;
      }

      // Prepare cart items metadata
      const cartItems = cart.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name || `Room ${item.roomNumber}`,
        price:
          item.type === 'SERVICE'
            ? item.price
            : calculateReservationPrice(
                item.checkIn,
                item.checkOut,
                item.pricePerNight
              ),
      }));

      const response = await axiosAuthApi.post(
        '/payment/create-checkout-session',
        {
          amountCents,
          currency: 'usd',
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          orderDescription: `Hotel Services Order (${cart.length} item${cart.length > 1 ? 's' : ''})`,
          customerEmail: userDetails?.email,
          cartItems: JSON.stringify(cartItems),
        }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (e) {
      console.error('Failed to create checkout session:', e);
      setError(t('error.failedToCreateSession'));
      setIsProcessing(false);
    }
  };
  const orderServices = async () => {
    try {
      for (const item of cart) {
        await axiosAuthApi.post(`/guest/order/services`, {
          id: item.id,
          username: user?.username,
        });
      }
      clearShoppingCart();
      await fetchCartData();
    } catch (e) {
      console.error(e);
    }
  };

  const totalPrice = useMemo(
    () =>
      cart.reduce((acc, curr) => {
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
    [cart]
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
          height: '100vh',
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
          width: { xs: '90%', sm: '35%' },
          maxHeight: '90vh',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          zIndex: 1300,
          p: 4,
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
            Shopping Cart ({cart.length})
          </Typography>
          <IconButton onClick={setOpen}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Typography component="p" variant="caption" color="error">
            {t(error)}
          </Typography>
        )}

        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <ShoppingCartItem
                key={index}
                index={index}
                item={item}
                cart={cart}
                setCart={setCart}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Your cart is empty
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: theme.palette.primary.light,
            padding: '20px',
            margin: '15px 0',
          }}
        >
          <Typography fontWeight="600">Total Summary:</Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">Total price:</Typography>
            <Typography variant="body1" fontWeight="700">
              {totalPrice.toFixed(2)} $
            </Typography>
          </div>
        </Box>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Button
            fullWidth
            sx={{ mb: 1 }}
            onClick={orderServices}
            disabled={cart.length === 0 || isProcessing}
          >
            Add to Tab
          </Button>
          <Button
            fullWidth
            sx={{ mb: 1 }}
            onClick={initiateCheckout}
            disabled={cart.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={clearShoppingCart}
          disabled={isProcessing}
        >
          Clear Cart
        </Button>
      </Box>
    </>
  );
};

export default ShoppingCartPopup;
