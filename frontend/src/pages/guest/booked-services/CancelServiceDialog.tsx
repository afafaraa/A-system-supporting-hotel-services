import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useTranslation } from 'react-i18next';

interface CancelServiceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  scheduleId: string;
  fetchData: () => void;
}

const CancelServiceDialog = ({
  open,
  setOpen,
  scheduleId,
  fetchData,
}: CancelServiceDialogProps) => {
  const user = useSelector(selectUser);
  const { t } = useTranslation();

  const cancel = async () => {
    try {
      await axiosAuthApi.post('/guest/order/cancel', {
        username: user?.username,
        orderId: scheduleId,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
      fetchData();
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {t('pages.booked_services.confirmationDialogTitle')}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t('pages.booked_services.confirmationDialog')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button onClick={cancel} color="error" variant="outlined">
          {t('pages.booked_services.yes')}
        </Button>
        <Button onClick={() => setOpen(false)} variant="contained">
          {t('pages.booked_services.no')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelServiceDialog;
