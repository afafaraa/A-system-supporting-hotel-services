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

    useEffect(() => {
        if (!auth) navigate("/login");
    }, [auth, navigate]);

    if (!auth) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
