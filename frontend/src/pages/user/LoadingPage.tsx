import {Box, CircularProgress, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function LoadingPage() {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="background.default">
      <CircularProgress />
      <Typography variant="h6" mt="1rem" color="text.primary">
        {t("pages.loading.wait")}
      </Typography>
      <Typography variant="body2" mt="0.5rem" color="text.secondary">
        {t("pages.loading.preparing")}
      </Typography>
    </Box>
  )
}

export default LoadingPage;
