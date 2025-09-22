import {styled} from "@mui/material/styles";
import { Paper } from "@mui/material";

export const GuestCardPaper = styled(Paper)(({ theme }) => ({
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