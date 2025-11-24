import { Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ServiceCartProps, ReservationCartProps } from './ShoppingCartPopup.tsx';
import { useTranslation } from 'react-i18next';

function ShoppingCartItem({
  item,
  removeItself,
}: {
  item: ServiceCartProps | ReservationCartProps;
  removeItself: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <div
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
            : ((item.roomStandardName + ' Room')
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
            {(item.type === 'SERVICE' ? item.price : item.reservationPrice).toFixed(2)}$
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
        <IconButton onClick={removeItself}>
          <Delete />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default ShoppingCartItem;
