import axiosApi from '../../../middleware/axiosApi.ts';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import StyledInput from '../../../theme/styled-components/StyledInput.ts';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import generatePasswordAdornment from '../../../components/ui/generatePasswordAdornment.tsx';
import { useNavigate } from 'react-router-dom';
import InputLabel from '../../../components/ui/InputLabel.tsx';
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

function RegisterWithCode() {
  const [code, setCode] = useState('');
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {t: tc} = useTranslationWithPrefix('pages.register');
  const navigate = useNavigate();

  const disabled = code === '' || username === '' || password === '';
  const register = async () => {
    if (disabled) {
      setError('error.emptyFields');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosApi.post('/open/register/with-code', {
        code,
        username,
        password,
      });
      console.log(res.data);
      setSentToEmail(res.data.email);
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 400)
        setError('pages.register.invalidCodeError');
      else setError('error.unknownError');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '100%'}}>
      <InputLabel
        label={
          <>
            <KeyIcon sx={{ fontSize: '120%' }} /> {tc('code')}
          </>
        }
        htmlFor="code"
      />
      <StyledInput
        id="code"
        name="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={tc('code')}
      />

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
        sx={{mb: 2}}
      />

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
        {error && (
          <Typography component="p" variant="caption" color="error">
            {t(error)}
          </Typography>
        )}
        {sentToEmail && (
          <Typography component="p" variant="caption" color="success">
            {tc('emailSent', {email: sentToEmail})}
          </Typography>
        )}
      </div>
      <Button
        size="small"
        sx={{ fontSize: '105%' }}
        fullWidth
        onClick={() => navigate('/login')}
      >
        {'< '}
        {tc('goBack')}
      </Button>
    </div>
  );
}

export default RegisterWithCode;
