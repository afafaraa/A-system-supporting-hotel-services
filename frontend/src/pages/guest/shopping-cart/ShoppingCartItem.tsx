import { Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { CartProps } from './ShoppingCartPopup.tsx';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../../redux/slices/shoppingCartSlice.ts';
import { useMemo } from 'react';

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

  const calculateTotalPrice = useMemo(() => {
    if (!item.checkIn || !item.checkOut || !item.pricePerNight) return 0;
    const checkInDate = new Date(item.checkIn);
    const checkOutDate = new Date(item.checkOut);

    const numberOfNights =
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

    const nights = Math.max(1, Math.floor(numberOfNights));

    return nights * item.pricePerNight;
  }, [item.checkIn, item.checkOut, item.pricePerNight]);

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
          {item.type === 'SERVICE'
            ? item.name
            : ((item.standard + ' Room')
                .toLowerCase()
                .split(' ')
                .filter((word) => word.trim().length > 0)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '))}
        </Typography>
        <div
          style={{
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
          }}
        >
          <div>
            {item.type === 'SERVICE' ? item.price : calculateTotalPrice}$
          </div>
          <div>
            {item.type === 'SERVICE'
              ? new Date(item.datetime ?? '').toLocaleDateString()
              : new Date(item.checkIn ?? '').toLocaleDateString()}
          </div>
            -
          <div>
            {item.type === 'SERVICE'
              ? item.employeeFullName
              : new Date(item.checkOut ?? '').toLocaleDateString()}
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
