import * as React from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { mockNiches } from "../data.js";

export default function NicheDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const niche = mockNiches.find((n) => n.id === id) || mockNiches[0];

  /* ================= DIFUNTOS ================= */

  const [openDifunto, setOpenDifunto] = React.useState(false);

  const [difunto, setDifunto] = React.useState({
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    fechaDefuncion: "",
  });

  const [difuntos, setDifuntos] = React.useState(() => {
    if (Array.isArray(niche.deceased)) {
      return niche.deceased.map((d) => ({
        nombre: d,
        apellidos: "",
        fechaNacimiento: "",
        fechaDefuncion: "",
      }));
    }
    return niche.deceased
      ? [{ nombre: niche.deceased, apellidos: "", fechaNacimiento: "", fechaDefuncion: "" }]
      : [];
  });

  const handleDifuntoChange = (key) => (e) =>
    setDifunto((prev) => ({ ...prev, [key]: e.target.value }));

  const guardarDifunto = () => {
    setDifuntos((prev) => [...prev, difunto]);
    setDifunto({
      nombre: "",
      apellidos: "",
      fechaNacimiento: "",
      fechaDefuncion: "",
    });
    setOpenDifunto(false);
  };

  /* ================= ANUALIDADES ================= */

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [fileError, setFileError] = React.useState("");
  const [annualidades, setAnnualidades] = React.useState([
    {
      year: niche.lastPaymentYear || new Date(niche.lastPayment).getFullYear(),
      name: "boleta_compra.pdf",
      url: "",
      type: "application/pdf",
      date: new Date(niche.lastPayment || Date.now()).toLocaleDateString(),
      tipoBoleta: "Compra",
    },
  ]);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [openViewer, setOpenViewer] = React.useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newEntry = {
      year: new Date().getFullYear(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      date: new Date().toLocaleDateString(),
      tipoBoleta: "Anualidad",
    };

    setAnnualidades((prev) => [newEntry, ...prev]);
    setOpenSnackbar(true);
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
      <Card sx={{ maxWidth: 950, width: "100%", borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={5}>

            {/* HEADER */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4" fontWeight={600}>
                Detalle del Nicho
              </Typography>

              <Button
                startIcon={<ArrowBackIcon />}
                component={RouterLink}
                to="/"
                variant="outlined"
              >
                Volver
              </Button>
            </Stack>

            {/* ================= DATOS ================= */}
            <Box>
              <Typography variant="h6" mb={2}>
                Datos del Nicho
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField label="Número de Nicho" defaultValue={niche.number} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Año Última Anualidad"
                    defaultValue={niche.lastPaymentYear || new Date(niche.lastPayment).getFullYear()}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Cédula Propietario" defaultValue={niche.ownerId} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Nombre Propietario" defaultValue={niche.owner} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Teléfono" defaultValue={niche.phone} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Dirección" defaultValue={niche.address} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Correo" defaultValue={niche.email} fullWidth />
                </Grid>

                <Grid item xs={12}>
                  <TextField label="Descripción" defaultValue={niche.notes} multiline minRows={3} fullWidth />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* ================= DIFUNTOS ================= */}
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Difuntos</Typography>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDifunto(true)}
                >
                  Agregar otros difuntos
                </Button>
              </Stack>

              {difuntos.length > 0 && (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Nombre</b></TableCell>
                        <TableCell><b>Apellidos</b></TableCell>
                        <TableCell><b>Fecha Nacimiento</b></TableCell>
                        <TableCell><b>Fecha Defunción</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {difuntos.map((d, i) => (
                        <TableRow key={i}>
                          <TableCell>{d.nombre}</TableCell>
                          <TableCell>{d.apellidos}</TableCell>
                          <TableCell>{d.fechaNacimiento}</TableCell>
                          <TableCell>{d.fechaDefuncion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            <Divider />

            {/* ================= ANUALIDADES ================= */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Documentos
                </Typography>

                <Button variant="contained" component="label" startIcon={<AddIcon />}>
                  Cargar Anualidad
                  <input hidden type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                </Button>
              </Stack>

              {fileError && <Typography color="error">{fileError}</Typography>}

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Año</b></TableCell>
                      <TableCell><b>Tipo</b></TableCell>
                      <TableCell><b>Archivo</b></TableCell>
                      <TableCell><b>Fecha de Carga</b></TableCell>
                      <TableCell><b>Acciones</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {annualidades.map((a, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{a.year}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: a.tipoBoleta === "Compra" ? "secondary.main" : "primary.main",
                              fontWeight: 500,
                            }}
                          >
                            {a.tipoBoleta}
                          </Typography>
                        </TableCell>
                        <TableCell>{a.name}</TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={!a.url}
                            onClick={() => {
                              setSelectedFile(a);
                              setOpenViewer(true);
                            }}
                          >
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Divider />

            {/* ================= ACCIONES ================= */}
            <Stack direction="row" justifyContent="space-between">
              <Button
                color="error"
                variant="outlined"
                onClick={() => setOpenDelete(true)}
              >
                Eliminar
              </Button>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => navigate("/")}>
                  Cancelar
                </Button>

                <Button color="success" variant="contained" onClick={() => navigate("/")}>
                  Actualizar
                </Button>
              </Stack>
            </Stack>

          </Stack>
        </CardContent>

        {/* DIALOG DIFUNTO */}
        <Dialog open={openDifunto} onClose={() => setOpenDifunto(false)} fullWidth>
          <DialogTitle>Agregar Difunto</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Nombre" onChange={handleDifuntoChange("nombre")} />
              <TextField label="Apellidos" onChange={handleDifuntoChange("apellidos")} />
              <TextField type="date" label="Fecha Nacimiento" InputLabelProps={{ shrink: true }} onChange={handleDifuntoChange("fechaNacimiento")} />
              <TextField type="date" label="Fecha Defunción" InputLabelProps={{ shrink: true }} onChange={handleDifuntoChange("fechaDefuncion")} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDifunto(false)}>Cancelar</Button>
            <Button variant="contained" onClick={guardarDifunto}>Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* VISOR */}
        <Dialog open={openViewer} onClose={() => setOpenViewer(false)} maxWidth="md" fullWidth>
          <DialogTitle>Visualizar Boleta - {selectedFile?.tipoBoleta}</DialogTitle>
          <DialogContent>
            {selectedFile?.type === "application/pdf"
              ? <iframe src={selectedFile?.url} width="100%" height="500px" title="PDF" />
              : <img src={selectedFile?.url} alt="Boleta" style={{ width: "100%" }} />}
          </DialogContent>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success">Boleta cargada correctamente</Alert>
        </Snackbar>

        <ConfirmDialog
          open={openDelete}
          title="Eliminar Nicho"
          message="¿Está seguro de eliminar este nicho?"
          onCancel={() => setOpenDelete(false)}
          onConfirm={() => navigate("/")}
        />
      </Card>
    </Box>
  );
}