import {Typography} from "@mui/material";
import {OrderStatus} from "../../types/schedule.ts";
import {t} from "i18next";

interface Props {
  size: "small" | "big";
  status: OrderStatus;
  sx?: object;
}

const chipProps = (size: "small" | "big") => size === "small"
  ? { fontSize: "11px", borderRadius: "9px", px: 0.8, py: 0.4, }
  : { fontSize: "12px", borderRadius: "12px", px: { xs: 1, sm: 2 }, py: 0.6, };

const OrderStatusChip = ({size, status, sx}: Props) => {
  return (
    <Typography
      fontWeight="bold"
      width="fit-content"
      color="calendar.text"
      bgcolor={`calendar.${status}`}
      sx={sx}
      {...chipProps(size)}
    >
      {t(`order_status.${status}`)}
    </Typography>
  );
}

export default OrderStatusChip;
