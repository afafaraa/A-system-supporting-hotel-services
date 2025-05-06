import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
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
import LogoutPage from "./pages/user/LogoutPage.tsx";
import AvailableServicesPage from "./pages/guest/AvailableServicesPage.tsx";
import NotificationsPage from "./pages/guest/NotificationsPage.tsx";
import PastServicesPage from "./pages/guest/PastServicesPage.tsx";
import RequestedServicesPage from "./pages/guest/RequestedServicesPage.tsx";
import ShoppingCartPage from "./pages/guest/ShoppingCartPage.tsx";
import {PropsWithChildren, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {initializeUserFromLocalStorage} from "./components/auth/auth.tsx";


function App(){

  return (
    <BrowserRouter>
      <AppInitializer>
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
      </AppInitializer>
    </BrowserRouter>
  )
}

const publicPaths = [
  '/login',
  '/logout',
  '/register',
  '/reset-password',
];

const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));

function AppInitializer({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
      initializeUserFromLocalStorage(dispatch)
        .then(isSuccessful => {
          if (!isSuccessful && !isPublicPath) navigate("/login");
        })
        .finally(() => setIsInitialized(true));
    }, [dispatch, navigate]
  );

  if (!isInitialized) return null;

  return <>{children}</>;
}

export default App;
