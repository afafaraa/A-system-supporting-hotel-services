import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import useAuthenticateOnFrontend from "../components/auth/auth.tsx";

type ProtectedRouteProps = {
    children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = useAuthenticateOnFrontend();
    const navigate = useNavigate();
    // todo use redux
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!auth) navigate("/login");
        else setChecked(true);
    }, [auth, navigate]);

    if (!auth || !checked) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
