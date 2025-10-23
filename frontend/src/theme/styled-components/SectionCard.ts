import {styled} from "@mui/material/styles";
import Box from "@mui/system/Box";

interface SectionCardProps {
  size?: number;
  clickable?: boolean;
}

export const SectionCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'clickable',
})<SectionCardProps>(
  ({ theme, size = 4, clickable }) => ({
    padding: theme.spacing(size),
    borderRadius: "12px",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(size * 0.6),
    },
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    fontSize: "14px",
    cursor: clickable ? "pointer" : "default",
    transition: clickable ? theme.transitions.create(['box-shadow', 'transform']) : undefined,
    overflow: "hidden",
    "&:hover": {
      boxShadow: clickable && theme.shadows[3],
      transform: clickable && "translateY(-2px)",
    }
  })
);
