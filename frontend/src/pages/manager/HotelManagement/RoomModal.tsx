import { useState, useEffect } from 'react';
import { Room, RoomStandard, RoomStatus } from '../../../types/room.ts';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RoomModalProps {
  open: boolean;
  room: Room | null;
  standards: RoomStandard[];
  onClose: () => void;
  onSave: (room: Room) => void;
}

function RoomModal({ open, room, standards, onClose, onSave }: RoomModalProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);
  const [formData, setFormData] = useState<Room>({
    number: '',
    standard: { id: '', name: '', capacity: 1, basePrice: 0 },
    roomStatus: RoomStatus.OPEN,
    floor: undefined,
    description: '',
    capacity: 1,
    pricePerNight: 0,
    amenities: [],
  });

  useEffect(() => {
    if (room) {
      setFormData(room);
    } else {
      setFormData({
        number: '',
        standard: { id: '', name: '', capacity: 1, basePrice: 0 },
        roomStatus: RoomStatus.OPEN,
        floor: undefined,
        description: '',
        capacity: 1,
        pricePerNight: 0,
        amenities: [],
      });
    }
  }, [room, open]);

  const handleSubmit = () => {
    if (!formData.number || !formData.standard.id) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
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
            {room ? tc('edit') : tc('add_new')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label={tc('room_no')}
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            disabled={!!room}
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>{tc('room_standard')}</InputLabel>
            <Select
              value={formData.standard.id}
              label={tc('room_standard')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  standard:
                    standards.find((s) => s.id === e.target.value) ||
                    formData.standard,
                })
              }
            >
              {standards.map((standard) => (
                <MenuItem key={standard.id} value={standard.id}>
                  {standard.name} - ${standard.basePrice} ({standard.capacity}{' '}
                  {tc('guests')})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>{t('common.status')}</InputLabel>
            <Select
              value={formData.roomStatus}
              label={t('common.status')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomStatus: e.target.value as RoomStatus,
                })
              }
            >
              {Object.values(RoomStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`common.room_status.${status.toLowerCase()}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={tc('floor')}
            type="number"
            value={formData.floor || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                floor: Number(e.target.value) || undefined,
              })
            }
            fullWidth
          />
          <TextField
            label={t('common.description')}
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('buttons.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {room ? t('buttons.update') : t('buttons.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomModal;
