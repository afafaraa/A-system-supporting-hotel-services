import {useEffect, useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {Button, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import ShadowCard from "../../theme/styled-components/ShadowCard.ts";
import InputLabel from "../../components/ui/InputLabel.tsx";
import StyledInput from "../../theme/styled-components/StyledInput.ts";
import AppLink from "../../components/ui/AppLink.tsx"
import EmailIcon from '@mui/icons-material/Email';

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

    const disabled = email.trim() === '';

    const sendEmail = async () => {
        if (disabled) return;
        setLoading(true);
        try {
            const res = await axiosApi.post(
              '/open/send-reset-password-email', { email: email }
            )
            setInfo("pages.reset-password.successMessage");
            console.log(res);
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                if (err.response.status === 400) setError("pages.reset-password.invalidEmail");
                else setError("error.unknownError");
            } else setError("error.unknownError");
        } finally {
            setLoading(false);
        }
    }
    return (
      <ShadowCard>
        <Typography variant="h1" fontWeight="regular" fontSize={28} color="primary.main">{tc("title")}</Typography>

        <InputLabel label={<><EmailIcon sx={{fontSize: "120%"}}/> {tc("email")}</>} htmlFor="email" mt={4}/>
        <StyledInput id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tc("email")} autoComplete="email" />

        <Button disabled={disabled} variant="contained" onClick={sendEmail} loading={loading} fullWidth sx={{mt: 4}}>{tc("sendButton")}</Button>
        {info && <Typography component="p" variant="caption" color="info" sx={{mt: 2}}>{t(info)}</Typography>}
        {error && <Typography component="p" variant="caption" color="error" sx={{mt: 2}}>{t(error)}</Typography>}
        <AppLink to="/login" mt={3} color="text.primary">{"< "}{tc("goBack")}</AppLink>
      </ShadowCard>
    )
}

export default SendResetPasswordEmail;