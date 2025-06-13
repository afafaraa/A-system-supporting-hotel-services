import {useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {useParams} from 'react-router-dom';
import {FormControl, InputAdornment, IconButton, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const {token} = useParams();

    const resetPassword = async () => {
        if (password !== repeatPassword) return;
        const payload = {newPassword: password, token: token};
        const res = await axiosApi.post('/open/reset-password', payload);
        console.log(res)
    }

    return (
      <FormControl component="form" onSubmit={resetPassword} sx={{px: 6, py: 8, borderRadius: 6, boxShadow: 10, backgroundColor: "background.paper"}}>
        <Typography variant="h4" fontWeight="bold" align="center" sx={{mb: 4}}>Reset your password</Typography>
        <TextField
          label="Current password"
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Current password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="New password"
          autoComplete="new-password"
          onChange={e => setRepeatPassword(e.target.value)}
          type="password"
          name="password"
          id="repeatPassword"
          placeholder="New password"
        />
        <Button variant="outlined" onClick={resetPassword} sx={{mt: 2}}>Reset password</Button>
        <Link href="/login" align="center" fontSize={14} mt={3} color="textPrimary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>
          Wróć do logowania
        </Link>
      </FormControl>
    );
}

export default ResetPasswordPage;