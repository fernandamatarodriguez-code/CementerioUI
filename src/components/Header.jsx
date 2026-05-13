import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Header({ user = "Usuario", onLogout }) {
  /* ================= STATES ================= */

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPassword, setOpenPassword] = React.useState(false);

  const [passwords, setPasswords] = React.useState({
    nueva: "",
    confirmar: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePasswordChange = (key) => (e) =>
    setPasswords((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSavePassword = () => {
    if (passwords.nueva !== passwords.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Nueva contraseña:", passwords.nueva);

    setPasswords({ nueva: "", confirmar: "" });
    setShowPassword(false);
    setShowConfirm(false);
    setOpenPassword(false);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <AppBar position="sticky" elevation={1} color="secondary">
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>

          {/* IZQUIERDA */}
          <Stack direction="row" spacing={1.2} alignItems="center">
            <AccountBalanceIcon />

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1.2rem" }}
            >
              Sistema de Gestión de Nichos
            </Typography>
          </Stack>

          {/* DERECHA */}
          <Stack direction="row" spacing={1.5} alignItems="center">

            {/* USUARIO MENU */}
            <Button
              color="inherit"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleOpenMenu}
              sx={{
                textTransform: "none",
                fontSize: "0.95rem",
                px: 1,
                minWidth: "auto",
              }}
            >
              <Typography component="span" sx={{ fontWeight: 400 }}>
                Bienvenido,&nbsp;
              </Typography>

              <Typography component="span" sx={{ fontWeight: 700 }}>
                {user}
              </Typography>
            </Button>

          </Stack>
        </Toolbar>
      </AppBar>

      {/* ================= MENU USUARIO ================= */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 220,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setOpenPassword(true);
          }}
          sx={{ gap: 1.5 }}
        >
          <LockResetIcon fontSize="small" />
          Cambiar contraseña
        </MenuItem>

        <MenuItem onClick={onLogout} 
        sx={{ gap: 1.5 }}>
          <LogoutIcon fontSize="small" />
          Cerrar sesión
        </MenuItem>
      </Menu>
      {/* ================= DIALOG PASSWORD ================= */}
      <Dialog
        open={openPassword}
        onClose={() => setOpenPassword(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Cambiar Contraseña
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>

            <TextField
              label="Nueva contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={passwords.nueva}
              onChange={handlePasswordChange("nueva")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              fullWidth
              value={passwords.confirmar}
              onChange={handlePasswordChange("confirmar")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined"onClick={() => setOpenPassword(false)} sx={{ borderWidth: 2 }}>
            Cancelar
          </Button>

          <Button variant="contained" color="success" onClick={handleSavePassword}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}