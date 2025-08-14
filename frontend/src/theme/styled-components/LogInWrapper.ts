import { styled } from '@mui/material/styles';

export const LogInWrapper = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.custom1.primary,
    padding: '40px 30px',
    borderRadius: '25px',
    boxShadow: `0px 0px 15px -1px ${theme.palette.custom3.contrastText}`,
  })
);
