import {styled} from "@mui/material/styles";
import Box from "@mui/system/Box";

interface SectionCardProps {
  size?: number;
}

export const SectionCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<SectionCardProps>(
  ({ theme, size = 4 }) => ({
    padding: theme.spacing(size),
    borderRadius: "12px",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(size * 0.6),
    },
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    fontSize: "14px",
  })
);
