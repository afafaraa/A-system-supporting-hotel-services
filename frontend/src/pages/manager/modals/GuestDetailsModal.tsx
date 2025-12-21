import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Chip,
  Typography,
  Avatar,
  Box,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import { GuestDetails } from "../../../types";
import NavigationTabs from "../../../pages/manager/tempComponents/NavigationTabs";
import {
  Close,
  EmailOutlined,
  StarBorder,
  RoomOutlined,
  Language,
  CommentOutlined,
  EmojiFoodBeverage,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface GuestDetailsProps {
  open: boolean;
  guest: GuestDetails;
  onClose: () => void;
}

function GuestDetailsModal({ open, guest, onClose }: GuestDetailsProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.guests.${key}`);
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [tc("guest_info"), `${tc("services")} (${guest.completedServices.length + guest.upcomingServices.length  || 0})`];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          p: 2,
          position: "relative",
          borderRadius: 3,
          height: 650,
        },
      }}
    >
      <Box>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          pt: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box flexShrink={0}>
          <Box display="flex" alignItems="center" gap={2} mb={0.5}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                width: 64,
                height: 64,
                color: "primary.main",
                fontSize: 20,
                fontWeight: "bold",
                borderRadius: 3,
              }}
            >
              {guest.guest.name[0]}
              {guest.guest.surname[0]}
            </Avatar>
            <Box display="flex" flexDirection="column">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {guest.guest.name} {guest.guest.surname}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={tc(guest.guest.guestData?.currentReservation?.status.toLowerCase().replace(/_/g, "-") || "")}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.status[
                      guest.guest.guestData?.currentReservation.status
                        .toUpperCase()
                        .replace(
                          /-/g,
                          "_"
                        ) as keyof typeof theme.palette.status
                      ],
                    color: "primary.contrastText",
                    minWidth: 110,
                    height: 22,
                    borderRadius: 2,
                  }}
                />
                <StarBorder fontSize="small" sx={{ color: "gold" }} />
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {tc("room")} {guest.guest.guestData?.currentReservation.roomNumber} | {guest.upcomingServices.length} {tc("booked")}
          </Typography>
          <NavigationTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
          />
        </Box>
        <Box flex={1} overflow="auto" pr={1}>
          {activeTab === 0 && (
            <>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 3, height: "100%" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      {tc("contact_info")}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EmailOutlined fontSize="small" color="action" />
                      <Typography variant="body2">{guest.guest.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <RoomOutlined fontSize="small" color="action" />
                      <Typography variant="body2">{tc("room")} {guest.guest.guestData?.currentReservation.roomNumber}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Language fontSize="small" color="action" />
                      <Typography variant="body2">{tc("language")}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 3, height: "100%" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      {tc("stay_info")}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexDirection="column"
                      mb={1}
                    >
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight="bold"
                      >
                        {tc("check_in")} {tc("date")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(guest.guest.guestData?.currentReservation.checkIn ?? "")
                          .toLocaleDateString("pl-PL")
                          .replace(/\./g, "/")}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexDirection="column"
                      mb={1}
                    >
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight="bold"
                      >
                        {tc("check_out")} {tc("date")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(guest.guest.guestData?.currentReservation.checkOut ?? "")
                          .toLocaleDateString("pl-PL")
                          .replace(/\./g, "/")}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexDirection="column"
                      mb={1}
                    >
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight="bold"
                      >
                        {tc("account_balance")}
                      </Typography>
                      <Typography
                        component="span"
                        fontWeight="bold"
                        color="primary"
                      >
                        {guest.guest.guestData?.bill.toFixed(2)}$
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  mt: 2,
                  bgcolor: "background.default",
                  boxShadow: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="500"
                  gutterBottom
                >
                  {tc("additional_info")}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}
                >
                  <CommentOutlined fontSize="small" />
                  {tc("special_requests")}:
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="smaller">
                  {guest.guest.guestData?.currentReservation.specialRequests || tc("no_special_requests")}
                </Typography>
              </Paper>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
                {tc("upcoming_services")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {guest.upcomingServices.length} {tc("upcoming_services").toLowerCase()}
              </Typography>
              {guest.upcomingServices.map((service) => (
                <Paper
                  key={service.id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    mb: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Paper
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        width: 48,
                        height: 48, 
                        overflow: "hidden",
                      }}
                    >
                      <EmojiFoodBeverage color="primary" fontSize="large" />
                    </Paper>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography fontWeight="bold">{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {guest.guest.name} {guest.guest.surname} | {tc("room")} {guest.guest.guestData?.currentReservation.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        09/08/2025 {tc("at")} {service.weekday[0].startHour}:00
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    gap={1}
                  >
                    <Chip
                      label={"confirmed"}
                      size="small"
                      color="primary"
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        borderRadius: 2,
                      }}
                    />
                    <Typography color="text.primary" fontWeight="bold">
                      {service.price}$
                    </Typography>
                  </Box>
                </Paper>
              ))}

              <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
                {tc("service_history")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {guest.completedServices.length + guest.cancelledServices.length} {tc("completed_service")}
              </Typography>
              {guest.completedServices.concat(guest.cancelledServices).map((service) => (
                <Paper
                  key={service.id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    mb: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Paper
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "lightGreen",
                        width: 48,
                        height: 48,
                        overflow: "hidden",
                      }}
                    >
                      <EmojiFoodBeverage fontSize="large" />
                    </Paper>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography fontWeight="bold">{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {guest.guest.name} {guest.guest.surname} | {tc("room")} {guest.guest.guestData?.currentReservation.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        09/08/2025 {tc("at")} {service.weekday[0].startHour}:00
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    gap={1}
                  >
                    <Chip
                      label={"completed"}
                      size="small"
                      color="primary"
                      sx={{
                        bgcolor: "green",
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        borderRadius: 2,
                      }}
                    />
                    <Typography color="text.primary" fontWeight="bold">
                      {service.price}$
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default GuestDetailsModal;
