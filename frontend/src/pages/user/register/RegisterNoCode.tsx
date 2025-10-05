import axiosApi from '../../../middleware/axiosApi.ts';
import { setUserData } from '../../../components/auth/auth.tsx';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import StyledInput from '../../../theme/styled-components/StyledInput.ts';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import generatePasswordAdornment from '../../../components/ui/generatePasswordAdornment.tsx';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../components/ui/InputLabel.tsx';

function RegisterNoCode() {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.register.${key}`);
  const navigate = useNavigate();

  const disabled = username === '' || password === '';
  const register = async () => {
    if (disabled) {
      setError('error.emptyFields');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosApi.post('/open/register/no-code', {
        username,
        password,
        name,
        surname,
        email,
      });
      if (res.data.accessToken && res.data.refreshToken) {
        setUserData(res.data.accessToken, res.data.refreshToken, dispatch);
      }
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 400)
        setError('pages.register.invalidCodeError');
      else setError('error.unknownError');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid spacing={2} container columns={{ xs: 1, md: 2 }}>
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
              <LockIcon sx={{ fontSize: '120%' }} /> {tc('email')}
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
      </Grid>
      <Grid sx={{ flexGrow: 1 }} size={1}>
        <InputLabel
          label={
            <>
              <LockIcon sx={{ fontSize: '120%' }} /> {tc('name')}
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
              <LockIcon sx={{ fontSize: '120%' }} /> {tc('surname')}
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
      <Button
        disabled={disabled}
        onClick={register}
        loading={loading}
        fullWidth
        variant="contained"
      >
        {tc('registerButton')}
      </Button>
      {error && (
        <Typography
          component="p"
          variant="caption"
          color="error"
        >
          {t(error)}
        </Typography>
      )}
      <Button
        size="small"
        fullWidth
        sx={{ fontSize: '105%' }}
        onClick={() => navigate('/login')}
      >
        {'< '}
        {tc('goBack')}
      </Button>
    </Grid>
  );
}

export default RegisterNoCode;
