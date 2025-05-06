import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../../components/auth/auth.tsx";

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser(dispatch);
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div>
      Logout Page
    </div>
  )
}

export default LogoutPage;