import {FormEvent, useEffect, useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {Alert, Button, FormControl, Link, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";

function SendResetPasswordEmail(){
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const tc = (key: string) => t(`pages.reset-password.${key}`);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 10_000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const sendEmail = async (e: FormEvent) => {
        e.preventDefault();
        if (email.trim() === '') return;
        setLoading(true);
        try {
            const res = await axiosApi.post(
              '/open/send-reset-password-email', { email: email }
            )
            setInfo(tc("successMessage"));
            console.log(res);
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                if (err.response.status === 400) setError(tc("invalidEmail"));
                else if (err.response.status === 401) setInfo("Powinno działać, ale nie działa.");
                else setError(t("error.unknownError"));
            } else setError(t("error.unknownError"));
        } finally {
            setLoading(false);
        }
    }
    return (
      <FormControl component="form" onSubmit={sendEmail} sx={{px: 6, py: 8, borderRadius: 6, boxShadow: 10, backgroundColor: "background.paper"}}>
        <Typography variant="h4" fontWeight="bold" align="center" sx={{mb: 4}}>{tc("title")}</Typography>
        <TextField sx={{mb: 4}}
          label={tc("email")}
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder={tc("email")}
        />
        <Button onClick={sendEmail} type="submit" loading={loading}>{tc("sendButton")}</Button>
        {info && <Alert severity="info" sx={{mt: 2}}>{info}</Alert>}
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Link href="/login" align="center" fontSize={14} mt={3} color="textPrimary" sx={{textDecoration: "none", "&:hover": {textDecoration: "underline"} }}>
          {tc("goBack")}
        </Link>
      </FormControl>
    )
}

export default SendResetPasswordEmail;