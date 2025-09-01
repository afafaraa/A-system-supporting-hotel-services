import {Box, Card} from "@mui/material";
import NotificationsContainer from "../../components/layout/NotificationsContainer.tsx";
import {Link as RouterLink} from "react-router";
import Link from "@mui/material/Link";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {navigateToDashboard} from "../../utils/utils.ts";
import {useNavigate} from "react-router-dom";

function HomePage() {
  const user = useSelector(selectUser);
  const navigation = useNavigate();

  if (!user) return null;
  if (user.role === "ROLE_GUEST") navigateToDashboard(user.role, navigation);

  return (
    <Box display="flex" gap={3}>

      <Box flex={1}>
        <Card sx={{p: 3}} variant="outlined">
          Przeniesione do  <Link component={RouterLink} to="/profile">/profile</Link>
        </Card>
      </Box>

      <Box display={{ xs: "none", lg: "block" }} width="30%" sx={{overflowY: "auto"}}>
        <NotificationsContainer />
      </Box>

    </Box>
  )
}

export default HomePage;
