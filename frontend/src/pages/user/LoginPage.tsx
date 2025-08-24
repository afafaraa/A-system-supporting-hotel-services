import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {
  Box, Typography, useTheme,
  IconButton, InputAdornment,
} from "@mui/material";
import Link from '@mui/material/Link';
import {Link as RouterLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import Logo from "../../assets/hotel.svg?react";
import {fontSizes} from "../../theme/fontSizes.ts";
import {LogInWrapper} from "../../theme/styled-components/LogInWrapper.ts";
import {LogInInput} from "../../theme/styled-components/LogInInput.ts";
import {VisibilityOutlined, VisibilityOffOutlined} from "@mui/icons-material";
import navigateToDashboard from "../../utils/navigateToDashboard.ts";

function LoginPage(){
  const user = useSelector(selectUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);
  const theme = useTheme();

  const navigateBasedOnUserRole = () => {
    if (user) {
      if (user.role === 'ROLE_GUEST') {
        navigate('/guest');
      } else if (user.role === 'EMPLOYEE') {

      } else {
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    if (user !== null) navigateToDashboard(user.role, navigate);
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (e?: FormEvent) => {
    e?.preventDefault();
    if (username === '' || password === '') { setError("error.emptyFields"); return; }
    else { setError(null); }
    setLoading(true);
    axiosApi.post('/open/token', { username, password })
      .then(res => {
        if (res.data.accessToken && res.data.refreshToken) {
          setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        }
        navigateBasedOnUserRole();
      })
      .catch(e => {
        if (!isAxiosError(e) || (!e.response && e.code !== "ERR_NETWORK")) { setError("error.unknownError"); return; }
        if (!e.response) { setError(e.code === "ERR_NETWORK" ? "error.networkError" : "error.unknownError"); return; }
        if (e.response.status === 401) setError("error.invalidCredentials");
        else if (e.response.status >= 500) setError("error.serverError");
        else setError("error.unknownError");
      })
      .finally(() => setLoading(false));
  }

  const passwordVisibility = () => ({
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

  return (
    <>
      <LogInWrapper>
        <Logo style={{
          background: theme.palette.primary.main,
          padding: '5px 10px',
          color: theme.palette.background.default,
          borderRadius: '10%'
        }} width={70} height={70}/>
        <Box textAlign="center" mt={2} mb={2.5}>
          <Typography variant="h1" fontWeight="regular" fontSize={fontSizes.md} color="primary.main">{tc("title")}</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary" mt={0.5}>{tc("subtitle")}</Typography>
        </Box>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: '5px', marginBottom: '20px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: theme.palette.text.primary}} htmlFor="username">{tc("username")}</label>
          <LogInInput type="email" onChange={(e) => setUsername(e.target.value)} id="username" placeholder="jan.kowalski@gmail.com"/>
          <label style={{fontWeight: '500', fontSize: '14px', color: theme.palette.text.primary}} htmlFor="password">{tc("password")}</label>
          <LogInInput type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="************"
                      slotProps={passwordVisibility()}/>
        </div>
        <Link component={RouterLink} to="/reset-password-email" fontSize={12} color="text.secondary"
              sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{tc("resetPassword")}</Link>
        <Link component={RouterLink} to="/register" align="center" fontSize={12} color="textPrimary" mt={0.6}
              sx={{textDecoration: "none", marginBottom: '15px', "&:hover": {textDecoration: "underline"}}}>{tc("registerWithCode")}</Link>
        <Button fullWidth variant="contained" onClick={login} type="submit" loading={loading}>
          {tc("loginButton")}
        </Button>
        {error && <Typography variant="caption" color="error" mt={2}>{t(error)}</Typography>}
      </LogInWrapper>

      <Box position="fixed" my="auto" left={4} display={{xs: "none", md: "flex"}} flexDirection="column" gap={0.8}>
        <p>Quick log-in:</p>
        <button onClick={() => {
          setUsername("user"); setPassword("password"); login().then(() => null);
        }}>Log as user</button>
        <button onClick={() => {
          setUsername("admin"); setPassword("password"); login().then(() => null);
        }}>Log as admin</button>
        <button onClick={() => {
          setUsername("employee1"); setPassword("password"); login().then(() => null);
        }}>Log as employee1</button>
        <button onClick={() => {
          setUsername("employee2"); setPassword("password123"); login().then(() => null);
        }}>Log as employee2</button>
        <button onClick={() => {
          setUsername("employee3"); setPassword("easy"); login().then(() => null);
        }}>Log as employee3</button>
        <button onClick={() => {
          setUsername("manager"); setPassword("password"); login().then(() => null);
        }}>Log as manager</button>
      </Box>
    </>
  );
}

export default LoginPage;