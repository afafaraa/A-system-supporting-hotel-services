import { styled } from '@mui/material/styles';

export const SectionWrapper = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '10px 5px',
    borderRadius: '25px',
    border: `1px solid ${theme.palette.divider}`
  })
);
