import AuthenticatedHeader from "../../../components/layout/AuthenticatedHeader.tsx";
import {Button, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import ShoppingCartItem from "./ShoppingCartItem.tsx";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";

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
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchCartData();
  },[])

  const fetchCartData = async () => {
    try {
      const cartList : CartProps[] = [];
      const items = localStorage.getItem("CART");
      if (items) {
        const parsedItems = JSON.parse(items);
        for (const id of parsedItems) {
          const response = await axiosAuthApi.get(`/schedule/get/cart/id/${id}`)
          const cartItem: CartProps = response.data;
          cartList.push(cartItem);
        }
      }
      setCart(cartList);
    } catch (e) {
      console.error(e);
    }
  }

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("CART", JSON.stringify([]));
  }

  const orderServices = async () => {
    clearCart();
    fetchCartData();
    try {
      for (const item of cart) {
        const response = await axiosAuthApi.post(`/guest/order/add/${item.id}/${user?.username}`);
        console.log(response);
      }

    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div style={{width: '100%'}}>
      <AuthenticatedHeader title={"Koszyk"}/>
      <main style={{
        width: '100%',
        borderRadius: '10px',
        marginTop: '20px',
      }}>
        <Grid sx={{gap: 2,}} container spacing={{xs: 2, md: 3}} columns={{sm: 1, md: 2}}>
          <Grid sx={{backgroundColor: 'white', padding: '30px 25px'}} size={1}>
            <Button variant="contained" sx={{mb: '5px'}} onClick={clearCart}>Usuń wszystko</Button>
            {cart.length > 0 ? cart.map((item, index) => (
              <ShoppingCartItem index={index} item={item} fetchCartData={fetchCartData}/>
            )) : <p>No items in cart</p>}
          </Grid>
          <Grid sx={{display: 'flex', flexDirection: 'column', gap: '15px', }} size={1}>
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', padding: '25px', gap: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='body1'>Wartość koszyka:</Typography>
                <div style={{fontWeight: '700'}}>{cart.length > 0 ? (
                  cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)
                ) : (0)} $</div>
              </div>
              <Button onClick={orderServices} variant="contained">Zaplać</Button>
              <Button onClick={orderServices} variant="contained">Dodaj do rachunku</Button>
            </div>
            <Button onClick={() => navigate("/services/available")} sx={{backgroundColor: 'white'}}>Kontynuuj zakupy</Button>
          </Grid>
        </Grid>

      </main>

    </div>
  )
}

export default ShoppingCartPage;