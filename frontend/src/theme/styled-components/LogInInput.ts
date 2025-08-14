import { styled } from '@mui/material/styles';
import {TextField} from "@mui/material";

export const LogInInput = styled(TextField)(
  ({ theme }) => ({
    size: 'small',
    borderRadius: 5,
    backgroundColor: theme.palette.custom1.secondary,
    '& .MuiInputBase-input': {fontSize: '12px', padding: "8px 12px 8px 12px"},
    '& .MuiOutlinedInput-root': {
      '& fieldset': {border: 'none'},
      '&.Mui-focused fieldset': {border: `2px solid ${theme.palette.primary.main}`, borderRadius: 5},
    },
  })
)
