import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  ClickAwayListener,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PersonOutline, Search } from "@mui/icons-material";
import GuestCard from "./GuestCard";
import { Guest, GuestStatusFilter } from "../../types/guest";
import GuestDetailsModal from "./modals/GuestDetailsModal";
import { SectionCard } from "../../theme/styled-components/SectionCard";
import { useTranslation } from "react-i18next";
import { axiosAuthApi } from '../../middleware/axiosApi';


function GuestsListPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.guests.${key}`);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [page] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState<GuestStatusFilter>("ALL");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchGuests = useCallback(async () => {
    setLoading(true)

    try {
      const res = await axiosAuthApi.get<Guest[]>('/guest/management', {
        params: { page: page, size: 10 },
      });
      const mapped: Guest[] = res.data.map((u) => ({
        id: u.id,
        name: u.name,
        surname: u.surname,
        servicesCount: u.servicesCount ?? 0,
        upcomingServicesCount: u.upcomingServicesCount ?? 0,
        phone: u.phone ?? "",
        email: u.email,
        status: mapStatus(
          u.guestData?.checkInDate ? u.guestData.checkInDate.toString() : "",
          u.guestData?.checkOutDate ? u.guestData.checkOutDate.toString() : ""
        ),
        guestData: u.guestData
          ? {
            roomNumber: u.guestData.roomNumber,
            checkInDate: u.guestData.checkInDate,
            checkOutDate: u.guestData.checkOutDate,
            bill: u.guestData.bill,
          }
          : undefined,
      }));
      setGuests(mapped);
    } catch (err) {
      console.error(err)
      setError('Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  const mapStatus = (
    checkInDate: string,
    checkOutDate: string
  ): "Checked-in" | "Checked-out" | "Upcoming" => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (now < checkIn) return "Upcoming";
    if (now > checkOut) return "Checked-out";
    return "Checked-in";
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const nameMatch =
        filterName.trim() === "" ||
        guest.name.toLowerCase().includes(filterName.toLowerCase()) ||
        guest.surname.toLowerCase().includes(filterName.toLowerCase());
      const statusMatch =
        filterStatus === "ALL" ||
        guest.status.replace("-", "_").toUpperCase() === filterStatus;
      return statusMatch && nameMatch;
    });
  }, [guests, filterName, filterStatus]);

  if (loading) {
    return (
      <SectionCard>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard>
        <Box display="flex" justifyContent="center" p={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isMobile ? "center" : "space-between"}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Box display="flex" alignItems="flex-start" flexDirection="row">
            <PersonOutline fontSize="large" />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {tc("title")}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            gutterBottom
          >
            {tc("subtitle")}
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
        >
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box display="flex" alignItems="center" position="relative">
              <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                <Search />
              </IconButton>
              {searchOpen && (
                <TextField
                  placeholder={tc("searchPlaceholder")}
                  variant="outlined"
                  size="small"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  sx={{
                    ml: 1,
                    width: "12rem",
                    transition: "width 0.3s ease",
                  }}
                  autoFocus
                />
              )}
            </Box>
          </ClickAwayListener>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as GuestStatusFilter
                )
              }
            >
              <MenuItem value="ALL">{tc("ALL")}</MenuItem>
              <MenuItem value="CHECKED_IN">{tc("Checked-in")}</MenuItem>
              <MenuItem value="CHECKED_OUT">{tc("Checked-out")}</MenuItem>
              <MenuItem value="UPCOMING">{tc("Upcoming")}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} sx={{ width: "100%" }}>
          {filteredGuests.map((guest) => (
            <Grid key={guest.id} size={{ xs: 12 }} sx={{ display: "flex" }}>
              <GuestCard
                guest={guest}
                onClick={() => {
                  setSelectedGuest(guest);
                  setModalOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedGuest && (
        <GuestDetailsModal
          open={modalOpen}
          guest={selectedGuest}
          onClose={() => setModalOpen(false)}
        />
      )}
    </SectionCard>
  );
}

export default GuestsListPage;
