import { useEffect, useState } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axiosApi from "../../../middleware/axiosApi";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

const VerifyAccount = () => {
  const {t: tc} = useTranslationWithPrefix('pages.account-verification');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("missingToken");
      return;
    }

    const verify = async () => {
      try {
        const res = await axiosApi.get(`/open/verify/account?token=${token}`);

        if (res.status === 200) {
          setStatus("success");
          setMessage("success");
        } else {
          setStatus("error");
          setMessage("invalidOrExpired");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("error");
      }
    };

    verify();
  }, [token]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          boxShadow: (theme) => `0px 0px 20px 2px ${theme.palette.primary.medium}`,
          border: (theme) => `2px solid ${theme.palette.primary.medium}`,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <CardContent>
          {status === "loading" && (
            <>
              <CircularProgress size={48} />
              <Typography mt={3} variant="h6">
                {tc(message)}
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
              <Typography mt={2} variant="h5" color="success.main" fontWeight="medium">
                {tc("successTitle")}
              </Typography>
              <Typography mt={1} color="text.secondary">
                {tc(message)}
              </Typography>
              <Button
                sx={{ mt: 3 }}
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                fullWidth
              >
                {tc("goToLogin")}
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
              <Typography mt={2} variant="h5" color="error.main" fontWeight="medium">
                {tc("failureTitle")}
              </Typography>
              <Typography mt={1} color="text.secondary">
                {tc(message)}
              </Typography>
              <Button
                sx={{ mt: 3 }}
                variant="outlined"
                color="error"
                onClick={() => navigate("/home")}
                fullWidth
              >
                {tc("returnHome")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyAccount;
