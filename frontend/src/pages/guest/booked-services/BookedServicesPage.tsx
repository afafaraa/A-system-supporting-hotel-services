import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceItem from './ServiceItem.tsx';
import {
  Box,
  InputAdornment,
  Chip,
  Typography,
  Stack,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import { SelectInput } from '../../../theme/styled-components/SelectInput.ts';
import { TextInput } from '../../../theme/styled-components/TextInput.ts';

export type RequestedServiceProps = {
  id: string;
  name: string;
  employeeId: string;
  employeeFullName: string;
  imageUrl?: string;
  price: number;
  datetime: string;
  status: string;
  specialRequests?: string;
};

const STATUS_OPTIONS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'REQUESTED', label: 'Pending' },
  { key: 'ACTIVE', label: 'Confirmed' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'CANCELED', label: 'Canceled' },
  { key: 'COMPLETED', label: 'Completed' },
];

function BookedServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState<RequestedServiceProps[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const theme = useTheme();

  const fetchRequestedServices = useCallback(async () => {
    try {
      if (user) {
        const response = await axiosAuthApi.get(
          `/guest/order/get/all/requested/${user.username}`
        );
        setServices(response.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    fetchRequestedServices();
  }, [fetchRequestedServices]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { ALL: 0 };
    for (const s of services) {
      acc.ALL = (acc.ALL || 0) + 1;
      acc[s.status] = (acc[s.status] || 0) + 1;
    }
    return acc;
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.employeeFullName || '')
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (s.specialRequests || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === 'ALL' ? true : s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [services, search, filterStatus]);

  return (
    <main style={{ width: '100%', marginTop: '40px', marginBottom: '40px' }}>
      <SectionWrapper
        sx={{ borderRadius: '10px', padding: '15px 20px 25px 20px' }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div style={{ display: 'flex' }}>
            <FilterListIcon
              sx={{ color: theme.palette.primary.main, marginRight: '10px' }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Filter Bookings
            </Typography>
          </div>
          <SelectInput
            labelId="booking-scope-label"
            value={filterStatus}
            onChange={(e) => setFilterStatus(String(e.target.value))}
          >
            <MenuItem value="ALL">{`(${counts.ALL || 0}) All Bookings`}</MenuItem>
            {STATUS_OPTIONS.filter((s) => s.key !== 'ALL').map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {`(${counts[s.key] || 0}) ${s.label}`}
              </MenuItem>
            ))}
          </SelectInput>
        </Box>

        <TextInput
          fullWidth
          size="small"
          placeholder="Search for Booking"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ backgroundColor: `${theme.palette.background.default}` }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Stack
          sx={{ marginTop: '30px' }}
          direction="row"
          spacing={1}
          flexWrap="wrap"
        >
          {STATUS_OPTIONS.map((s) => {
            const key = s.key;
            const count = counts[key] || 0;
            const isSelected = filterStatus === key;

            return (
              <Chip
                key={key}
                label={`${s.label} ${count ? `(${count})` : ''}`}
                onClick={() => setFilterStatus(key)}
                clickable
                size="small"
                sx={{
                  borderRadius: '5px',
                  border: `1px solid ${theme.palette.primary.border}`,
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : 'transparent',
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  px: 1.4,
                  py: 0.5,
                  fontWeight: isSelected ? 700 : 500,
                }}
              />
            );
          })}
        </Stack>
      </SectionWrapper>

      <Box mt={3}>
        {filtered.length > 0 ? (
          filtered.map((svc, idx) => (
            <ServiceItem
              key={svc.id}
              index={idx}
              item={svc}
              fetchData={fetchRequestedServices}
            />
          ))
        ) : (
          <Typography color="text.secondary">No bookings found.</Typography>
        )}
      </Box>
    </main>
  );
}

export default BookedServicesPage;
