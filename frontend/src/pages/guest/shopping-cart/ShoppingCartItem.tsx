import { Button, Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { CartProps } from './ShoppingCartPopup.tsx';
import { useTranslation } from 'react-i18next';

function ShoppingCartItem({
                            item,
                            index,
                            removeItself,
                          }: {
  item: CartProps;
  index: number;
  removeItself: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

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
          {item.name}
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
          <div>{new Date(item.datetime).toLocaleDateString()}</div>
          <div>{new Date(item.datetime).toLocaleTimeString().slice(0, 5)}</div>
        </div>
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
