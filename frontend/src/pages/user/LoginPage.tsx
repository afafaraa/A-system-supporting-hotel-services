import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography
} from "@mui/material";
import Link from '@mui/material/Link';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import {mainActionButtonSx} from "../../theme/theme.ts";
import Logo from "../../../public/hotel.svg?react";
import {palette} from "../../theme/palette.ts";
import {fontSizes} from "../../theme/fontSizes.ts";
import {LogInWrapper} from "../../theme/styled-components/LogInWrapper.ts";
import {LogInInput} from "../../theme/styled-components/LogInInput.ts";

function LoginPage(){
  const user = useSelector(selectUser);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (usernameError && username !== '') setUsernameError(null);
  }, [username, usernameError]);

  useEffect(() => {
    if (passwordError && isPasswordEmpty && password !== '') setPasswordError(null);
  }, [password, passwordError, isPasswordEmpty]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!username) { setUsernameError(t("error.fieldRequired")); return; }
    else setUsernameError(null);
    if (!password) { setPasswordError(t("error.fieldRequired")); setIsPasswordEmpty(true); return; }
    else { setPasswordError(null); setIsPasswordEmpty(false); }
    setLoading(true);
    axiosApi.post('/open/token', { username, password })
      .then(res => {
        if (res.data.accessToken && res.data.refreshToken) {
          setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        }
        navigate('/home')
      })
      .catch(e => {
        if (isAxiosError(e)) {
          if (e.response) {
            if (e.response.status === 401) setPasswordError(tc("invalidCredentials"));
            else if (e.response.status >= 500) setError(tc("serverError"));
            else setError(t("error.unknownError"));
          } else if (e.code === "ERR_NETWORK") setError(t("error.networkError"));
          else setError(t("error.unknownError"));
        } else setError(t("error.unknownError"));
      })
      .finally(() => setLoading(false));
  }

  return (
    <LogInWrapper>
      <FormControl sx={{display: 'flex', alignItems: 'center'}} component="form" onSubmit={login}>
        <Logo style={{
          background: palette.light.primary,
          padding: '5px 10px',
          color: palette.light.icon,
          borderRadius: '10%'
        }} width={70} height={70}/>
        <Typography variant="h1" fontWeight="regular" align="center" sx={{
          color: palette.light.primary,
          fontSize: fontSizes.md,
          marginTop: '20px'
        }}>{tc("title")}</Typography>
        <Typography variant="h2" frontWeight="medium" align="center" sx={{
          color: palette.light.text.secondary,
          fontSize: fontSizes.xs,
          marginBottom: '20px'
        }}>{tc("subtitle")}</Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '5px',
          }}
        >
          <label style={{fontWeight: '500', fontSize: '14px'}} htmlFor="username">Username</label>
          <LogInInput onChange={(e) => setUsername(e.target.value)} id="username" placeholder="jan.kowalski@gmail.com"/>
          <label style={{fontWeight: '500', fontSize: '14px'}} htmlFor="password">Password</label>
          <LogInInput onChange={(e) => setPassword(e.target.value)} id="password" placeholder="************" />
        </div>
        <Link href="/reset-password-email" align="right" fontSize={14} mt={1} mb={2} color="textSecondary"
              sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{tc("resetPassword")}</Link>

        <Button sx={{width: '100%'}} variant="contained" onClick={login} type="submit" loading={loading}>
          {tc("loginButton")}
        </Button>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Link href="/register" align="center" fontSize={14} mt={3} color="textPrimary"
              sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{tc("registerWithCode")}</Link>
      </FormControl>

      <Box position="fixed" my="auto" left={4} display={{xs: "none", md: "flex"}} flexDirection="column" gap={0.8}>
        <p>Quick log-in:</p>
        <button onClick={() => {
          setUsername("user"); setPassword("password"); login();
         }}>Log as user</button>
        <button onClick={() => {
          setUsername("admin"); setPassword("password"); login();
        }}>Log as admin</button>
        <button onClick={() => {
          setUsername("employee1"); setPassword("password"); login();
        }}>Log as employee1</button>
        <button onClick={() => {
          setUsername("employee2"); setPassword("password123"); login();
        }}>Log as employee2</button>
        <button onClick={() => {
          setUsername("employee3"); setPassword("easy"); login();
        }}>Log as employee3</button>
        <button onClick={() => {
          setUsername("manager"); setPassword("password"); login();
        }}>Log as manager</button>
      </Box>
    </LogInWrapper>
  );
}

export default LoginPage;