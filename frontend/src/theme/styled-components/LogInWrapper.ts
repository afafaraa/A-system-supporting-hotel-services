import { styled } from '@mui/material/styles';
import Box from "@mui/system/Box";

export const LogInWrapper = styled(Box)(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: `0px 0px 20px 2px ${theme.palette.primary.medium}`,
    border: `2px solid ${theme.palette.primary.medium}`
  })
);
