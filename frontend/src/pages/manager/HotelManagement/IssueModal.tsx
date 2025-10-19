import { useState, useEffect } from 'react';
import { Issue } from '../../../types/maintenance.ts';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import {} from '@mui/icons-material';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';

interface IssueModalProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
  onSave: () => void;
}

function IssueModal({ open, issue, onClose, onSave }: IssueModalProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.maintenance.${key}`);
  const user = useSelector(selectUser);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description || '');
      setRoomNumber(issue.roomNumber || '');
    } else {
      setTitle('');
      setDescription('');
      setRoomNumber('');
    }
  }, [issue, open]);

  const handleSave = async () => {
    if (!title.trim() || !roomNumber.trim()) {
      setError('Title required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        roomNumber: roomNumber.trim(),
        reportedBy: user?.username,
      };

      if (issue) {
        await axiosAuthApi.put(`/maintenance/${issue.id}`, payload);
      } else {
        await axiosAuthApi.post('/maintenance', payload);
      }

      onSave();
    } catch (err: any) {
      setError(err.response?.data);
    } finally {
      setSaving(false);
    }
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
            {issue ? tc('editIssue') : tc('createIssue')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label={tc('title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={!title.trim() && error !== ''}
            helperText={
              !title.trim() && error !== '' ? 'Title is required' : ''
            }
          />

          <TextField
            label={tc('description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />

          <TextField
            label={tc('roomNumber')}
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            fullWidth
          />

          {error && (
            <Box color="error.main" fontSize="0.875rem">
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {issue ? t('buttons.update') : t('buttons.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default IssueModal;
