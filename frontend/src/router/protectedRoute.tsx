import {useEffect, PropsWithChildren} from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/slices/userSlice.ts";

function ProtectedRoute({ children }: PropsWithChildren) {
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user === null) navigate("/login");
    }, [navigate, user]);

    if (!user) return null;

    return <>{children}</>;
}

export default ProtectedRoute;
