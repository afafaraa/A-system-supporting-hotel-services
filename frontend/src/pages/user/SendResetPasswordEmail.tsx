import {useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import {Box} from "@mui/system";
import {Button, FormControl, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function SendResetPasswordEmail(){
    const [email, setEmail] = useState('');

    const sendEmail = async () => {
        const res = await axiosApi.post(
            '/open/send-reset-password-email', { email: email }
        )
        console.log(res);
    }
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="inherit">
        <FormControl sx={{minWidth: '25%', minHeight: '50%', padding: 6, gap: 2, borderRadius: 6, boxShadow: 10, justifyContent: 'center', backgroundColor: "background.paper"}}>
          <Typography variant="h4" align="center" sx={{mb: 2}}>Reset your password</Typography>
          <TextField
            label="Your email address"
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Your email address"
          />
          <Button variant="outlined" onClick={sendEmail} sx={{mt: 1}}>Send reset password email</Button>
          <Link style={{textAlign: 'center'}} to="/login">Wróć do logowania</Link>
        </FormControl>
      </Box>
    )
}

export default SendResetPasswordEmail;