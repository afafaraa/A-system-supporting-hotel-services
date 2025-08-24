import axiosApi from "../../middleware/axiosApi";
import {FormEvent, useEffect, useState} from 'react';
import {Button, FormControl, TextField, Typography, InputAdornment, IconButton, Alert,} from "@mui/material";
import {useDispatch} from "react-redux";
import {setUserData} from "../../components/auth/auth.tsx";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from '@mui/icons-material/Key';
import Link from "@mui/material/Link";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";

function RegisterPage(){
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.register.${key}`);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const register = async (e: FormEvent) => {
    e.preventDefault();
    if (code === '' || username === '' || password === '') {
      setError(t("error.emptyFields"));
      return;
    }
    setLoading(true);
    try {
      const res = await axiosApi.post('/open/register', { code, username, password });
      if (res.data.accessToken && res.data.refreshToken) {
        setUserData(res.data.accessToken, res.data.refreshToken, dispatch)
      }
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 400) setError(tc("invalidCodeError"));
      else setError(t("error.unknownError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormControl component="form" onSubmit={register} sx={{px: 6, py: 8, borderRadius: 6, boxShadow: 10, backgroundColor: "background.paper"}}>
      <Typography variant="h4" fontWeight="bold" align="center" sx={{mb: 4}}>{tc("title")}</Typography>
      <TextField sx={{mb: 2}}
        label={tc("code")}
        onChange={(e) => setCode(e.target.value)}
        type="text"
        name="code"
        id="code"
        placeholder={tc("code")}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <KeyIcon sx={{mx: "2px"}}/>
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField sx={{mb: 2}}
        label={tc("username")}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        name="username"
        id="username"
        placeholder={tc("username")}
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
      <TextField sx={{mb: 4}}
        label={tc("password")}
        autoComplete="new-password"
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
                  size="small"
                >
                  {showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Button onClick={register} type='submit' loading={loading}>{tc("registerButton")}</Button>
      {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
      <Link href="/login" align="center" fontSize={14} mt={3} color="textPrimary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>
        {tc("goBack")}
      </Link>
    </FormControl>
  )

}

export default RegisterPage;