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
import { Guest } from "../../../types/guest";
import { Service } from "../../../types/service";
import NavigationTabs from "../tempComponents/NavigationTabs";
import {
  Close,
  EmailOutlined,
  StarBorder,
  RoomOutlined,
  Language,
  CommentOutlined,
  EmojiFoodBeverage,
} from "@mui/icons-material";

interface GuestDetailsProps {
  open: boolean;
  guest: Guest;
  onClose: () => void;
}

const upcomingServices: Service[] = [
  {
    id: "1",
    name: "Breakfast Service",
    weekday: [{ day: "MONDAY", startHour: 8, endHour: 18 }],
    duration: 60,
    type: "GENERAL_SERVICE",
    disabled: false,
    price: 25,
    image: "https://example.com/spa-massage.jpg",
  },
  {
    id: "2",
    name: "Breakfast Service",
    weekday: [{ day: "MONDAY", startHour: 8, endHour: 18 }],
    duration: 60,
    type: "GENERAL_SERVICE",
    disabled: false,
    price: 25,
    image: "https://example.com/spa-massage.jpg",
  },
  {
    id: "3",
    name: "Breakfast Service",
    weekday: [{ day: "MONDAY", startHour: 8, endHour: 18 }],
    duration: 60,
    type: "GENERAL_SERVICE",
    disabled: false,
    price: 25,
    image: "https://example.com/spa-massage.jpg",
  },
  {
    id: "4",
    name: "Breakfast Service",
    weekday: [{ day: "MONDAY", startHour: 8, endHour: 18 }],
    duration: 60,
    type: "GENERAL_SERVICE",
    disabled: false,
    price: 25,
    image: "https://example.com/spa-massage.jpg",
  },
];

const serviceHistory: Service[] = [
  {
    id: "5",
    name: "Breakfast Service",
    weekday: [{ day: "MONDAY", startHour: 8, endHour: 18 }],
    duration: 60,
    type: "GENERAL_SERVICE",
    disabled: false,
    price: 25,
    image: "https://example.com/spa-massage.jpg",
  },
];

function GuestDetailsModal({ open, guest, onClose }: GuestDetailsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Guest Info", `Services (${guest?.servicesCount || 0})`];

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
                bgcolor: "primary.medium",
                width: 64,
                height: 64,
                color: "primary.main",
                fontSize: 20,
                fontWeight: "bold",
                borderRadius: 3,
              }}
            >
              {guest.name[0]}
              {guest.surname[0]}
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
                {guest.name} {guest.surname}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={guest.status}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.status[
                        guest.status
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
            Room {guest.room} | {guest.servicesCount} services booked
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
                      Contact Information
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EmailOutlined fontSize="small" color="action" />
                      <Typography variant="body2">{guest.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <RoomOutlined fontSize="small" color="action" />
                      <Typography variant="body2">Room {guest.room}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Language fontSize="small" color="action" />
                      <Typography variant="body2">English</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 3, height: "100%" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Stay Information
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
                        Check-in Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(guest.checkInDate)
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
                        Check-out Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(guest.checkOutDate)
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
                        Account Balance
                      </Typography>
                      <Typography
                        component="span"
                        fontWeight="bold"
                        color="primary"
                      >
                        {guest.bill.toFixed(2)}$
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
                  bgcolor: "grey.200",
                  boxShadow: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="black"
                  gutterBottom
                >
                  Additional Information
                </Typography>
                <Typography
                  variant="body2"
                  color="black"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CommentOutlined fontSize="small" sx={{ color: "black" }} />
                  Special Requests:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High floor, city view preferred
                </Typography>
              </Paper>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
                Upcoming Services
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {upcomingServices.length} upcoming services
              </Typography>
              {upcomingServices.map((service) => (
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
                        {guest.name} {guest.surname} | Room {guest.room}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        09/08/2025 at {service.weekday[0].startHour}:00 AM
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
                Service History
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {serviceHistory.length} completed service
              </Typography>
              {serviceHistory.map((service) => (
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
                        {guest.name} {guest.surname} | Room {guest.room}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        09/08/2025 at {service.weekday[0].startHour}:00 AM
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
