import { styled } from '@mui/material/styles';
import {TextField} from "@mui/material";

export const StyledInput = styled(TextField)(
  ({ theme }) => ({
    '& .MuiInputBase-input': {
      fontSize: '12px',
      padding: "10px",
      '::placeholder': {opacity: 0.7,}
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.primary.light,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
    width: '100%',
  })
)
export default StyledInput;
