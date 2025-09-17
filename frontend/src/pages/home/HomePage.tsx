import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import dashboardDestination from "../../utils/dashboardDestination.ts";
import {Navigate} from "react-router-dom";

function HomePage() {
  const role = useSelector(selectUser)?.role ?? "";
  return <Navigate to={dashboardDestination(role)} replace />
}

export default HomePage;
