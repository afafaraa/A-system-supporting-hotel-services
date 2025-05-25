import {useEffect, PropsWithChildren} from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/slices/userSlice.ts";

interface ProtectedRouteProps extends PropsWithChildren {
    allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {

    const navigate = useNavigate();
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user === null) navigate("/login");
        else if (allowedRoles && !allowedRoles.includes(user.role)) {
            navigate("/home");
        }
    }, [navigate, user, allowedRoles]);

    if (!user) return null;
    if (allowedRoles && !allowedRoles.includes(user.role)) return null;

    return <>{children}</>;
}

export default ProtectedRoute;
