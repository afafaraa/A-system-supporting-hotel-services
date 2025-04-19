import {useState} from 'react';
import axiosApi from '../../middleware/axiosApi';
import { useParams } from 'react-router-dom';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [repetPassword, setRepetPassword] = useState('');
    const {token} = useParams();

    const resetPassword = async () => {
        if(password !== repetPassword) {
            return;
        }
        let res = await axiosApi.post(
            '/reset-password',
            {
                newPassword: password,
                token
            }
        )
        console.log(res)
    }

    return (
        <div>
            <label htmlFor="password">Enter new password</label>
            <input onChange={e => setPassword(e.target.value)} type="password" id="password"/>
        
            <label htmlFor="repetPassword">Repeat password</label>
            <input onChange={e => setRepetPassword(e.target.value)} type="password" id="repetPassword"/>

            <button onClick={resetPassword}>Reset password</button>
        </div>
    )
}

export default ResetPasswordPage;