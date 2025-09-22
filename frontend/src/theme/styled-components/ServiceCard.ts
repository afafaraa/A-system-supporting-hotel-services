import {styled} from "@mui/material/styles";
import { Paper } from "@mui/material";

export const ServiceCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));