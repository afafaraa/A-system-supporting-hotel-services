import useAuthenticateOnFrontend from "../components/auth/auth.tsx";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({children}){
    const auth = useAuthenticateOnFrontend();
    const navigate = useNavigate();

    if (auth === null) {
        return <div>Loading...</div>;
    }

    return auth ? children : navigate('/login')
}

export default ProtectedRoute;