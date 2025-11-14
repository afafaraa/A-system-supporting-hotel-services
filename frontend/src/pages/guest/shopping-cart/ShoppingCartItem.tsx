import { Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { CartProps } from './ShoppingCartPopup.tsx';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { removeService } from '../../../redux/slices/servicesCartSlice.ts';
import { removeReservation } from '../../../redux/slices/reservationsCartSlice.ts';
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

  const removeShoppingCartItem = () => {
    if (item.type === 'SERVICE') {
      dispatch(removeService({ id: item.id }));
    } else {
      dispatch(
        removeReservation({
          id: item.id,
          checkIn: item.checkIn!,
          checkOut: item.checkOut!,
          guestCount: item.guestCount!,
        })
      );
    }
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
            : ((item.standard?.name + ' Room')
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
            {item.type === 'SERVICE' ? item.price?.toFixed(2) : calculateTotalPrice}$
          </div>
          <div>
            {item.type === 'SERVICE'
              ? new Date(item.datetime ?? '').toLocaleDateString(t('date.locale'))
              : new Date(item.checkIn ?? '').toLocaleDateString(t('date.locale'))}
          </div>
            -
          <div>
            {item.type === 'SERVICE'
              ? item.employeeFullName
              : new Date(item.checkOut ?? '').toLocaleDateString(t('date.locale'))}
          </div>
        </div>
        {item.specialRequests && (<>
          <Typography sx={{ fontSize: '15px', fontWeight: '600', mt: 1, mb: 0.2 }}>
            {t('common.special_requests')}:
          </Typography>
          <Typography style={{fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.2}} color="text.secondary">
            {item.specialRequests}
          </Typography>
        </>)}
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
