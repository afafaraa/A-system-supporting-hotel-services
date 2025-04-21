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
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (auth === false) {
            navigate("/login");
        } else if (auth !== null) {
            setChecked(true);
        }
    }, [auth, navigate]);

    if (auth === null || !checked) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
