import {useEffect} from "react";
import { logout } from "../redux/slices/userSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login");
  }, []);

  return (
    <div>
      Logout Page
    </div>
  )
}

export default LogoutPage;