import axiosApi from "../../middleware/axiosApi";
import {useState } from 'react';
import { useNavigate } from "react-router-dom";

function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(username, password)
        const res = await axiosApi.post(
            '/token',
            {
                username,
                password,
            }
        );
        if (res.data.accessToken && res.data.refreshToken) {
            localStorage.setItem('ACCESS_TOKEN', res.data.accessToken)
            localStorage.setItem('REFRESH_TOKEN', res.data.refreshToken)
        }
        navigate('/home');
    }

    const resetPassword = () => {
        navigate('/reset-password-email');
    }

    return (
        <div>
            Login Page
            <form>
                <label htmlFor="username">Username</label>
                <input onChange={(e) => setUsername(e.target.value)} id='username' type='text'/>
                <label htmlFor="password">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} id='password' type='password' />
                <button onClick={login} type='submit'>Login</button>
                <button onClick={resetPassword}>Reset password</button>
            </form>
        </div>
    )
}

export default LoginPage;