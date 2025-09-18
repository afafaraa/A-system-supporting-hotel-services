import { styled } from '@mui/material/styles';
import {TextField} from "@mui/material";

export const StyledInput = styled(TextField)(
  ({ theme }) => ({
    borderRadius: 5,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.primary.light,
    '& .MuiInputBase-input': {fontSize: '12px', padding: "8px 12px 8px 12px"},
    '& .MuiOutlinedInput-root': {
      '& fieldset': {border: 'none'},
      '&.Mui-focused fieldset': {border: `2px solid ${theme.palette.primary.main}`, borderRadius: 5},
    },
    '& .MuiInputBase-input::placeholder': {opacity: 0.7},
    marginBottom: 5,
  })
)
