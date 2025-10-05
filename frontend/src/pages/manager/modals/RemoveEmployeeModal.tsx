import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Employee } from '../../../types';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { Delete, Warning } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  employee: Employee;
  onClose: () => void;
  onRemoved: () => void;
}

function RemoveEmployeeModal({ open, employee, onClose, onRemoved }: Props) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.personnel.${key}`);

  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmationPhrase = 'DELETE';

  useEffect(() => {
    if (open) {
      setConfirmText('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (confirmText !== confirmationPhrase) {
      setError(tc('confirmTextError') || 'Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axiosAuthApi.delete('/management/employees', {
        params: {
          username: employee.username,
        },
      });

      onRemoved();
      onClose();
    } catch (err) {
      console.error('Failed to remove employee:', err);
      setError(tc('removeError') || 'Failed to remove employee');
    } finally {
      setLoading(false);
    }
  };

  const isConfirmValid = confirmText === confirmationPhrase;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          px: 2,
          py: 0,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Delete sx={{ mr: 1, color: 'error.main' }} />
          <Typography variant="h5" fontWeight="bold" color="error">
            {tc('removeEmployee') || 'Remove Employee'}
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" component="p">
          {tc('removeSubtitle') || 'This action cannot be undone'}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
      >
        <Alert severity="error" icon={<Warning />}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>
            {tc('warningTitle') || 'Warning'}
          </AlertTitle>
          {tc('removeWarning') ||
            'You are about to permanently remove this employee from the system. This action cannot be undone.'}
        </Alert>

        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {tc('employeeDetails') || 'Employee Details'}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {employee.name} {employee.surname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tc('email')}: {employee.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tc('position')}: {tc(employee.role.toLowerCase())}
          </Typography>
          {employee.employeeData?.department && (
            <Typography variant="body2" color="text.secondary">
              {tc('department')}:{' '}
              {employee.employeeData.department.toLowerCase()}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            {tc('confirmRemoval') || 'Confirm Removal'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {tc('typeDelete') ||
              `Type "${confirmationPhrase}" to confirm deletion`}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={confirmationPhrase}
            error={confirmText.length > 0 && !isConfirmValid}
            helperText={
              confirmText.length > 0 && !isConfirmValid
                ? tc('confirmTextMismatch') || 'Text does not match'
                : ''
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: isConfirmValid ? 'error.main' : 'primary.main',
                },
              },
            }}
          />
        </Box>

        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          {t('buttons.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading || !isConfirmValid}
          startIcon={<Delete />}
        >
          {loading
            ? tc('removing') || 'Removing...'
            : tc('confirmRemove') || 'Remove Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveEmployeeModal;
