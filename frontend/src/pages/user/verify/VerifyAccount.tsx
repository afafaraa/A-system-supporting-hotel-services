import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your account...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth/verify/account?token=${token}`
        );

        const text = await res.text();

        if (res.ok) {
          setStatus("success");
          setMessage(text || "Email verified successfully! You can now log in.");
        } else {
          setStatus("error");
          setMessage(text || "Invalid or expired verification link.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Something went wrong while verifying your account.");
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
        bgcolor: "#f4f6f8",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <CardContent>
          {status === "loading" && (
            <>
              <CircularProgress size={48} />
              <Typography mt={3} variant="h6">
                Verifying your account...
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
              <Typography mt={2} variant="h5" color="success.main">
                Verification successful
              </Typography>
              <Typography mt={1} color="text.secondary">
                {message}
              </Typography>
              <Button
                sx={{ mt: 3 }}
                variant="contained"
                color="primary"
                href="/login"
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
              <Typography mt={2} variant="h5" color="error.main">
                Verification failed
              </Typography>
              <Typography mt={1} color="text.secondary">
                {message}
              </Typography>
              <Button
                sx={{ mt: 3 }}
                variant="outlined"
                color="error"
                href="/"
              >
                Return Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyAccount;
