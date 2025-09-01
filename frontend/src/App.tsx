import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import LoginPage from './pages/user/LoginPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import ProfilePage from "./pages/home/ProfilePage.tsx";
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
import LoadingPage from "./pages/user/LoadingPage.tsx";
import EmployeeDetailsPage from "./pages/manager/EmployeeDetailsPage.tsx";
import ServicesListPage from "./pages/manager/ServicesListPage.tsx";
import StatsPage from "./pages/manager/StatsPage.tsx";
import AddNewEmployeePage from './pages/manager/forms/AddNewEmployeePage.tsx';
import GuestMainPage from "./pages/guest/layout/GuestMainPage.tsx";

function App(){
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          <Route path="/services" element={<Navigate to={"/services/available"} replace />} />

          <Route element={<AuthenticatedLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/guest" element={<GuestMainPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/services/shopping-cart" element={<ShoppingCartPage />} />
              <Route path="/service-schedule/:id" element={<ServiceSchedulePage />} />
              <Route element={<GuestMainPage />}>
                <Route path="/services/available" element={<AvailableServicesPage />} />
                <Route path="/services/requested" element={<RequestedServicesPage />}/>
                <Route path="/services/history" element={<PastServicesPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_RECEPTIONIST", "ROLE_MANAGER", "ROLE_ADMIN"]} />}>
              <Route path="/employee/schedule" element={<EmployeeSchedulePage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["ROLE_RECEPTIONIST", "ROLE_MANAGER", "ROLE_ADMIN"]} />}>
              <Route path="/add-reservation" element={<AddReservationPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]} />}>
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/new" element={<AddNewEmployeePage />} />
              <Route path="/employees/:username" element={<EmployeeDetailsPage />} />
              <Route path="/management/services" element={<ServicesListPage />} />
              <Route path="/management/statistics" element={<StatsPage />} />
            </Route>
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
  const pathIsPublic = isPublicPath(location.pathname);
  const [showLoader, setShowLoader] = useState(false);
  const [isInitialized, setIsInitialized] = useState(pathIsPublic);

  useEffect(() => {
      const timer = setTimeout(() => setShowLoader(true), 300);
      initializeUserFromLocalStorage(dispatch)
        .then(isSuccessful => {
          if (!isSuccessful && !pathIsPublic) navigate("/login");
        })
        .finally(() => {
          clearTimeout(timer);
          setIsInitialized(true)
        });
    }, [dispatch, navigate, pathIsPublic]
  );

  if (!isInitialized) return (showLoader ? <LoadingPage/> : null);

  return children;
}

export default App;
