import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {Alert, Box, FormControl, IconButton, InputAdornment, TextField, Typography,} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";
import {useTranslation} from "react-i18next";

function LoginPage(){
  const user = useSelector(selectUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);

  useEffect(() => {
    if (user !== null) navigate('/home')
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    axiosApi.post('/open/token', { username, password })
      .then(res => {
        if (res.data.accessToken && res.data.refreshToken) {
          setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        }
        navigate('/home')
      })
      .catch(e => {
        setError(e.message);
      })
  }

  return (
    <Box sx={{display: "flex", justifyContent: "center", justifyItems: "center", alignItems: "center", height: "100%"}}>
      <FormControl sx={{minWidth: '25%', minHeight: '65%', backgroundColor: 'white', padding: 6, gap: 2, borderRadius: 6, boxShadow: 10, justifyContent: 'center' }}>
        <Typography variant="h1" sx={{textAlign: 'center', fontSize: '32px', mb: 2 }}>{tc("title")}</Typography>
        <TextField
          label={tc("username")}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          placeholder={tc("username")}
        />
        <TextField
          label={tc("password")}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder={tc("password")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size='small'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant='text' onClick={login} type='submit'>{tc("loginButton")}</Button>
        {error &&
            <Alert severity="error" sx={{mb: 3, border: '1px solid red'}}>{error}.</Alert>
        }
        <Link style={{textAlign: 'center'}} to="/reset-password-email">{tc("resetPassword")}</Link>
        <Link style={{textAlign: 'center'}} to="/register">{tc("registerWithCode")}</Link>
      </FormControl>
    </Box>
  )
}

export default LoginPage;