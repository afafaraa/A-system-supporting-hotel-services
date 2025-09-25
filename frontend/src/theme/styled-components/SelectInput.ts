import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';

export const SelectInput = styled(Select)(({ theme }) => ({
  borderRadius: 5,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.primary.light,
  '& .MuiSelect-select': {
    fontSize: '12px',
    padding: '8px 12px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 5,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
  marginBottom: 5,
}));
