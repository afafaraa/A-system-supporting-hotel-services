import {
  Paper,
  Typography,
  Avatar,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Guest } from "../../types/guest";
import { styled } from "@mui/material/styles";
import { RoomOutlined, EmailOutlined } from "@mui/icons-material";

interface GuestCardProps {
  guest: Guest;
  onClick: () => void;
}

const EmployeeCardPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  padding: theme.spacing(2),
  borderRadius: 12,
  width: "100%",
  boxShadow: "none",
  minHeight: 100,
  border: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
}));

function GuestCard({ guest, onClick }: GuestCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <EmployeeCardPaper onClick={onClick}>
      <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
        <Box>
          <Avatar
            sx={{
              bgcolor: "primary.medium",
              width: 64,
              height: 64,
              color: "primary.main",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {guest.name[0]}
            {guest.surname[0]}
          </Avatar>
        </Box>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography variant="h6" fontWeight="bold">
            {guest.name} {guest.surname}
          </Typography>
          {!isMobile ? (
            <Box display="flex" alignItems="center" gap={1}>
              <RoomOutlined fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body1" color="text.secondary">
                Room {guest.room}
              </Typography>
              <EmailOutlined
                fontSize="small"
                sx={{ color: "text.secondary", ml: 3 }}
              />
              <Typography variant="body1" color="text.secondary">
                {guest.email}
              </Typography>
            </Box>
          ) : (
            <Box />
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.primary">
              Check-in:{" "}
              {new Date(guest.checkInDate)
                .toLocaleDateString("pl-PL")
                .replace(/\./g, "/")}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mx: 1 }}>
              |
            </Typography>
            <Typography variant="body2" color="text.primary">
              Check-out:{" "}
              {new Date(guest.checkOutDate)
                .toLocaleDateString("pl-PL")
                .replace(/\./g, "/")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        justifyContent={isMobile ? "space-between" : "flex-end"}
        flexGrow={1}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={0.5}
          alignItems="center"
        >
          <Chip
            label={guest.status}
            sx={{
              bgcolor: (theme) =>
                theme.palette.status[
                  guest.status
                    .toUpperCase()
                    .replace(/-/g, "_") as keyof typeof theme.palette.status
                ],
              color: "primary.contrastText",
              minWidth: 110,
              height: 22,
              borderRadius: 2,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {guest.servicesCount} services
          </Typography>
          <Typography variant="body2" color="primary.main">
            {guest.upcomingServicesCount} upcoming
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={0.5}
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {guest.bill.toFixed(2)}$
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Balance
          </Typography>
        </Box>
      </Box>
    </EmployeeCardPaper>
  );
}

export default GuestCard;
