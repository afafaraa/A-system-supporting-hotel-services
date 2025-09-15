import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/slices/userSlice.ts";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {

    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const navigateBasedOnUserRole = () => {
        if (user) {
            if (user.role === 'ROLE_GUEST') {
                navigate('/guest');
            } else if (user.role === 'EMPLOYEE') {

            } else {
                navigate('/home')
            }
        }
    }

    useEffect(() => {
        if (user === null) navigate("/login");
        else if (allowedRoles && !allowedRoles.includes(user.role)) {
            navigateBasedOnUserRole();
        }
    }, [navigate, user, allowedRoles]);

    if (!user) return null;
    if (allowedRoles && !allowedRoles.includes(user.role)) return null;

    return <Outlet />;
}

export default ProtectedRoute;
