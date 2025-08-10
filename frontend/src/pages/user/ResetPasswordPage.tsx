import {FormEvent, useEffect, useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {useParams} from 'react-router-dom';
import {FormControl, InputAdornment, IconButton, TextField, Typography, Alert} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {mainActionButtonSx} from "../../theme/theme.ts";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {token} = useParams();
    const { t } = useTranslation();
    const tc = (key: string) => t(`pages.reset-password.${key}`);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 10_000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const resetPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (password === '' || repeatPassword === '') {
            setError(t("error.emptyFields"));
            return;
        }
        if (password !== repeatPassword) {
            setError(tc("passwordsDoNotMatch"));
            return;
        }
        setLoading(true);
        const payload = {newPassword: password, token: token};
        try {
            const res = await axiosApi.post('/open/reset-password', payload);
            console.log("Wynik operacji: " + res)
            setInfo(tc("resetPasswordSuccess"));
        } catch (err) {
            console.log(err);
            if (isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    setError(tc("invalidToken"));
                } else if (err.response.status === 401) {
                    setError(tc("invalidToken"));
                // } else if (err.response.status === 404) {
                //     setError(tc("userNotFound"));
                } else {
                    setError(t("error.unknownError"));
                }
            } else setError(t("error.unknownError"));
        } finally {
            setLoading(false);
        }
    }

    return (
      <FormControl component="form" onSubmit={resetPassword} sx={{px: 6, py: 8, borderRadius: 6, boxShadow: 10, backgroundColor: "background.paper"}}>
        <Typography variant="h4" fontWeight="bold" align="center" sx={{mb: 4}}>{tc("title")}</Typography>
        <TextField sx={{mb: 2}}
          label={tc("newPassword")}
          autoComplete="new-password"
          onChange={e => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder={tc("newPassword")}
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
        <TextField sx={{mb: 4}}
          label={tc("repeatPassword")}
          autoComplete="new-password"
          onChange={e => setRepeatPassword(e.target.value)}
          type="password"
          name="password"
          id="repeatPassword"
          placeholder={tc("repeatPassword")}
        />
        <Button variant="contained" onClick={resetPassword} type="submit" loading={loading} sx={mainActionButtonSx}>
          {tc("resetPasswordButton")}
        </Button>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        {info && <Alert severity="info" sx={{mt: 2}}>{info}</Alert>}
        <Link href="/login" align="center" fontSize={14} mt={3} color="textPrimary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>
          {tc("goBack")}
        </Link>
      </FormControl>
    );
}

export default ResetPasswordPage;