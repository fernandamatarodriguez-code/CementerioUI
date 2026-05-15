// src/pages/AllocateNiche.jsx
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import { allocateNiche } from "../Services/Niches";
import { insertOccupant } from "../Services/NicheOccupantsService";
import { insertPayment, createPaymentFromFile } from "../Services/Payments";

export default function AllocateNiche() {
  const navigate = useNavigate();
  const location = useLocation();
  const nicheFromState = location.state?.niche;
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    id: null,
    nicheMainId: nicheFromState.id,
    number: nicheFromState.number,
    lastPayment: "",
    identification: "",
    owner: "",
    phone: "",
    address: "",
    email: "",
    description: "",
  });

  const [file, setFile] = React.useState(null);
  const [fileError, setFileError] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  /* ========================= DIFUNTOS ========================= */

  const [openDifunto, setOpenDifunto] = React.useState(false);
  const [difunto, setDifunto] = React.useState({
    name: "",
    lastName: "",
    fechaNacimiento: "",
    fechaDefuncion: "",
  });
  const [difuntos, setDifuntos] = React.useState([]);

  const handleDifuntoChange = (key) => (e) =>
    setDifunto((prev) => ({ ...prev, [key]: e.target.value }));

  const guardarDifunto = () => {
    setDifuntos((prev) => [...prev, difunto]);
    setOpenDifunto(false);
    setDifunto({
      name: "",
      lastName: "",
      fechaNacimiento: "",
      fechaDefuncion: "",
    });
  };

  /* ========================= GENERAL ========================= */

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setOpenSnackbar(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setFileError("Debe cargar la boleta");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear el nicho
      const nicheData = {
        nicheMainId: form.nicheMainId,
        number: form.number,
        owner: form.owner,
        type: "Individual",
        identification: form.identification,
        phone: form.phone,
        address: form.address,
        email: form.email,
        description: form.description,
        status: "ocupado",
        is_active: true,
      };

      const createdNiche = await allocateNiche(nicheData);

      // 2. Agregar difuntos al nicho
      for (const difunto of difuntos) {
        await insertOccupant({
          nicheId: createdNiche.id,
          name: difunto.name,
          lastName: difunto.lastName,
          fechaNacimiento: difunto.fechaNacimiento,
          fechaDefuncion: difunto.fechaDefuncion,
        });
      }

      // 3. Cargar el documento de pago
      const paymentData = await createPaymentFromFile(file, createdNiche.id, 'compra');
      await insertPayment(paymentData);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al guardar el nicho. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6f8",
        minHeight: "100vh",
        p: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 950, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>

          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between" mb={4}>
            <Typography variant="h4" fontWeight={600}>
              Asignar Nicho
            </Typography>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Volver
            </Button>
          </Stack>

          <form onSubmit={onSubmit}>

            {/* ================= DATOS DEL NICHO ================= */}
            <Typography variant="h6" mb={2}>
              Datos del Nicho
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Número de Nicho" fullWidth value={form.number} onChange={onChange("number")}
                InputProps={{
                      readOnly: true,
                      }}
                  />
                
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Año de Última Anualidad Pagada"
                  type="number"
                  fullWidth
                  value={form.lastPayment}
                  onChange={onChange("lastPayment")}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Cédula del Propietario" fullWidth value={form.identification} onChange={onChange("identification")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Nombre del Propietario" fullWidth value={form.owner} onChange={onChange("owner")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Teléfono" fullWidth value={form.phone} onChange={onChange("phone")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Dirección" fullWidth value={form.address} onChange={onChange("address")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Correo Electrónico" type="email" fullWidth value={form.email} onChange={onChange("email")} />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Descripción" multiline rows={3} fullWidth value={form.description} onChange={onChange("description")} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 5 }} />

            {/* ================= DIFUNTOS ================= */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Difuntos</Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenDifunto(true)}
              >
                Agregar
              </Button>
            </Stack>

            {difuntos.length > 0 && (
              <Paper sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Nombre</b></TableCell>
                      <TableCell><b>Apellidos</b></TableCell>
                      <TableCell><b>Fecha Nacimiento</b></TableCell>
                      <TableCell><b>Fecha Defunción</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {difuntos.map((d, index) => (
                      <TableRow key={index}>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.lastName}</TableCell>
                        <TableCell>{d.fechaNacimiento}</TableCell>
                        <TableCell>{d.fechaDefuncion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}

            <Divider sx={{ my: 5 }} />

            {/* ================= DOCUMENTOS ================= */}
            <Typography variant="h6" mb={2}>
              Documentos
            </Typography>

            <Button variant="contained" component="label">
              Cargar Boleta
              <input hidden type="file" onChange={handleFileChange} />
            </Button>

            {file && (
              <Alert sx={{ mt: 2 }} severity="info">
                {file.name}
              </Alert>
            )}

            {fileError && (
              <Typography color="error" mt={1}>
                {fileError}
              </Typography>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ my: 5 }} />

            {/* ================= ACCIONES ================= */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button 
                type="submit" 
                variant="contained" 
                color="success"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
              </Button>
            </Stack>

          </form>
        </CardContent>
      </Card>

      {/* ================= DIALOG DIFUNTO ================= */}
      <Dialog open={openDifunto} onClose={() => setOpenDifunto(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar Difunto</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" fullWidth onChange={handleDifuntoChange("name")} />
            <TextField label="Apellidos" fullWidth onChange={handleDifuntoChange("lastName")} />
            <TextField type="date" label="Fecha Nacimiento" InputLabelProps={{ shrink: true }} onChange={handleDifuntoChange("fechaNacimiento")} />
            <TextField type="date" label="Fecha Defunción" InputLabelProps={{ shrink: true }} onChange={handleDifuntoChange("fechaDefuncion")} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDifunto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarDifunto}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Archivo cargado</Alert>
      </Snackbar>
    </Box>
  );
}