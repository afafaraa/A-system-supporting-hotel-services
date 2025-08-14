import { styled } from '@mui/material/styles';

export const LogInWrapper = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: `0px 0px 15px -1px ${theme.palette.background.shadow}`,
  })
);
