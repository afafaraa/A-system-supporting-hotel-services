import axiosApi from "../../middleware/axiosApi";
import {useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {Box, FormControl, TextField, Typography,} from "@mui/material";

function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(username, password)
        const res = await axiosApi.post(
            '/token',
            {
                username,
                password,
            }
        );
        if (res.data.accessToken && res.data.refreshToken) {
            localStorage.setItem('ACCESS_TOKEN', res.data.accessToken)
            localStorage.setItem('REFRESH_TOKEN', res.data.refreshToken)
        }
        navigate('/home');
    }

    return (
        <Box sx={{display: "flex", justifyContent: "center", justifyItems: "center", alignItems: "center", height: "100%"}}>
            <FormControl sx={{width: '23%', height: '60%', backgroundColor: 'white', padding: 4, gap: 2}}>
                <Typography variant="h1" sx={{textAlign: 'center', fontSize: '32px'}}>Login Page</Typography>
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
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <Button onClick={login} type='submit'>Login</Button>
                <Link style={{textAlign: 'center'}} to="/reset-password-email">Kliknij aby zrestartować hasło</Link>
            </FormControl>
        </Box>
    )
}

export default LoginPage;