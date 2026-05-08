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
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { getNicheById, updateNiche, deleteNiche } from "../Services/Niches";
import { insertOccupant } from "../Services/NicheOccupantsService";
import { getPaymentsByNicheId, insertPayment, createPaymentFromFile } from "../Services/Payments";

export default function NicheDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [niche, setNiche] = React.useState(null);

  /* ================= FORM STATE ================= */
  const [form, setForm] = React.useState({
    number: "",
    lastPaymentYear: "",
    identification: "",
    owner: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  });

  /* ================= DIFUNTOS ================= */

  const [openDifunto, setOpenDifunto] = React.useState(false);

  const [difunto, setDifunto] = React.useState({
    name: "",
    lastName: "",
    fechaNacimiento: "",
    fechaDefuncion: "",
  });

  const [difuntos, setDifuntos] = React.useState([]);

  /* ================= ANUALIDADES ================= */

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [fileError, setFileError] = React.useState("");
  const [annualidades, setAnnualidades] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [openViewer, setOpenViewer] = React.useState(false);

  /* ================= LOAD DATA ================= */

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nicheData = await getNicheById(Number(id));
        setNiche(nicheData);
        
        // Actualizar formulario con datos del nicho
        setForm({
          number: nicheData.number || "",
          lastPaymentYear: nicheData.lastPaymentYear || new Date().getFullYear().toString(),
          identification: nicheData.identification || "",
          owner: nicheData.owner || "",
          phone: nicheData.phone || "",
          address: nicheData.address || "",
          email: nicheData.email || "",
          notes: nicheData.description || "",
        });

        // Cargar ocupantes
        if (nicheData.occupants && nicheData.occupants.length > 0) {
          setDifuntos(nicheData.occupants.map(o => ({
            id: o.id,
            name: o.name || "",
            lastName: o.lastName || "",
            fechaNacimiento: o.fechaNacimiento || "",
            fechaDefuncion: o.fechaDefuncion || "",
          })));
        }

        // Cargar pagos
        const payments = await getPaymentsByNicheId(Number(id));
        if (payments && payments.length > 0) {
          setAnnualidades(payments.map(p => ({
            id: p.id,
            paidAt: new Date(p.paidAt).getFullYear(),
            lastPayment: new Date(p.paidAt),
            name: p.documentName,
            url: p.documentBase64 ? `data:${p.documentMimeType};base64,${p.documentBase64}` : "",
            type: p.documentMimeType,
            date: new Date(p.paidAt).toLocaleDateString(),
            documentType: p.documentType === "anualidad" ? "Anualidad" : "Compra",
          })));
        }
      } catch (err) {
        setError("Error al cargar los datos del nicho");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFormChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleDifuntoChange = (key) => (e) =>
    setDifunto((prev) => ({ ...prev, [key]: e.target.value }));

  const guardarDifunto = async () => {
    try {
      // Guardar difunto en la API
      await insertOccupant({
        nicheId: Number(id),
        name: difunto.name,
        lastName: difunto.lastName,
        fechaNacimiento: difunto.fechaNacimiento,
        fechaDefuncion: difunto.fechaDefuncion,
      });
      
      setDifuntos((prev) => [...prev, difunto]);
      setDifunto({
        name: "",
        lastName: "",
        fechaNacimiento: "",
        fechaDefuncion: "",
      });
      setOpenDifunto(false);
    } catch (err) {
      setError("Error al guardar el difunto");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Crear y guardar el pago
      const paymentData = await createPaymentFromFile(file, Number(id), 'anualidad');
      await insertPayment(paymentData);

      const newEntry = {
        year: new Date().getFullYear(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        date: new Date().toLocaleDateString(),
        documentType: "Anualidad",
      };

      setAnnualidades((prev) => [newEntry, ...prev]);
      setOpenSnackbar(true);
    } catch (err) {
      setFileError("Error al cargar el archivo");
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateNiche(Number(id), {
        number: form.number,
        owner: form.owner,
        identification: form.identification,
        phone: form.phone,
        address: form.address,
        email: form.email,
        description: form.notes,
        type: niche?.type || "Individual",
        status: niche?.status || "ocupado",
        is_active: true,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Error al actualizar el nicho");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNiche(Number(id));
      navigate("/");
    } catch (err) {
      setError("Error al eliminar el nicho");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                to="/dashboard"
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

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Número de Nicho" 
                    value={form.number} 
                    onChange={handleFormChange("number")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Año Última Anualidad"
                    value={form.lastPaymentYear}
                    onChange={handleFormChange("lastPaymentYear")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Cédula Propietario" 
                    value={form.identification} 
                    onChange={handleFormChange("identification")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Nombre Propietario" 
                    value={form.owner} 
                    onChange={handleFormChange("owner")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Teléfono" 
                    value={form.phone} 
                    onChange={handleFormChange("phone")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Dirección" 
                    value={form.address} 
                    onChange={handleFormChange("address")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Correo" 
                    value={form.email} 
                    onChange={handleFormChange("email")}
                    fullWidth 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    label="Descripción" 
                    value={form.notes} 
                    onChange={handleFormChange("notes")}
                    multiline 
                    minRows={3} 
                    fullWidth 
                  />
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
                          <TableCell>{d.name}</TableCell>
                          <TableCell>{d.lastName}</TableCell>
                          <TableCell>{d.fechaNacimiento ? new Date(d.fechaNacimiento).toLocaleDateString() : ""}</TableCell>
                          <TableCell>{d.fechaDefuncion ? new Date(d.fechaDefuncion).toLocaleDateString() : ""}</TableCell>
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
                        <TableCell>{a.paidAt}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: a.documentType === "Compra" ? "secondary.main" : "primary.main",
                              fontWeight: 500,
                            }}
                          >
                            {a.documentType}
                          </Typography>
                        </TableCell>
                        <TableCell>{a.name}</TableCell>
                        <TableCell>{a.lastPayment.toLocaleDateString()}</TableCell>
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
                disabled={saving}
              >
                Eliminar
              </Button>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => navigate("/dashboard")} disabled={saving}>
                  Cancelar
                </Button>

                <Button 
                  color="success" 
                  variant="contained" 
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : "Actualizar"}
                </Button>
              </Stack>
            </Stack>

          </Stack>
        </CardContent>

        {/* CONFIRM DELETE DIALOG */}
        <ConfirmDialog
          open={openDelete}
          title="Eliminar Nicho"
          message="¿Está seguro que desea eliminar este nicho? Esta acción no se puede deshacer."
          onCancel={() => setOpenDelete(false)}
          onConfirm={handleDelete}
        />

        {/* DIALOG DIFUNTO */}
        <Dialog open={openDifunto} onClose={() => setOpenDifunto(false)} fullWidth>
          <DialogTitle>Agregar Difunto</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Nombre" onChange={handleDifuntoChange("name")} />
              <TextField label="Apellidos" onChange={handleDifuntoChange("lastName")} />
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