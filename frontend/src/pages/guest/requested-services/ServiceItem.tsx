import { useState } from "react";
import { RequestedServiceProps } from "./BookedServicesPage.tsx";
import { OrderStatus } from "../../../types/schedule.ts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { CalendarToday, AccessTime } from "@mui/icons-material";
import RateServiceDialog from "./RateServiceDialog.tsx";
import CancelServiceDialog from "./CancelServiceDialog.tsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

function ServiceItem({
                       item,
                       index,
                       fetchData,
                     }: {
  item: RequestedServiceProps;
  index: number;
  fetchData: () => void;
}) {
  const [openRate, setOpenRate] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const statusColor: Record<string, string> = {
    [OrderStatus.CANCELED]: theme.palette.calendar?.CANCELED || "grey",
    [OrderStatus.ACTIVE]: theme.palette.calendar?.ACTIVE || "orange",
    [OrderStatus.REQUESTED]: theme.palette.calendar?.REQUESTED || "purple",
    [OrderStatus.COMPLETED]: theme.palette.calendar?.COMPLETED || "green",
  };

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{
        borderRadius: "16px",
        mb: 3,
        boxShadow: `0 2px 8px ${theme.palette.background.shadow}`,
      }}
    >
      <RateServiceDialog
        open={openRate}
        setOpen={setOpenRate}
        scheduleId={item.id}
        fetchData={fetchData}
      />
      <CancelServiceDialog
        open={openCancel}
        setOpen={setOpenCancel}
        scheduleId={item.id}
        fetchData={fetchData}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.employeeFullName}
            </Typography>
            <Chip
              label={t(`pages.past_services.${item.status}`)}
              sx={{
                mt: 1,
                bgcolor: statusColor[item.status],
                color: theme.palette.calendar?.text || "#fff",
                fontWeight: 500,
              }}
              size="small"
            />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {item.price}$
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" gap={3} color="text.secondary">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              {new Date(item.datetime).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime fontSize="small" />
            <Typography variant="body2">
              {new Date(item.datetime).toLocaleTimeString().slice(0, 5)}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          {item.status === OrderStatus.ACTIVE ||
          item.status === OrderStatus.REQUESTED ? (
            <Button
              variant="contained"
              color="primary"
              disabled={
                new Date(item.datetime).getTime() - Date.now() <
                60 * 60 * 1000 || item.status === OrderStatus.ACTIVE
              }
              onClick={() => setOpenCancel(true)}
              sx={{ borderRadius: "12px", px: 3 }}
            >
              {t("buttons.cancel")}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={item.status === OrderStatus.CANCELED}
              onClick={() => setOpenRate(true)}
              sx={{ borderRadius: "12px", px: 3 }}
            >
              {t("pages.past_services.rate")}
            </Button>
          )}
          <Typography variant="body2" color="text.secondary">
            30 minutes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;