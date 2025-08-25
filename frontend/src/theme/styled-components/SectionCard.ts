import {styled} from "@mui/material/styles";
import Box from "@mui/system/Box";

export const SectionCard = styled(Box)(
  ({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: `${theme.shape.borderRadius * 4}px`,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    fontSize: "0.875rem",
  })
);
