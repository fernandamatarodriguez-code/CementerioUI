import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { sendPassword } from "../Services/AuthService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;

    if (!email || !email.includes("@")) {
      toast.error("Ingrese un correo válido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await sendPassword({ email });
      setEmailSent(true);
    } catch (err) {
      setError(err.message || "Error al enviar la contraseña. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Typography
              variant="h4"
              align="center"
              sx={{ color: "secondary.main" }}
            >
              Recuperar Contraseña
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              Ingrese su correo electrónico para enviar una contraseña.
            </Typography>

            {emailSent && (
              toast.error('Se envió una contraseña al correo.')
            )}

            {error && toast.error('Se envió una contraseña al correo.')}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField label="Correo Electrónico" fullWidth disabled={loading} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                  >
                    Volver
                  </Button>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}