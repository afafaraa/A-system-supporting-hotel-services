import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  FormControl,
  Chip,
  OutlinedInput,
  FilledInputProps,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Employee, Department, Sector } from '../../../types';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { EditOutlined, Save, AddCircleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const defaultEmployeeState: Partial<Employee> = {
  role: 'EMPLOYEE',
  username: '',
  email: '',
  name: '',
  surname: '',
  status: 'ACTIVE',
  employeeData: {
    department: 'FOOD_AND_BEVERAGE',
    sectors: ['BREAKFAST', 'LUNCH'],
  },
};

interface Props {
  open: boolean;
  initial?: Employee;
  onClose: () => void;
  onSaved: (employee: Employee) => void;
}

const departments: Department[] = [
  'FOOD_AND_BEVERAGE',
  'HOUSEKEEPING',
  'RECEPTION',
  'MAINTENANCE',
];

const sectors: Sector[] = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'ROOM_SERVICE',
  'SECURITY',
  'SPA_AND_WELLNESS',
];

function EditEmployeeModal({ open, initial, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.personnel.${key}`);

  const [form, setForm] = useState<Partial<Employee>>(defaultEmployeeState);
  const isEditMode = !!initial;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(isEditMode ? initial : defaultEmployeeState);
      setError(null);
    }
  }, [open, initial, isEditMode]);

  const handleChange = (
    k: keyof Employee | 'department' | 'sectors',
    v: string | Department | Sector | string[] | Department[] | Sector[]
  ) => {
    if (k === 'department' || k === 'sectors') {
      setForm((prev) => ({
        ...prev,
        employeeData: { ...prev.employeeData, [k]: v },
      }));
    } else {
      setForm((prev) => ({ ...prev, [k]: v }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.email || !form.role) {
      setError(t('error.emptyFields'));
      return;
    }
    try {
      let res;
      if (isEditMode) {
        res = await axiosAuthApi.put(`/management/employees/${form.id}`, form);
      } else {
        res = await axiosAuthApi.post('/management/employees', {
          ...form,
          password: 'password',
          username: `${form.name?.toLowerCase()}${form.surname?.toLowerCase()}`,
        });
      }
      console.log(res.data);
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        isEditMode
          ? t('error.edit_employee_failure')
          : t('error.add_employee_failure')
      );
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
          px: 2,
          py: 0,
          maxHeight: '85vh',
          position: 'relative',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          {isEditMode ? (
            <EditOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
          ) : (
            <AddCircleOutline sx={{ mr: 1, verticalAlign: 'middle' }} />
          )}
          <Typography variant="h5" fontWeight="bold">
            {isEditMode ? tc('edit') : tc('add')}
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" component="p">
          {isEditMode ? tc('edit_subtitle') : tc('add_subtitle')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {tc('name')}
            </Typography>
            <TextField
              variant="filled"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 1,
                '& .MuiInputBase-input': {
                  p: 1,
                  color: 'text.secondary',
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as FilledInputProps,
              }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {tc('surname')}
            </Typography>
            <TextField
              variant="filled"
              value={form.surname}
              onChange={(e) => handleChange('surname', e.target.value)}
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 1,
                '& .MuiInputBase-input': {
                  p: 1,
                  color: 'text.secondary',
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as FilledInputProps,
              }}
            />
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {tc('email')}
            </Typography>
            <TextField
              variant="filled"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 1,
                '& .MuiInputBase-input': {
                  p: 1,
                  color: 'text.secondary',
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as FilledInputProps,
              }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {tc('department')}
            </Typography>
            <Select
              value={form.employeeData?.department || departments[0]}
              onChange={(e) =>
                handleChange('department', e.target.value as Department)
              }
              variant="filled"
              fullWidth
              disableUnderline
              sx={{
                fontSize: '1.1rem',
                p: 0,
                mt: 1,
                '& .MuiSelect-select': {
                  p: 1,
                  color: 'text.secondary',
                },
              }}
            >
              {departments.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {t(`common.department.${dep.toLowerCase()}`)}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold" mb={1}>
            {tc('sectors')}
          </Typography>
          <FormControl variant="filled" fullWidth>
            <Select
              multiple
              value={form.employeeData?.sectors || []}
              onChange={(e) => {
                const value = e.target.value;
                handleChange('sectors', Array.isArray(value) ? value : [value]);
              }}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0.5 }}
                >
                  {Array.isArray(selected)
                    ? selected.map((value) => (
                        <Chip
                          key={value}
                          label={t(`common.sectors.${value.toLowerCase()}`)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    : null}
                </Box>
              )}
              disableUnderline
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 230,
                    mt: 2,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiList-root': {
                      py: 1,
                    },
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                '& .MuiSelect-select': {
                  minHeight: '56px',
                  p: 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingTop: '12px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            >
              {sectors.map((sector) => (
                <MenuItem
                  key={sector}
                  value={sector}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <Checkbox
                    checked={
                      form.employeeData?.sectors?.includes(sector) || false
                    }
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <ListItemText
                    primary={t(`common.sectors.${sector.toLowerCase()}`)}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: form.employeeData?.sectors?.includes(sector)
                          ? 600
                          : 400,
                      },
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {form.employeeData?.sectors &&
            form.employeeData.sectors.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: 'block' }}
              >
                {form.employeeData.sectors.length}{' '}
                {form.employeeData.sectors.length === 1 ? 'sector' : 'sectors'}{' '}
                selected
              </Typography>
            )}
        </Box>
        {error && (
          <Typography
            color="error"
            variant="body2"
            textAlign="center"
            sx={{ mt: 1 }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          <Save sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEditMode ? t('buttons.update') : t('buttons.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditEmployeeModal;
