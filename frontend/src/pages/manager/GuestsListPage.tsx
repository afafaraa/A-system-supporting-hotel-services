import { useState, useMemo } from "react";
import {
  Box,
  Paper,
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
import { Guest } from "../../types/guest";
import GuestDetailsModal from "./modals/GuestDetailsModal";

const tempGuests: Guest[] = [
  {
    id: 1,
    name: "Alice",
    surname: "Johnson",
    checkInDate: "2023-10-01",
    checkOutDate: "2023-10-05",
    room: "301",
    servicesCount: 3,
    upcomingServicesCount: 1,
    phone: "123-456-7890",
    bill: 750,
    email: "johndoe@example.com",
    status: "Checked-in",
  },
  {
    id: 2,
    name: "Alice",
    surname: "Johnson",
    checkInDate: "2023-10-01",
    checkOutDate: "2023-10-05",
    room: "301",
    servicesCount: 3,
    upcomingServicesCount: 1,
    phone: "123-456-7890",
    bill: 750,
    email: "johndoe@example.com",
    status: "Checked-out",
  },
  {
    id: 3,
    name: "Alice",
    surname: "Johnson",
    checkInDate: "2023-10-01",
    checkOutDate: "2023-10-05",
    room: "301",
    servicesCount: 3,
    upcomingServicesCount: 1,
    phone: "123-456-7890",
    bill: 750,
    email: "johndoe@example.com",
    status: "Upcoming",
  },
];

function GuestsListPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "CHECKED_IN" | "CHECKED_OUT" | "UPCOMING"
  >("ALL");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredGuests = useMemo(() => {
    return tempGuests.filter((guest) => {
      const nameMatch =
        filterName.trim() === "" ||
        guest.name.toLowerCase().includes(filterName.toLowerCase()) ||
        guest.surname.toLowerCase().includes(filterName.toLowerCase());
      const statusMatch =
        filterStatus === "ALL" ||
        guest.status.replace("-", "_").toUpperCase() === filterStatus;
      return statusMatch && nameMatch;
    });
  }, [filterName, filterStatus]);

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
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 5,
        border: `1px solid`,
        borderColor: "divider",
      }}
    >
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
              Guests Management
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            gutterBottom
          >
            View and manage hotel guests and their information
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
                  placeholder="Search guests..."
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
                  e.target.value as
                    | "ALL"
                    | "CHECKED_IN"
                    | "CHECKED_OUT"
                    | "UPCOMING"
                )
              }
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="CHECKED_IN">Checked In</MenuItem>
              <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
              <MenuItem value="UPCOMING">Upcoming</MenuItem>
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
    </Paper>
  );
}

export default GuestsListPage;
