import {Box, Card} from "@mui/material";
import NotificationsContainer from "../../components/layout/NotificationsContainer.tsx";

function HomePage() {

  return (
    <Box display="flex" gap={3}>

      <Box flex={1}>
        <Card sx={{p: 3}} variant="outlined">
          Przeniesione do /profile
        </Card>
      </Box>

      <Box display={{ xs: "none", lg: "block" }} width="30%" sx={{overflowY: "auto"}}>
        <NotificationsContainer />
      </Box>

    </Box>
  )
}

export default HomePage;
