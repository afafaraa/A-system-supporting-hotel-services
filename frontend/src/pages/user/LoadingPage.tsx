import {CircularProgress, Typography} from "@mui/material";

function LoadingPage() {

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <CircularProgress />
      <Typography variant="h6" style={{ marginTop: "1rem", textAlign: "center" }}>
        Proszę czekać,
      </Typography>
      <Typography variant="body2" style={{ marginTop: "0.5rem", textAlign: "center" }}>
        trwa przygotowanie sesji użytkownika
      </Typography>
    </div>
  )
}

export default LoadingPage;
