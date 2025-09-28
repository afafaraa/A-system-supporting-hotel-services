import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';

export const SelectInput = styled(Select)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.primary.light,
  '& .MuiSelect-select': {
    fontSize: '12px',
    padding: '5px 12px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  marginBottom: 5,
}));
