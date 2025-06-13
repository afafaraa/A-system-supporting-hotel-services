import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {Alert, Box, FormControl, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import Link from '@mui/material/Link';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import {mainActionButtonSx} from "../../theme.ts";

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
    if (usernameError && username != '') setUsernameError(null);
  }, [username, usernameError]);

  useEffect(() => {
    if (passwordError && isPasswordEmpty && password != '') setPasswordError(null);
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
    <>
      <FormControl component="form" onSubmit={login}
                   sx={{px: 3, py: 8, '@media (min-width:420px)': {px: 6},
                     borderRadius: 6, boxShadow: 10, backgroundColor: "background.paper"}}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={4}>{tc("title")}</Typography>
        <TextField sx={{mb: 2}}
          error={!!usernameError}
          label={tc("username")}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          placeholder={tc("username")}
          helperText={usernameError}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <PersonIcon sx={{mx: "2px"}}/>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          error={!!passwordError}
          label={tc("password")}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder={tc("password")}
          helperText={passwordError}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Link href="/reset-password-email" align="end" fontSize={14} mt={1} mb={4} color="textSecondary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>{tc("resetPassword")}</Link>

        <Button variant="contained" onClick={login} type="submit" loading={loading} sx={mainActionButtonSx}>
          {tc("loginButton")}
        </Button>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Link href="/register" align="center" fontSize={14} mt={3} color="textPrimary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>{tc("registerWithCode")}</Link>
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
    </>
  );
}

export default LoginPage;