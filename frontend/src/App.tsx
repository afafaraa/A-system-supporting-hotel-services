import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/user/LoginPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import ProtectedRoute from './router/protectedRoute.tsx';
import SendResetPasswordEmail from './pages/user/SendResetPasswordEmail.tsx';
import ResetPasswordPage from './pages/user/ResetPasswordPage.tsx';

function App(){
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password-email" element={<SendResetPasswordEmail />} /> 
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/home" element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            } />
            <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    )
}

export default App;