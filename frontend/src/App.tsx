import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/user/LoginPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import ProtectedRoute from './router/protectedRoute.tsx';
import SendResetPasswordEmail from './pages/user/SendResetPasswordEmail.tsx';
import ResetPasswordPage from './pages/user/ResetPasswordPage.tsx';
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import RegisterPage from './pages/user/RegisterPage.tsx';
import AddReservationPage from './pages/AddReservationPage.tsx'
import LogoutPage from "./pages/LogoutPage.tsx";

function App(){
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/add-reservation" element={<ProtectedRoute><AddReservationPage /></ProtectedRoute>} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-email" element={<SendResetPasswordEmail />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;