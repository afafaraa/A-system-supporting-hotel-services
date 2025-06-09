import {useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {Link, useParams} from 'react-router-dom';
import {Box} from "@mui/system";
import {FormControl, InputAdornment, IconButton, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const {token} = useParams();

    const resetPassword = async () => {
        if(password !== repeatPassword) return;
        const payload = {newPassword: password, token: token};
        const res = await axiosApi.post('/open/reset-password', payload);
        console.log(res)
    }

    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="inherit">
        <FormControl sx={{minWidth: '25%', minHeight: '60%', padding: 6, gap: 2, borderRadius: 6, boxShadow: 10, justifyContent: 'center', backgroundColor: "background.paper"}}>
          <Typography variant="h4" align="center" sx={{mb: 2}}>Reset your password</Typography>
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
          <Link style={{textAlign: 'center'}} to="/login">Wróć do logowania</Link>
        </FormControl>
      </Box>
    );
}

export default ResetPasswordPage;