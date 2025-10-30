import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { Issue } from '../../../types/maintenance.ts';
import { Employee } from '../../../types/employee.ts';

interface AssignIssueModalProps {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
  onAssign: () => void;
}

function AssignIssueModal({
  open,
  issue,
  onClose,
  onAssign,
}: AssignIssueModalProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.maintenance.${key}`);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeUsername, setSelectedEmployeeUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchEmployees();
      setSelectedEmployeeUsername('');
      setError('');
    }
  }, [open]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosAuthApi.get<Employee[]>('/management/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployeeUsername) {
      setError('Please select an employee');
      return;
    }

    if (!issue) return;

    setSaving(true);
    setError('');

    try {
      await axiosAuthApi.put(
        `/maintenance/${issue.id}/assign/${selectedEmployeeUsername}`
      );
      onAssign();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to assign issue');
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
      <DialogTitle>{tc('assignIssue')}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {issue && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {tc('issue')}:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {issue.title}
              </Typography>
              {issue.roomNumber && (
                <Typography variant="body2" color="text.secondary">
                  {tc('room')}: {issue.roomNumber}
                </Typography>
              )}
            </Box>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <FormControl fullWidth>
              <InputLabel>{tc('assignTo')}</InputLabel>
              <Select
                value={selectedEmployeeUsername}
                label={tc('assignTo')}
                onChange={(e) => setSelectedEmployeeUsername(e.target.value)}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.username}>
                    {emp.name} {emp.surname} ({emp.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {error && (
            <Box color="error.main" fontSize="0.875rem">
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          {tc('cancel')}
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={saving || loading}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {tc('assign')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignIssueModal;
