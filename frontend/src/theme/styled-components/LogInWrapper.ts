import { styled } from '@mui/material/styles';

export const LogInWrapper = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: `0px 0px 20px 2px ${theme.palette.background.shadow}`,
    border: `1px solid ${theme.palette.background.shadow}`
  })
);
