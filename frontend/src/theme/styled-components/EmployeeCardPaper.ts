import {styled} from "@mui/material/styles";
import { Paper } from "@mui/material";

export const EmployeeCardPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  borderRadius: 12,
  width: "100%",
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  flexDirection: "column",
  gap: 1.5,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
}));