import { styled } from '@mui/material/styles';

export const LogInInput = styled('input')(
  ({ theme }) => ({
    border: 'none',
    backgroundColor: theme.palette.custom1.secondary,
    padding: '8px 13px',
    borderRadius: '5px',
    fontSize: '12px',
    "&:focus": {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  })
);
