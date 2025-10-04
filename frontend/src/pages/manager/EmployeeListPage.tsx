import { useEffect, useState, useMemo, useCallback } from 'react';
import { axiosAuthApi } from '../../middleware/axiosApi.ts';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  ClickAwayListener,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search, PersonOutline, Add } from '@mui/icons-material';
import { Employee, Role } from '../../types';
import { useTranslation } from 'react-i18next';
import EmployeeCard from './EmployeeCard.tsx';
import EditEmployeeModal from './modals/EditEmployeeModal.tsx';
import { SectionCard } from '../../theme/styled-components/SectionCard.ts';

function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(0);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.personnel.${key}`);
  const [searchOpen, setSearchOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [filterPosition, setFilterPosition] = useState<'ALL' | Role>('ALL');

  const pageSize = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosAuthApi.get<Employee[]>('/management/employees', {
        params: { page: page, size: pageSize },
      });
      console.log(res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((person) => {
      const nameMatch =
        filterName.trim() === '' ||
        person.name.toLowerCase().includes(filterName.toLowerCase()) ||
        person.surname.toLowerCase().includes(filterName.toLowerCase());
      const positionMatch =
        filterPosition === 'ALL' || person.role === filterPosition;
      return nameMatch && positionMatch;
    });
  }, [employees, filterName, filterPosition]);

  const handleEmployeeUpdated = (updated: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updated.id ? updated : emp))
    );
  };

  const handleEmployeeRemoved = (employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <SectionCard>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isMobile ? 'center' : 'space-between'}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Box display="flex" alignItems="flex-start" flexDirection="row">
            <PersonOutline fontSize="large" />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {tc('title')}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            gutterBottom
          >
            {tc('subtitle')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box display="flex" alignItems="center" position="relative">
              <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                <Search />
              </IconButton>
              {searchOpen && (
                <TextField
                  placeholder={tc('searchPlaceholder')}
                  variant="outlined"
                  size="small"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  sx={{
                    ml: 1,
                    width: '12rem',
                    transition: 'width 0.3s ease',
                  }}
                  autoFocus
                />
              )}
            </Box>
          </ClickAwayListener>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="position-label">{tc('position')}</InputLabel>
            <Select
              labelId="position-label"
              label={tc('type')}
              value={filterPosition}
              onChange={(e) =>
                setFilterPosition(e.target.value as 'ALL' | Role)
              }
            >
              <MenuItem value="ALL">{tc('all')}</MenuItem>
              <MenuItem value="RECEPTIONIST">{tc('receptionist')}</MenuItem>
              <MenuItem value="MANAGER">{tc('manager')}</MenuItem>
              <MenuItem value="EMPLOYEE">{tc('employee')}</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            {tc('addEmployee')}
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          {filteredEmployees.map((emp) => (
            <Grid
              key={emp.id}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ display: 'flex' }}
            >
              <EmployeeCard
                employee={emp}
                onUpdated={handleEmployeeUpdated}
                onRemoved={handleEmployeeRemoved}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <EditEmployeeModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={(savedEmployee) => {
          setEmployees((prev) => {
            const exists = prev.some((emp) => emp.id === savedEmployee.id);
            return exists
              ? prev.map((emp) =>
                  emp.id === savedEmployee.id ? savedEmployee : emp
                )
              : [savedEmployee, ...prev];
          });
          setOpen(false);
        }}
      />
    </SectionCard>
  );
}

export default EmployeeListPage;
