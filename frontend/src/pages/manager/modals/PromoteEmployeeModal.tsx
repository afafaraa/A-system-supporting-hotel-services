import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Employee, Role } from '../../../types';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { TrendingUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  employee: Employee;
  onClose: () => void;
  onPromoted: (employee: Employee) => void;
}

const roles: Role[] = ['EMPLOYEE', 'RECEPTIONIST', 'MANAGER'];

function PromoteEmployeeModal({ open, employee, onClose, onPromoted }: Props) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.personnel.${key}`);

  const [selectedRole, setSelectedRole] = useState<Role>(employee.role);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedRole(employee.role);
      setError(null);
    }
  }, [open, employee]);

  const getRoleLevel = (role: Role): number => {
    const levels = { EMPLOYEE: 1, RECEPTIONIST: 2, MANAGER: 3 };
    return levels[role] || 0;
  };

  const isPromotion = getRoleLevel(selectedRole) > getRoleLevel(employee.role);
  const isDemotion = getRoleLevel(selectedRole) < getRoleLevel(employee.role);

  const handleSubmit = async () => {
    if (selectedRole === employee.role) {
      setError(t('error.sameRoleError'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axiosAuthApi.patch('/management/employees/role', null, {
        params: {
          username: employee.username,
          role: selectedRole,
        },
      });
      const res = await axiosAuthApi.get<Employee>(
        `/management/employees/username/${employee.username}`
      );

      onPromoted(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to change role:', err);
      setError(tc('promoteError') || 'Failed to change employee role');
    } finally {
      setLoading(false);
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
          borderRadius: 3,
          transformOrigin: 'top center',
        },
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          paddingTop: '10vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h5" fontWeight="bold">
            {tc('changeRole') || 'Change Role'}
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" component="p">
          {tc('changeRoleSubtitle') ||
            `Change role for ${employee.name} ${employee.surname}`}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {tc('currentRole') || 'Current Role'}
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {tc(employee.role.toLowerCase())}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold" mb={1}>
            {tc('newRole') || 'New Role'}
          </Typography>
          <FormControl fullWidth>
            <RadioGroup
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
            >
              {roles.map((role) => (
                <FormControlLabel
                  key={role}
                  value={role}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight={selectedRole === role ? 'bold' : 'normal'}
                      >
                        {tc(role.toLowerCase())}
                      </Typography>
                      {role === employee.role && (
                        <Typography variant="caption" color="text.secondary">
                          ({tc('current') || 'Current'})
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: 1,
                    borderColor:
                      selectedRole === role ? 'primary.main' : 'divider',
                    bgcolor:
                      selectedRole === role ? 'primary.light' : 'transparent',
                    mb: 1,
                    '&:hover': {
                      bgcolor:
                        selectedRole === role
                          ? 'primary.light'
                          : 'action.hover',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {isPromotion && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'success.light',
              borderRadius: 2,
              border: 1,
              borderColor: 'success.main',
            }}
          >
            <Typography variant="body2" color="success.dark">
              <strong>{tc('promotion') || 'Promotion:'}</strong> {employee.name}{' '}
              {tc('willBePromoted') || 'will be promoted to'}{' '}
              {tc(selectedRole.toLowerCase())}
            </Typography>
          </Box>
        )}

        {isDemotion && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'warning.light',
              borderRadius: 2,
              border: 1,
              borderColor: 'warning.main',
            }}
          >
            <Typography variant="body2" color="warning.dark">
              <strong>{tc('demotion') || 'Demotion:'}</strong> {employee.name}{' '}
              {tc('willBeDemoted') || 'will be demoted to'}{' '}
              {tc(selectedRole.toLowerCase())}
            </Typography>
          </Box>
        )}

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
          onClick={handleSubmit}
          disabled={loading || selectedRole === employee.role}
          color={isPromotion ? 'success' : isDemotion ? 'warning' : 'primary'}
        >
          <TrendingUp sx={{ mr: 1 }} />
          {loading
            ? tc('changing') || 'Changing...'
            : tc('confirmChange') || 'Confirm Change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromoteEmployeeModal;
