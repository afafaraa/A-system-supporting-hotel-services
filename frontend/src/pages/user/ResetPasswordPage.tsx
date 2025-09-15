import {useEffect, useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {useParams} from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import ShadowCard from "../../theme/styled-components/ShadowCard.ts";
import InputLabel from "../../components/ui/InputLabel.tsx";
import StyledInput from "../../theme/styled-components/StyledInput.ts";
import generatePasswordAdornment from "../../components/ui/generatePasswordAdornment.tsx";
import AppLink from "../../components/ui/AppLink.tsx"

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

    const disabled = password === '' || repeatPassword === '';

    const resetPassword = async () => {
        if (disabled) {
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
      <ShadowCard>
        <Typography variant="h1" fontWeight="regular" fontSize={28} color="primary.main">{tc("title")}</Typography>

        <InputLabel label={tc("newPassword")} htmlFor="password" mt={4}/>
        <StyledInput id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={tc("newPassword")} autoComplete="new-password"
                     slotProps={generatePasswordAdornment(showPassword, setShowPassword)} />

        <InputLabel label={tc("repeatPassword")} htmlFor="repeatPassword" />
        <StyledInput id="repeatPassword" name="password" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder={tc("repeatPassword")} autoComplete="new-password" />

        <Button disabled={disabled} variant="contained" onClick={resetPassword} loading={loading} sx={{mt: 4}} fullWidth>
          {tc("resetPasswordButton")}
        </Button>
        {info && <Typography component="p" variant="caption" color="info" sx={{mt: 2}}>{info}</Typography>}
        {error && <Typography component="p" variant="caption" color="error" sx={{mt: 2}}>{error}</Typography>}
        <AppLink to="/login" mt={3} color="text.primary">{"< "}{tc("goBack")}</AppLink>
      </ShadowCard>
    );
}

export default ResetPasswordPage;