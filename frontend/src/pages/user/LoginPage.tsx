import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {Box, FormControl, IconButton, InputAdornment, TextField, Typography,} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";

function LoginPage(){
    const user = useSelector(selectUser);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      if (user !== null) navigate('/home')
    });

    const login = async (e: FormEvent) => {
        e.preventDefault();
        console.log(username, password)
        const res = await axiosApi.post('/open/token', { username, password });
        if (res.data.accessToken && res.data.refreshToken && res.data.role) {
          setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        }
        navigate('/home');
    }

    return (
        <Box sx={{display: "flex", justifyContent: "center", justifyItems: "center", alignItems: "center", height: "100%"}}>
            <FormControl sx={{width: '23%', height: '60%', backgroundColor: 'white', padding: 4, gap: 2}}>
                <Typography variant="h1" sx={{textAlign: 'center', fontSize: '32px'}}>Login Page</Typography>
                <TextField
                  label="Username"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                />
                <TextField
                  label="Password"
                  autoComplete="current-password"
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
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button onClick={login} type='submit'>Login</Button>
                <Link style={{textAlign: 'center'}} to="/reset-password-email">Kliknij aby zrestartować hasło</Link>
                <Link style={{textAlign: 'center'}} to="/register">Kliknij aby zarejestrować się z kodem</Link>
            </FormControl>
        </Box>
    )
}

export default LoginPage;