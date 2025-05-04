import {useEffect} from "react";
import { clearUser } from "../../redux/slices/userSlice.ts";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div>
      Logout Page
    </div>
  )
}

export default LogoutPage;