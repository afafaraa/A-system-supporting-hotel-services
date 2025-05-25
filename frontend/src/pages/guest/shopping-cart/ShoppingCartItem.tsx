import {Button, Typography} from "@mui/material";
import {CartProps} from "./ShoppingCartPage.tsx";
import {useTheme} from "@mui/material";

function ShoppingCartItem ({item, index, fetchCartData}: {item: CartProps, index: number, fetchCartData: () => void}) {
  const theme = useTheme();

  const deleteItem = (itemId: string) => {
    const itemsString: string | null = localStorage.getItem("CART");

    if (itemsString) {
      let items: string[] = JSON.parse(itemsString);
      items = items.filter((e: string) => {
        return e !== itemId
      });
      localStorage.setItem("CART", JSON.stringify(items));
    }
    fetchCartData();
  }

  return (
    <div key={index} style={{display: 'flex', marginTop: '10px'}}>
      <img style={{height: '100px', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block'}} src={item.imageUrl} alt="img"/>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '5px 20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <Typography variant="h5">{item.name}</Typography>
            <Typography sx={{lineHeight: '14px'}} variant="body2">{item.employeeFullName}</Typography>
          </div>
          <div style={{fontWeight: '700'}}>{item.price}$</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>{(new Date(item.datetime)).toLocaleDateString()} : {(new Date(item.datetime)).toLocaleTimeString().slice(0,5)}</div>
          <Button sx={{background: theme.palette.secondary.main}} onClick={() => deleteItem(item.id)}>Usun</Button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCartItem;