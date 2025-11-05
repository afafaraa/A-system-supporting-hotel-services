import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceItem from './ServiceItem.tsx';
import {
  Box,
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
import { StyledInput } from '../../../theme/styled-components/StyledInput.ts';
import { useTranslation } from 'react-i18next';
import { selectUserDetails } from '../../../redux/slices/userDetailsSlice.ts';

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

const STATUS_OPTIONS: { key: string; labelKey: string }[] = [
  { key: 'ALL', labelKey: 'allBookings' },
  { key: 'REQUESTED', labelKey: 'pending' },
  { key: 'ACTIVE', labelKey: 'confirmed' },
  { key: 'IN_PROGRESS', labelKey: 'inProgress' },
  { key: 'CANCELED', labelKey: 'canceled' },
  { key: 'COMPLETED', labelKey: 'completed' },
];

function BookedServicesPage() {
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);
  const [services, setServices] = useState<RequestedServiceProps[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const theme = useTheme();
  const { t } = useTranslation();

  const fetchRequestedServices = useCallback(async () => {
    try {
      if (user) {
        console.log(user)
        const response = await axiosAuthApi.get(
          `/guest/order/get/all/${user.username}`
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

  // Tooltip logic (same as AvailableServiceCard)
  const isAccountInactive = !userDetails?.active;
  const isNoRoom = !userDetails?.guestData?.currentReservation.roomNumber;
  const tooltipMsg = isNoRoom
    ? t('pages.available_services.tooltip.noRoom')
    : isAccountInactive
      ? t('pages.available_services.tooltip.accountInactive')
      : '';

  return (
    <main>
      <SectionWrapper
        sx={{ borderRadius: 3, padding: 3, paddingTop: 2 }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon
              sx={{ color: theme.palette.primary.main, marginRight: 1 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('pages.booked_services.filterBookings')}
            </Typography>
          </div>
          <SelectInput
            labelId="booking-scope-label"
            value={filterStatus}
            onChange={(e) => setFilterStatus(String(e.target.value))}
          >
            <MenuItem value="ALL">
              {`(${counts.ALL || 0}) ${t('pages.booked_services.allBookings')}`}
            </MenuItem>
            {STATUS_OPTIONS.filter((s) => s.key !== 'ALL').map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {`(${counts[s.key] || 0}) ${t(
                  `pages.booked_services.${s.labelKey}`
                )}`}
              </MenuItem>
            ))}
          </SelectInput>
        </Box>

        <StyledInput
          fullWidth
          size="small"
          placeholder={t('pages.booked_services.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 1 }}
          slotProps={{ input: { startAdornment: <SearchIcon fontSize="small" /> } }}
        />

        <Stack
          sx={{ marginTop: '16px' }}
          direction="row"
          gap={1}
          flexWrap="wrap"
        >
          {STATUS_OPTIONS.map((s) => {
            const key = s.key;
            const count = counts[key] || 0;
            const isSelected = filterStatus === key;

            return (
              <Chip
                key={key}
                label={`${t(`pages.booked_services.${s.labelKey}`)} ${
                  count ? `(${count})` : ''
                }`}
                onClick={() => setFilterStatus(key)}
                clickable
                size="small"
                sx={{
                  borderRadius: '5px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
                  },
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
          <Typography sx={{padding: '0 30px'}} color="text.secondary">
            {tooltipMsg || t('pages.booked_services.noBookingsFound')}
          </Typography>
        )}
      </Box>
    </main>
  );
}

export default BookedServicesPage;
