import { useState } from 'react';
import {
  Card, CardContent, Typography, Stack, TextField, Button, Box,
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Services/UserService';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({ username: e.target[0].value, password: e.target[2].value });
      await signIn(result);
    } catch (err) {
      toast.error("Credenciales inválidas o error de conexión.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ maxWidth: 560, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h4" sx={{ color: 'secondary.main' }} align="center">
                Iniciar Sesión
              </Typography>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack spacing={2.5}>
                <TextField label="Correo Electrónico" fullWidth />

            
                <TextField 
                  label="Contraseña" 
                  type={showPassword ? 'text' : 'password'} 
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />



                

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="neutral"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Olvido Contraseña
                  </Button>

                  <Button type="submit" variant="contained" color="success">
                    Iniciar Sesión
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
