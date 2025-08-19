import { styled } from '@mui/material/styles';
import {Paper} from "@mui/material";

export const LogInWrapper = styled(Paper)(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: `0px 0px 20px 2px ${theme.palette.background.shadow}`,
    border: `2px solid ${theme.palette.background.shadow}`
  })
);
