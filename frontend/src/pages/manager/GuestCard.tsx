import {
  Typography,
  Avatar,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Guest } from "../../types";
import { RoomOutlined, EmailOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GuestCardPaper } from "../../theme/styled-components/GuestCardPaper";

interface GuestCardProps {
  guest: Guest;
  onClick: () => void;
}

function GuestCard({ guest, onClick }: GuestCardProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.guests.${key}`);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <GuestCardPaper onClick={onClick}>
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
          <Typography fontWeight="bold">
            {guest.name} {guest.surname}
          </Typography>
          {!isMobile ? (
            <Box display="flex" alignItems="center" gap={1}>
              <RoomOutlined fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {tc("room")} {guest.guestData?.roomNumber}
              </Typography>
              <EmailOutlined
                fontSize="small"
                sx={{ color: "text.secondary", ml: 3 }}
              />
                <Typography variant="body2" color="text.secondary">
                {guest.email}
              </Typography>
            </Box>
          ) : (
            <Box />
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.primary">
              {tc("check_in")}:{" "}
              {new Date(guest.guestData?.checkInDate ?? "")
                .toLocaleDateString("pl-PL")
                .replace(/\./g, "/")}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mx: 1 }}>
              |
            </Typography>
            <Typography variant="body2" color="text.primary">
              {tc("check_out")}:{" "}
              {new Date(guest.guestData?.checkOutDate ?? "")
                .toLocaleDateString("pl-PL")
                .replace(/\./g, "/")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        justifyContent={isMobile ? "space-between" : "flex-end"}
        flexGrow={1}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={0.2}
          alignItems="center"
        >
          <Chip
            label={tc(guest.status)}
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
            {guest.servicesCount} {tc("services").toLowerCase()}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {guest.upcomingServicesCount} {tc("Upcoming").toLowerCase()}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={0.5}
          alignItems="center"
        >
          <Typography fontSize="1rem" color="text.secondary">
            {tc("balance")}
          </Typography>
          <Typography fontSize="1.1rem" fontWeight="bold" color="primary.main">
            {guest.guestData?.bill.toFixed(2)}$
          </Typography>
        </Box>
      </Box>
    </GuestCardPaper>
  );
}

export default GuestCard;
