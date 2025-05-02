import {useState} from 'react';
import axiosApi from '../../middleware/axiosApi';

function SendResetPasswordEmail(){
    const [email, setEmail] = useState('');

    const sendEmail = async () => {
        const res = await axiosApi.post(
            '/open/send-reset-password-email',
            {
                email
            }
        )
        console.log(res);
    }
    return (
        <div>
            <label htmlFor="email">Enter email</label>
            <input onChange={(e) => setEmail(e.target.value)} type='text' id="email"/>
            <button onClick={sendEmail}>Send</button>
        </div>
    )
}

export default SendResetPasswordEmail;