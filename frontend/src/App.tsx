import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/user/LoginPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import ProtectedRoute from './router/protectedRoute.tsx';
import SendResetPasswordEmail from './pages/user/SendResetPasswordEmail.tsx';
import ResetPasswordPage from './pages/user/ResetPasswordPage.tsx';
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import RegisterPage from './pages/user/RegisterPage.tsx';
import AddReservationPage from './pages/AddReservationPage.tsx'
import EmployeeListPage from "./pages/manager/EmployeeListPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import AvailableServicesPage from "./pages/guest/AvailableServicesPage.tsx";
import NotificationsPage from "./pages/guest/NotificationsPage.tsx";
import PastServicesPage from "./pages/guest/PastServicesPage.tsx";
import RequestedServicesPage from "./pages/guest/RequestedServicesPage.tsx";
import ShoppingCartPage from "./pages/guest/ShoppingCartPage.tsx";

function App(){
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/add-reservation" element={<ProtectedRoute><AddReservationPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeeListPage /></ProtectedRoute>} />
          <Route path="/available-services" element={<ProtectedRoute><AvailableServicesPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}/>
          <Route path="/past-services" element={<ProtectedRoute><PastServicesPage /></ProtectedRoute>}/>
          <Route path="/requested-services" element={<ProtectedRoute><RequestedServicesPage /></ProtectedRoute>}/>
          <Route path="/shopping-cart" element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>}/>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-email" element={<SendResetPasswordEmail />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;