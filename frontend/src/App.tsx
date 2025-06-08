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
import AvailableServicesPage from "./pages/guest/available-services/AvailableServicesPage.tsx";
import NotificationsPage from "./pages/guest/NotificationsPage.tsx";
import PastServicesPage from "./pages/guest/requested-services/PastServicesPage.tsx";
import RequestedServicesPage from "./pages/guest/requested-services/RequestedServicesPage.tsx";
import ShoppingCartPage from "./pages/guest/shopping-cart/ShoppingCartPage.tsx";
import {PropsWithChildren, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {initializeUserFromLocalStorage} from "./components/auth/auth.tsx";
import ServiceSchedulePage from "./pages/guest/service-schedule/ServiceSchedulePage.tsx";
import EmployeeSchedulePage from "./pages/employee/EmployeeSchedulePage.tsx";
import EmployeeServicePage from "./pages/employee/EmployeeServicePage.tsx";
import LoadingPage from "./pages/user/LoadingPage.tsx";
import EmployeeDetailsPage from "./pages/manager/EmployeeDetailsPage.tsx";
import ServicesListPage from "./pages/manager/ServicesListPage.tsx";
import StatsPage from "./pages/manager/StatsPage.tsx";
import AddNewEmployeePage from './pages/manager/AddNewEmployeePage.tsx';

function App(){

  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>

          <Route element={<AuthenticatedLayout />}>
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/add-reservation" element={<ProtectedRoute><AddReservationPage /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><EmployeeListPage /></ProtectedRoute>} />
            <Route path="/employee/schedule" element={<ProtectedRoute><EmployeeSchedulePage /></ProtectedRoute>} />
            <Route path="/employee/service/:serviceId" element={<ProtectedRoute><EmployeeServicePage /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}><EmployeeListPage /></ProtectedRoute>} />
            <Route path="/employees/:username" element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}><EmployeeDetailsPage /></ProtectedRoute>}/>
            <Route path="/employees/new" element={<ProtectedRoute><AddNewEmployeePage /></ProtectedRoute>}/>
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}/>
            <Route path="/services" element={<Navigate to={"/services/available"} replace />} />
            <Route path="/services/available" element={<ProtectedRoute><AvailableServicesPage /></ProtectedRoute>} />
            <Route path="/services/requested" element={<ProtectedRoute><RequestedServicesPage /></ProtectedRoute>}/>
            <Route path="/services/history" element={<ProtectedRoute><PastServicesPage /></ProtectedRoute>}/>
            <Route path="/services/shopping-cart" element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>}/>
            <Route path="/service-schedule/:id" element={<ProtectedRoute><ServiceSchedulePage /></ProtectedRoute>}/>
            <Route path="/management/services" element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}><ServicesListPage /></ProtectedRoute>} />
            <Route path="/management/statistics" element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}><StatsPage /></ProtectedRoute>} />
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

const isPublicPath = (path: string) =>
  publicPaths.some(publicPath => path.startsWith(publicPath));

function AppInitializer({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
      initializeUserFromLocalStorage(dispatch)
        .then(isSuccessful => {
          if (!isSuccessful && !isPublicPath(location.pathname)) navigate("/login");
        })
        .finally(() => setIsInitialized(true));
    }, [dispatch, navigate]
  );

  if (!isInitialized) return <LoadingPage/>;

  return <>{children}</>;
}

export default App;
