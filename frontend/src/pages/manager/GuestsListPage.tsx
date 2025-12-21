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
} from "@mui/material";
import { PersonOutline, Search } from "@mui/icons-material";
import GuestCard from "./GuestCard";
import { GuestDetails, GuestStatusFilter } from "../../types";
import GuestDetailsModal from "./modals/GuestDetailsModal";
import { SectionCard } from "../../theme/styled-components/SectionCard";
import { useTranslation } from "react-i18next";
import { axiosAuthApi } from '../../middleware/axiosApi';
import SectionTitle from "../../components/ui/SectionTitle.tsx";


function GuestsListPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.guests.${key}`);

  const [guests, setGuests] = useState<GuestDetails[]>([]);
  const [page] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestDetails | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState<GuestStatusFilter>("ALL");

  const fetchGuests = useCallback(async () => {
    setLoading(true)

    try {
      const res = await axiosAuthApi.get<GuestDetails[]>('/guest/management/guests/details', {
        params: { page: page, size: 10 },
      });
      console.log(res.data);
      setGuests(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch guests.')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const nameMatch =
        filterName.trim() === "" ||
        guest.guest.name.toLowerCase().includes(filterName.toLowerCase()) ||
        guest.guest.surname.toLowerCase().includes(filterName.toLowerCase());
      const statusMatch =
        filterStatus === "ALL" ||
        guest.guest.guestData?.currentReservation.status.replace("-", "_").toUpperCase() === filterStatus;
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
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <SectionTitle title={<><PersonOutline /> {tc("title")}</>}
                      subtitle={tc("subtitle")} mb={0} />
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          justifyContent="flex-end"
          flexGrow={1}
        >
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box display="grid" alignItems="center" position="relative"
                 gridTemplateColumns={`auto ${searchOpen ? "1fr" : "0fr"}`} columnGap={searchOpen ? 1 : 0}
                 sx={{transition: "grid-template-columns 0.3s ease, column-gap 0.3s ease, flex-wrap 0.3s ease"}}>
              <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                <Search />
              </IconButton>
              <TextField
                placeholder={tc("searchPlaceholder")}
                variant="outlined"
                size="small"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                sx={{
                  visibility: searchOpen ? "visible" : "hidden",
                }}
                autoFocus
              />
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
              <MenuItem value="CHECKED_IN">{tc("checked-in")}</MenuItem>
              <MenuItem value="CHECKED_OUT">{tc("checked-out")}</MenuItem>
              <MenuItem value="UPCOMING">{tc("upcoming")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
