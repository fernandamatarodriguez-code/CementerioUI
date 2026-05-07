// src/pages/AddNiche.jsx
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
import { useNavigate } from "react-router-dom";
import { addNiche } from "../Services/Niches";
import { insertOccupant } from "../Services/NicheOccupantsService";
import { insertPayment, createPaymentFromFile } from "../Services/Payments";

export default function AddNiche() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    numero: "",
    anualidad: "",
    cedula: "",
    propietario: "",
    telefono: "",
    direccion: "",
    email: "",
    descripcion: "",
  });

  const [file, setFile] = React.useState(null);
  const [fileError, setFileError] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  /* ========================= DIFUNTOS ========================= */

  const [openDifunto, setOpenDifunto] = React.useState(false);
  const [difunto, setDifunto] = React.useState({
    nombre: "",
    apellidos: "",
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
      nombre: "",
      apellidos: "",
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
        number: form.numero,
        owner: form.propietario,
        type: "Individual",
        identification: form.cedula,
        phone: form.telefono,
        address: form.direccion,
        email: form.email,
        description: form.descripcion,
        status: "ocupado",
        is_active: true,
      };

      const createdNiche = await addNiche(nicheData);

      // 2. Agregar difuntos al nicho
      for (const difunto of difuntos) {
        await insertOccupant({
          nicheId: createdNiche.id,
          name: difunto.nombre,
          lastName: difunto.apellidos,
          birthDate: difunto.fechaNacimiento,
          deathDate: difunto.fechaDefuncion,
        });
      }

      // 3. Cargar el documento de pago
      const paymentData = await createPaymentFromFile(file, createdNiche.id);
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
              Agregar Nicho
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
                <TextField label="Número de Nicho" fullWidth value={form.numero} onChange={onChange("numero")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Año de Última Anualidad Pagada"
                  type="number"
                  fullWidth
                  value={form.anualidad}
                  onChange={onChange("anualidad")}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Cédula del Propietario" fullWidth value={form.cedula} onChange={onChange("cedula")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Nombre del Propietario" fullWidth value={form.propietario} onChange={onChange("propietario")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Teléfono" fullWidth value={form.telefono} onChange={onChange("telefono")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Dirección" fullWidth value={form.direccion} onChange={onChange("direccion")} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Correo Electrónico" type="email" fullWidth value={form.email} onChange={onChange("email")} />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Descripción" multiline rows={3} fullWidth value={form.descripcion} onChange={onChange("descripcion")} />
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
                        <TableCell>{d.nombre}</TableCell>
                        <TableCell>{d.apellidos}</TableCell>
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
            <TextField label="Nombre" fullWidth onChange={handleDifuntoChange("nombre")} />
            <TextField label="Apellidos" fullWidth onChange={handleDifuntoChange("apellidos")} />
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