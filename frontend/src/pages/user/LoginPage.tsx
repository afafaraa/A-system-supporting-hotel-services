import axiosApi from "../../middleware/axiosApi";
import {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import Button from '@mui/material/Button';
import {Box, Typography, useTheme} from "@mui/material";
import AppLink from "../../components/ui/AppLink.tsx";
import {Link as RouterLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {setUserData} from "../../components/auth/auth.tsx";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import Logo from "../../assets/hotel.svg?react";
import {fontSizes} from "../../theme/fontSizes.ts";
import ShadowCard from "../../theme/styled-components/ShadowCard.ts";
import StyledInput from "../../theme/styled-components/StyledInput.ts";
import InputLabel from "../../components/ui/InputLabel.tsx";
import dashboardDestination from "../../utils/dashboardDestination.ts";
import generatePasswordAdornment from "../../components/ui/generatePasswordAdornment.tsx";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from '@mui/icons-material/Lock';

function LoginPage(){
  const user = useSelector(selectUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);
  const theme = useTheme();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (user) return <Navigate to={dashboardDestination(user.role)} replace />;

  const disabled = username === '' || password === '';

  const login = () => {
    if (disabled) { setError("error.emptyFields"); return; }
    else { setError(null); }
    setLoading(true);
    axiosApi.post('/open/token', { username, password })
      .then(res => {
        if (res.data.accessToken && res.data.refreshToken) {
          setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        }
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

  return (
    <>
      <ShadowCard>
        <Logo style={{
          background: theme.palette.primary.main,
          padding: '5px 10px',
          color: theme.palette.background.default,
          borderRadius: '10%'
        }} width={70} height={70}/>

        <Box mt={1}>
          <Typography component={RouterLink} to="/home" variant="h1" fontWeight="bold" fontSize={fontSizes.md} color="primary.main" sx={{textDecoration: "none"}}>{tc("title")}</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary" mt={0.5} sx={{textWrap: "pretty"}}>{tc("subtitle")}</Typography>
        </Box>

        <InputLabel label={<><PersonIcon sx={{fontSize: "120%"}} /> {tc("username")}</>} htmlFor="username" mt={3} />
        <StyledInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder={tc("username")}/>

        <InputLabel label={<><LockIcon sx={{fontSize: "120%"}} /> {tc("password")}</>} htmlFor="password" />
        <StyledInput type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="************"
                     slotProps={generatePasswordAdornment(showPassword, setShowPassword)}/>

        <AppLink to="/reset-password-email" color="text.secondary" mt={3}>{tc("resetPassword")}</AppLink>
        <AppLink to="/register/no-code" color="text.primary" mt={0.8}>{tc("registerWithCode")}</AppLink>
        <Button disabled={disabled} fullWidth variant="contained" onClick={login} loading={loading} sx={{mt: 3}}>
          {tc("loginButton")}
        </Button>
        {error && <Typography component="p" variant="caption" color="error" sx={{mt: 2}}>{t(error)}</Typography>}
      </ShadowCard>

      <Box position="fixed" my="auto" left={4} display={{xs: "none", md: "flex"}} flexDirection="column" gap={0.8}>
        <p>Quick log-in:</p>
        <button onClick={() => {
          setUsername("user"); setPassword("password"); login();
        }}>[guest] user</button>
        <button onClick={() => {
          setUsername("admin"); setPassword("password"); login();
        }}>[admin] admin</button>
        <button onClick={() => {
          setUsername("employee1"); setPassword("password"); login();
        }}>[employee] employee1</button>
        <button onClick={() => {
          setUsername("employee2"); setPassword("password123"); login();
        }}>[reception] employee2</button>
        <button onClick={() => {
          setUsername("employee3"); setPassword("easy"); login();
        }}>[employee] employee3</button>
        <button onClick={() => {
          setUsername("manager"); setPassword("password"); login();
        }}>[manager] manager</button>
      </Box>
    </>
  );
}

export default LoginPage;