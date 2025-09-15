import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/slices/userSlice.ts";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useSelector(selectUser);
  if (user === null)
    return <Navigate to="/login" replace />;
  else if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/home" replace />;
  else
    return <Outlet />;
}

export default ProtectedRoute;
