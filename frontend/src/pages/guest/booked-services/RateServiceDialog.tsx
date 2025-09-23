import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useTranslation } from 'react-i18next';
import Rating from '@mui/material/Rating';

interface RateServiceDialogProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  scheduleId: string;
  fetchData: () => void;
}

const RateServiceDialog = ({
  open,
  setOpen,
  scheduleId,
  fetchData,
}: RateServiceDialogProps) => {
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const user = useSelector(selectUser);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      await axiosAuthApi.post('/services/rate', {
        scheduleId: scheduleId,
        comment: comment,
        username: user?.username,
        rating: rating,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
      setRating(0);
      setComment('');
      setCommentOpen(false);
      fetchData();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setRating(0);
    setComment('');
    setCommentOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('pages.past_services.rateServiceDialog')}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Rating
            size="large"
            value={rating}
            onChange={(_event, newValue) => {
              if (newValue) setRating(newValue);
            }}
          />

          {!commentOpen && (
            <Button
              onClick={() => setCommentOpen(true)}
              variant="outlined"
              fullWidth
            >
              {t('pages.past_services.addComment')}
            </Button>
          )}

          {commentOpen && (
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField
                placeholder={t('pages.past_services.commentInputPlaceholder')}
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
              />
              <Button
                onClick={() => setCommentOpen(false)}
                variant="outlined"
                color="secondary"
              >
                {t('pages.past_services.cancelComment')}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ gap: 2, pb: 2, px: 3 }}>
        <Button onClick={handleCancel} color="primary" fullWidth>
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={rating === 0}
          fullWidth
        >
          {t('buttons.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateServiceDialog;
