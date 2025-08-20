import {Box, CircularProgress, Typography} from "@mui/material";

function LoadingPage() {

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="background.default">
      <CircularProgress />
      <Typography variant="h6" mt="1rem" color="text.primary">
        Proszę czekać,
      </Typography>
      <Typography variant="body2" mt="0.5rem" color="text.secondary">
        trwa przygotowanie sesji użytkownika
      </Typography>
    </Box>
  )
}

export default LoadingPage;
