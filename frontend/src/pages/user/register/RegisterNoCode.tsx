import axiosApi from '../../../middleware/axiosApi.ts';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import StyledInput from '../../../theme/styled-components/StyledInput.ts';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import generatePasswordAdornment from '../../../components/ui/generatePasswordAdornment.tsx';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../components/ui/InputLabel.tsx';
import EmailIcon from '@mui/icons-material/Email';
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

function RegisterNoCode() {
  const [error, setError] = useState<string | null>(null);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {t: tc} = useTranslationWithPrefix('pages.register');
  const navigate = useNavigate();

  const passwordsMatch = password === repeatPassword;
  const disabled = username === '' || password === '' || repeatPassword === '' || name === '' || surname === '' || email === '' || !passwordsMatch;
  const register = async () => {
    setLoading(true);
    try {
      const res = await axiosApi.post<{email: string}>('/open/register/no-code', {
        username,
        password,
        name,
        surname,
        email,
      });
      console.log(res)
      setSentToEmail(res.data.email)
    } catch (err) {
      console.log(err);
      if (isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response?.data?.message)
        } else if (typeof err.response?.data === 'string') {
          setError(err.response?.data);
        } else {
          setError('error.unknownError');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '100%'}}>
      <Grid columnSpacing={2} container columns={{ xs: 1, md: 2 }} mb={2}>
        <Grid sx={{ flexGrow: 1 }} size={1}>
          <InputLabel
            label={
              <>
                <PersonIcon sx={{ fontSize: '120%' }} /> {tc('username')}
              </>
            }
            htmlFor="username"
          />
          <StyledInput
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={tc('username')}
          />

          <InputLabel
            label={
              <>
                <LockIcon sx={{ fontSize: '120%' }} /> {tc('password')}
              </>
            }
            htmlFor="password"
          />
          <StyledInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="************"
            autoComplete="new-password"
            slotProps={generatePasswordAdornment(showPassword, setShowPassword)}
          />

          <InputLabel
            label={
              <>
                <LockIcon sx={{ fontSize: '120%' }} /> {tc('repeatPassword')}
              </>
            }
            htmlFor="repeatPassword"
          />
          <StyledInput
            id="repeatPassword"
            name="repeatPassword"
            type={showRepeatPassword ? 'text' : 'password'}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="************"
            autoComplete="new-password"
            slotProps={generatePasswordAdornment(showRepeatPassword, setShowRepeatPassword)}
            error={repeatPassword !== '' && !passwordsMatch}
          />

        </Grid>
        <Grid sx={{ flexGrow: 1 }} size={1}>
          <InputLabel
            label={
              <>
                <EmailIcon sx={{ fontSize: '120%' }} /> {tc('email')}
              </>
            }
            htmlFor="email"
          />
          <StyledInput
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tc('email')}
          />

          <InputLabel
            label={
              <>
                <PersonIcon sx={{ fontSize: '120%' }} /> {tc('name')}
              </>
            }
            htmlFor="name"
          />
          <StyledInput
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tc('name')}
          />

          <InputLabel
            label={
              <>
                <PersonIcon sx={{ fontSize: '120%' }} /> {tc('surname')}
              </>
            }
            htmlFor="surname"
          />
          <StyledInput
            id="surname"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder={tc('surname')}
          />
        </Grid>
      </Grid>
      <Button
        disabled={disabled}
        onClick={register}
        loading={loading}
        fullWidth
        variant="contained"
      >
        {tc('registerButton')}
      </Button>
      <div style={{textAlign: 'left', margin: '6px 0'}}>
        {!passwordsMatch && repeatPassword !== '' && (
          <Typography component="p" variant="caption" color="error">
            {tc('passwordsDoNotMatch')}
          </Typography>
        )}
        {error && (
          <Typography component="p" variant="caption" color="error">
            {t(error)}
          </Typography>
        )}
        {sentToEmail && (
          <Typography component="p" variant="caption" color="success.main">
            {tc('emailSent', {email: sentToEmail})}
          </Typography>
        )}
      </div>
      <Button
        size="small"
        fullWidth
        sx={{ fontSize: '105%' }}
        onClick={() => navigate('/login')}
      >
        {'< '}
        {tc('goBack')}
      </Button>
    </div>
  );
}

export default RegisterNoCode;
