import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button, Box, FormControl, TextField, Typography, InputAdornment, IconButton,} from "@mui/material";
import {useDispatch} from "react-redux";
import {setUserData} from "../../components/auth/auth.tsx";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function RegisterPage(){
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = async (e: FormEvent) => {
    e.preventDefault();
    console.log(code, username, password)
    const res = await axiosApi.post('/open/register', { code, username, password });
    if (res.data.accessToken && res.data.refreshToken) {
      setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
    }
    navigate('/home');
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="inherit" sx={{}}>
      <FormControl sx={{minWidth: '25%', minHeight: '60%', padding: 6, gap: 2, borderRadius: 6, boxShadow: 10, justifyContent: 'center', backgroundColor: "background.paper"}}>
        <Typography variant="h4" align="center" sx={{mb: 2}}>Register Page</Typography>
        <TextField
          label="Code"
          onChange={(e) => setCode(e.target.value)}
          type="text"
          name="code"
          id="code"
          placeholder="Code"
        />
        <TextField
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          placeholder="Username"
        />
        <TextField
          label="Password"
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Password"
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
        <Button onClick={register} type='submit'>Register</Button>
        <Link style={{textAlign: 'center'}} to="/login">Wróć do logowania</Link>
      </FormControl>
    </Box>
  )

}

export default RegisterPage;