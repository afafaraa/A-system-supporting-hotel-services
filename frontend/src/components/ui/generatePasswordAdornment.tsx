import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import {Dispatch, SetStateAction} from "react";

const generatePasswordAdornment = (showPassword: boolean, setShowPassword: Dispatch<SetStateAction<boolean>>) => ({
  input: {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
          size="small"
          sx={{color: "text.secondary", p: 0}}
          disableRipple
        >
          {showPassword ? <VisibilityOffOutlined fontSize="inherit" /> : <VisibilityOutlined fontSize="inherit" />}
        </IconButton>
      </InputAdornment>
    )
  }
});

export default generatePasswordAdornment;
