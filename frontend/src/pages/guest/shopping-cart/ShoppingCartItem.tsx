import { Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { CartProps } from './ShoppingCartPopup.tsx';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../../redux/slices/shoppingCartSlice.ts';

function ShoppingCartItem({
  item,
  index,
  cart,
  setCart,
}: {
  item: CartProps;
  index: number;
  cart: CartProps[];
  setCart: (cart: CartProps[]) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  console.log(item);
  const removeShoppingCartItem = () => {
    dispatch(
      removeItem({
        id: item.id,
        type: 'RESERVATION',
        checkIn: item.checkIn,
        checkOut: item.checkOut,
      })
    );
    setCart(cart.filter((c) => !(c.id === item.id)));
  };

  return (
    <div
      key={index}
      style={{
        display: 'flex',
        marginTop: '10px',
        backgroundColor: theme.palette.background.default,
        borderRadius: '10px',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 20px',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
          {item.type === 'SERVICE' ? item.name : item.standard + ' room'}
        </Typography>
        <div
          style={{
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
          }}
        >
          <div>{item.price}$</div>
          <div>{new Date(item.datetime ?? '').toLocaleDateString()}</div>
          <div>
            {new Date(item.datetime ?? '').toLocaleTimeString().slice(0, 5)}
          </div>
        </div>
      </div>

      <Tooltip title={t('buttons.delete')}>
        <IconButton onClick={removeShoppingCartItem}>
          <Delete />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default ShoppingCartItem;
