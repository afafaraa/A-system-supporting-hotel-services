import axiosApi from "../../middleware/axiosApi";
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {setUserData} from "../../components/auth/auth.tsx";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from '@mui/icons-material/Key';
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import ShadowCard from "../../theme/styled-components/ShadowCard.ts";
import StyledInput from "../../theme/styled-components/StyledInput.ts";
import InputLabel from "../../components/ui/InputLabel.tsx";
import LockIcon from '@mui/icons-material/Lock';
import generatePasswordAdornment from "../../components/ui/generatePasswordAdornment.tsx";

function RegisterPage(){
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.register.${key}`);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const disabled = code === '' || username === '' || password === '';

  const register = async () => {
    if (disabled) {
      setError("error.emptyFields");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosApi.post('/open/register', { code, username, password });
      if (res.data.accessToken && res.data.refreshToken) {
        setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
        navigate('/home');
      }
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 400) setError("pages.register.invalidCodeError");
      else setError("error.unknownError");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ShadowCard>
      <Typography variant="h1" fontWeight="regular" fontSize={28} color="primary.main">{tc("title")}</Typography>

      <InputLabel label={<><KeyIcon sx={{fontSize: "120%"}} /> {tc("code")}</>} htmlFor="code" mt={4}/>
      <StyledInput id="code" name="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={tc("code")} />

      <InputLabel label={<><PersonIcon sx={{fontSize: "120%"}} /> {tc("username")}</>} htmlFor="username" />
      <StyledInput id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={tc("username")} />

      <InputLabel label={<><LockIcon sx={{fontSize: "120%"}} /> {tc("password")}</>} htmlFor="password" />
      <StyledInput id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="************" autoComplete="new-password"
                   slotProps={generatePasswordAdornment(showPassword, setShowPassword)} />

      <Button disabled={disabled} onClick={register} loading={loading} fullWidth variant="contained" sx={{mt: 4}}>{tc("registerButton")}</Button>
      {error && <Typography component="p" variant="caption" color="error" sx={{mt: 2}}>{t(error)}</Typography>}
      <Button size="small" sx={{mt: 1, fontSize: "105%"}} fullWidth onClick={() => navigate("/login")}>{"< "}{tc("goBack")}</Button>

    </ShadowCard>
  )

}

export default RegisterPage;