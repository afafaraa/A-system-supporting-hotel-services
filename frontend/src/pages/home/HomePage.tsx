import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {useNavigate} from "react-router-dom";
import {navigateToDashboard} from "../../utils/utils.ts";

function HomePage() {
  const user = useSelector(selectUser);
  const navigation = useNavigate();
  navigateToDashboard(user?.role ?? "", navigation);
  return null;
}

export default HomePage;
