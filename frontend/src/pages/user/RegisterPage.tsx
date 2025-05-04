import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button, Box, FormControl, TextField, Typography,} from "@mui/material";
import {useDispatch} from "react-redux";
import {setUserData} from "../../components/auth/auth.tsx";

function RegisterPage(){
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        <Box sx={{display: "flex", justifyContent: "center", justifyItems: "center", alignItems: "center", height: "100%"}}>
            <FormControl sx={{width: '23%', height: '60%', backgroundColor: 'white', padding: 4, gap: 2}}>
                <Typography variant="h1" sx={{textAlign: 'center', fontSize: '32px'}}>Register Page</Typography>
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
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <Button onClick={register} type='submit'>Register</Button>
                <Link style={{textAlign: 'center'}} to="/login">Kliknij aby się zalogować</Link>
            </FormControl>
        </Box>
    )

}

export default RegisterPage;