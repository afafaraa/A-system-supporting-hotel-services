import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography, Box, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartItem from "./ShoppingCartItem.tsx";
import { selectUser } from "../../../redux/slices/userSlice.ts";
import { selectShoppingCart, removeItem, clearCart } from "../../../redux/slices/shoppingCartSlice.ts";
import { axiosAuthApi } from "../../../middleware/axiosApi.ts";

export type CartProps = {
  id: string;
  name: string;
  employeeId: string;
  employeeFullName: string;
  imageUrl: string;
  price: number;
  datetime: string;
};

type ShoppingCartPopupProps = {
  open: boolean;
  setOpen: () => void;
};

const ShoppingCartPopup = ({ open, setOpen }: ShoppingCartPopupProps) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const shoppingCart = useSelector(selectShoppingCart);

  const [cart, setCart] = useState<CartProps[]>([]);
  const [bill, setBill] = useState<number>(0);

  useEffect(() => {
    if (open) {
      fetchCartData();
      fetchCurrentBill();
    }
  }, [open, shoppingCart]);

  const fetchCartData = async () => {
    const cartList: CartProps[] = [];
    if (shoppingCart.length > 0) {
      for (const id of shoppingCart) {
        try {
          const response = await axiosAuthApi.get(`/schedule/get/cart/id/${id}`);
          const cartItem: CartProps = response.data;
          if (cartItem) cartList.push(cartItem);
        } catch (e) {
          dispatch(removeItem(id));
          console.error(e);
        }
      }
    }
    setCart(cartList);
  };

  const fetchCurrentBill = async () => {
    try {
      const response = await axiosAuthApi.get(`/guest/bill/get/${user?.username}`);
      setBill(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const clearShoppingCart = () => {
    setCart([]);
    dispatch(clearCart());
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
      fetchCartData();
    } catch (e) {
      console.error(e);
    } finally {
      fetchCurrentBill();
    }
  };

  const removeShoppingCartItem = (itemId: string) => {
    dispatch(removeItem(itemId));
    setCart(cart.filter((item) => item.id !== itemId));
  };

  if (!open) return null;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1200,
        }}
        onClick={setOpen}
      />

      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "400px" },
          maxHeight: "90vh",
          backgroundColor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Shopping Cart ({cart.length})</Typography>
          <IconButton onClick={setOpen}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <ShoppingCartItem key={index} index={index} item={item} removeItself={() => removeShoppingCartItem(item.id)} />
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Your cart is empty
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Total price:</Typography>
            <Typography variant="body1" fontWeight="700">
              {cart.length > 0 ? cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2) : 0} $
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Current bill:</Typography>
            <Typography variant="body1" fontWeight="700">
              {bill.toFixed(2)} $
            </Typography>
          </Box>
          <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={orderServices}>
            Pay
          </Button>
          <Button fullWidth variant="outlined" onClick={clearShoppingCart}>
            Clear Cart
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ShoppingCartPopup;
