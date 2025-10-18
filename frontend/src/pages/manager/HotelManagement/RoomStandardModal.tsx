import { useState, useEffect, useCallback } from 'react';
import { RoomStandard } from '../../../types/room.ts';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RoomStandardModalProps {
  open: boolean;
  standard: RoomStandard | null;
  onClose: () => void;
  onSave: (room: RoomStandard) => void;
}

function RoomStandardModal({
  open,
  standard,
  onClose,
  onSave,
}: RoomStandardModalProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);
  const [formData, setFormData] = useState<RoomStandard>({
    name: '',
    capacity: 1,
    basePrice: 0,
    description: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RoomStandard, string>>
  >({});

  useEffect(() => {
    if (standard) {
      setFormData(standard);
    } else {
      setFormData({
        name: '',
        capacity: 1,
        basePrice: 0,
        description: '',
      });
    }
  }, [standard, open]);

  const handleChangeField = useCallback(
    (field: keyof RoomStandard, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handleCapacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        handleChangeField('capacity', '');
        return;
      }
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        handleChangeField('capacity', parsed);
      }
    },
    [handleChangeField]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        handleChangeField('basePrice', '');
        return;
      }
      const normalized = value.replace(',', '.');
      const parsed = parseFloat(normalized);
      if (!isNaN(parsed) && parsed >= 0) {
        handleChangeField('basePrice', parsed);
      }
    },
    [handleChangeField]
  );

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = 'Capacity must be at least 1';
    if (isNaN(formData.basePrice) || formData.basePrice < 0)
      newErrors.basePrice = 'Price must be 0 or greater';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      capacity: Number(formData.capacity),
      basePrice: Number(formData.basePrice),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          p: 2,
          maxHeight: '90vh',
          position: 'relative',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {standard ? tc('edit_standard') : tc('add_new_standard')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={tc('name')}
            value={formData.name}
            onChange={(e) => handleChangeField('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
          />
          <TextField
            label={tc('capacity')}
            type="number"
            value={isNaN(formData.capacity) ? '' : formData.capacity}
            onChange={handleCapacityChange}
            error={!!errors.capacity}
            helperText={errors.capacity}
            required
            fullWidth
            inputProps={{ min: 1, step: 1 }}
          />
          <TextField
            label={tc('base_price') + ' ($)'} 
            type="number"
            value={isNaN(formData.basePrice) ? '' : formData.basePrice}
            onChange={handlePriceChange}
            error={!!errors.basePrice}
            helperText={errors.basePrice}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
          />
          <TextField
            label={t('common.description')}
            value={formData.description || ''}
            onChange={(e) => handleChangeField('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('buttons.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {standard ? t('buttons.update') : t('buttons.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomStandardModal;
