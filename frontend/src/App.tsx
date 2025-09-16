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
import NotificationsPage from "./pages/guest/NotificationsPage.tsx";
import {PropsWithChildren, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {initializeUserFromLocalStorage} from "./components/auth/auth.tsx";
import OrderServicePage from "./pages/guest/order-service/OrderServicePage.tsx";
import LoadingPage from "./pages/user/LoadingPage.tsx";
import EmployeeDetailsPage from "./pages/manager/EmployeeDetailsPage.tsx";
import ServicesListPage from "./pages/manager/ServicesListPage.tsx";
import StatsPage from "./pages/manager/StatsPage.tsx";
import AddNewEmployeePage from './pages/manager/forms/AddNewEmployeePage.tsx';
import EmployeeLayout from "./components/layout/EmployeeLayout.tsx";
import EmployeeCalendarPage from "./pages/employee/EmployeeCalendarPage.tsx";
import TodaySchedulesPage from "./pages/employee/TodaySchedulesPage.tsx";
import RequestedSchedulesPage from "./pages/employee/RequestedSchedulesPage.tsx";
import EmployeeReservationsPage from "./pages/employee/ReservationsPage.tsx";
import EmployeeReviewsPage from "./pages/employee/ReviewsPage.tsx";
import FallbackPage from "./pages/user/FallbackPage.tsx";
import GuestLayout from "./pages/guest/layout/GuestLayout.tsx";

function App(){
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["ROLE_GUEST"]}/>}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/service-schedule/:id" element={<OrderServicePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/guest" element={<GuestLayout />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_RECEPTIONIST", "ROLE_MANAGER", "ROLE_ADMIN"]} />}>
              <Route element={<EmployeeLayout />}>
                <Route path="/employee/today-schedules" element={<TodaySchedulesPage />} />
                <Route path="/employee/requested-schedules" element={<RequestedSchedulesPage />} />
                <Route path="/employee/calendar" element={<EmployeeCalendarPage />} />
                <Route path="/employee/reservations" element={<EmployeeReservationsPage />} />
                <Route path="/employee/reviews" element={<EmployeeReviewsPage />} />
              </Route>
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

          <Route element={<PublicLayout navbar={true}/>}>
            <Route path="/home" element={<HomePage />} />
          </Route>
          <Route element={<PublicLayout navbar={false}/>}>
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password-email" element={<SendResetPasswordEmail />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/fallback" element={<FallbackPage />} />
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
          if (!isSuccessful && !pathIsPublic) navigate("/home");
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
