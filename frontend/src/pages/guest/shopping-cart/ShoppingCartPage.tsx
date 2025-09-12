import AuthenticatedHeader from "../../../components/ui/AuthenticatedHeader.tsx";
import {Button, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import ShoppingCartItem from "./ShoppingCartItem.tsx";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";
import {useTranslation} from "react-i18next";
import {clearCart, removeItem, selectShoppingCart} from "../../../redux/slices/shoppingCartSlice.ts";

export type CartProps = {
  id: string;
  name: string;
  employeeId: string;
  employeeFullName: string;
  imageUrl: string;
  price: number;
  datetime: string;
};

function ShoppingCartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartProps[]>([]);
  const [bill, setBill] = useState<number>(0);
  const user = useSelector(selectUser);
  const shoppingCart = useSelector(selectShoppingCart);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  useEffect(() => {
    fetchCartData();
    fetchCurrentBill();

  },[])

  const fetchCartData = async () => {
    const cartList : CartProps[] = [];
    if (shoppingCart) {
      for (const id of shoppingCart) {
        try {
          const response = await axiosAuthApi.get(`/schedule/get/cart/id/${id}`)
          const cartItem: CartProps = response.data;
          if (cartItem) cartList.push(cartItem);
        } catch (e) {
          dispatch(removeItem(id));
          console.error(e);
        }
      }
    }
    setCart(cartList);
  }

  const fetchCurrentBill = async () => {
    try {
      const response = await axiosAuthApi.get(`/guest/bill/get/${user?.username}`)
      setBill(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  const clearShoppingCart = () => {
    setCart([]);
    dispatch(clearCart());
  }

  const orderServices = async () => {
    clearShoppingCart();
    fetchCartData();
    try {
      for (const item of cart) {
        console.log(item, user)
        const response = await axiosAuthApi.post(`/guest/order/services`,{
          id: item.id,
          username: user?.username,
        });
        console.log(response.data);
      }
    } catch(e) {
      console.error(e);
    } finally {
      fetchCurrentBill();
    }
  }

  const removeShoppingCartItem = (itemId: string) => {
    dispatch(removeItem(itemId));
    setCart(cart.filter(item => item.id !== itemId));
  }

  return (
    <div style={{width: '100%'}}>
      <AuthenticatedHeader title={"Koszyk"}/>
      <main style={{
        width: '100%',
        borderRadius: '10px',
      }}>
        <Grid sx={{gap: 2,}} container spacing={{xs: 2, md: 3}} columns={{xs: 1, md: 2}}>
          <Grid sx={{backgroundColor: 'white', padding: {xs: '15px', sm: '30px 25px'}}} size={1}>
            <Button variant="contained" sx={{mb: '5px'}} onClick={clearShoppingCart}>{t('buttons.deleteAll')}</Button>
            {cart.length > 0 ? cart.map((item, index) => (
              <ShoppingCartItem key={index} index={index} item={item} removeItself={() => removeShoppingCartItem(item.id)}/>
            )) : <p>{t('pages.shopping_cart.noItems')}</p>}
          </Grid>
          <Grid sx={{display: 'flex', flexDirection: 'column', gap: '15px', }} size={1}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              padding: '25px',
              gap: '10px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='body1'>{t('pages.shopping_cart.cartValue')}:</Typography>
                <div style={{fontWeight: '700'}}>{cart.length > 0 ? (
                  cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)
                ) : (0)} $
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='body1'>{t('pages.shopping_cart.currentBill')}:</Typography>
                <div style={{fontWeight: '700'}}>{bill.toFixed(2)} $</div>
              </div>
              <Button onClick={orderServices} variant="contained">{t('pages.shopping_cart.pay')}</Button>
              <Button onClick={orderServices} variant="contained">{t('pages.shopping_cart.addToBill')}</Button>
            </div>
            <Button onClick={() => navigate("/services/available")} sx={{backgroundColor: 'white'}}>{t('pages.shopping_cart.continueShopping')}</Button>
          </Grid>
        </Grid>

      </main>

    </div>
  )
}

export default ShoppingCartPage;