// src/pages/Dashboard.jsx

import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

import { getNiches, addNiche } from '../Services/Niches';

const INITIAL_NICHE_STATE = {
  number: '',
  type: '',
  address: '',
  description: '',
};

const INITIAL_STATS = [
  { label: 'Total Nichos', value: 0 },
  { label: 'Nichos Disponibles', value: 0 },
  { label: 'Próximos a Vencer', value: 0 },
  { label: 'Vencidos', value: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDifuntos, setSelectedDifuntos] = useState([]);
  const [rows, setRows] = useState([]);
  const [nichesData, setNichesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newNiche, setNewNiche] = useState(INITIAL_NICHE_STATE);
  const [stats, setStats] = useState(INITIAL_STATS);

  // ================= CARGAR DATOS =================

 const fetchNiches = useCallback(async () => {
  try {
    setLoading(true);
    const response = await getNiches();

    const niches = response.map((n) => ({
      id: n.id,
      number: n.number,
      address: n.address,
      description: n.description,
      type: n.type,
      status: n.status,
      nichesData: n.niches || [],
    }));

    const mappedRows = niches.flatMap((n) =>
      n.nichesData.map((niche) => ({
        id: niche.id,
        number: niche.number,
        propietario: niche.owner,
        ultima: niche.lastPaymentYear || currentYear.toString(),
        difuntos: niche.occupants || [],
        status: niche.status,
        isActive: niche.is_active,
      }))
    );

    const totalNichos = niches.length;
    const nichosDisponibles = niches.filter(
      (r) =>
        r.status === 'disponible' &&
        r.nichesData.length > 0 &&
        r.nichesData.every((n) => !n.isActive)
    ).length;
    const proximosVencer = mappedRows.filter((r) => {
      const diff = currentYear - Number(r.ultima);
      return diff === 1;
    }).length;
    const vencidos = mappedRows.filter((r) => {
      const diff = currentYear - Number(r.ultima);
      return diff > 1;
    }).length;

    // Set all state at once at the end
    setNichesData(niches);
    setRows(mappedRows);
    setStats([
      { label: 'Total Nichos', value: totalNichos },
      { label: 'Nichos Disponibles', value: nichosDisponibles },
      { label: 'Próximos a Vencer', value: proximosVencer },
      { label: 'Vencidos', value: vencidos },
    ]);
  } catch (error) {
    console.error('Error al obtener nichos:', error);
  } finally {
    setLoading(false);
  }
}, [currentYear]);

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  // ================= DIFUNTOS =================

  const handleOpenDialog = (difuntos) => {
    setSelectedDifuntos(difuntos);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDifuntos([]);
  };

  // ================= AGREGAR NICHO =================

  const handleOpenAddDialog = () => setOpenAddDialog(true);

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewNiche(INITIAL_NICHE_STATE);
  };

  const handleChangeNewNiche = (key) => (e) => {
    setNewNiche((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSaveNiche = async () => {
    try {
      await addNiche({
        ...newNiche,
        status: 'disponible',
        is_active: true,
      });
      handleCloseAddDialog();
      fetchNiches();
    } catch (error) {
      console.error('Error al guardar nicho:', error);
    }
  };

  // ================= ESTADO =================

  const getEstado = (ultima) => {
    const diff = currentYear - Number(ultima);
    if (diff <= 0) return 'ok';
    if (diff === 1) return 'warning';
    return 'danger';
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* ================= TARJETAS ================= */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ py: 3 }}>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}
                >
                  {s.value}
                </Typography>
                <Typography align="center" sx={{ color: 'text.secondary' }}>
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= BOTONES ================= */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => navigate('/niches/search')}
        >
          Consultar
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ borderWidth: 2 }}
          onClick={handleOpenAddDialog}
        >
          Agregar Nicho Vacío
        </Button>
        <Button
          variant="outlined"
          startIcon={<EventAvailableIcon />}
          sx={{
            borderWidth: 2,
            borderColor: '#22C55E',
            color: '#22C55E',
            '&:hover': {
              borderColor: '#16A34A',
              backgroundColor: 'rgba(34,197,94,0.06)',
            },
          }}
          onClick={() => navigate('/niches/available')}
        >
          Nichos Disponibles
        </Button>
      </Stack>

      {/* ================= TABLA ================= */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Typography sx={{ px: 3, pt: 2.5, pb: 2, fontWeight: 700 }}>
            Registros de Nichos
          </Typography>
          <Divider />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre del Propietario</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Última Anualidad Pagada</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => {
                    const estado = getEstado(r.ultima);
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.propietario}</TableCell>
                        <TableCell>{r.ultima}</TableCell>
                        <TableCell>
                          {estado === 'ok' && <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />}
                          {estado === 'warning' && <WarningAmberRoundedIcon sx={{ color: 'warning.main' }} />}
                          {estado === 'danger' && <ErrorRoundedIcon sx={{ color: 'error.main' }} />}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenDialog(r.difuntos)}
                            >
                              Ver Difuntos
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              sx={{ borderRadius: 999 }}
                              onClick={() => navigate(`/niches/${r.id}`)}
                            >
                              Actualizar
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* ================= DIALOG DIFUNTOS ================= */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Difuntos Registrados
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Apellidos</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Nacimiento</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Defunción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDifuntos.map((d, index) => (
                  <TableRow key={d.id || index}>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.lastName}</TableCell>
                    <TableCell>{d.birthDate}</TableCell>
                    <TableCell>{d.deathDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleCloseDialog}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= DIALOG AGREGAR NICHO ================= */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, px: 2, py: 1 } }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight={700}>
              Agregar Nicho Vacío
            </Typography>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleCloseAddDialog}>
              Volver
            </Button>
          </Stack>

          <Stack spacing={3}>
            <TextField
              label="Número de Nicho"
              fullWidth
              value={newNiche.number}
              onChange={handleChangeNewNiche('number')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, minHeight: 68 } }}
            />
            <TextField
              select
              label="Tipo"
              fullWidth
              value={newNiche.type}
              onChange={handleChangeNewNiche('type')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, minHeight: 68 } }}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Double">Doble</MenuItem>
            </TextField>
            <TextField
              label="Ubicación"
              fullWidth
              value={newNiche.address}
              onChange={handleChangeNewNiche('address')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, minHeight: 68 } }}
            />
            <TextField
              label="Descripción"
              multiline
              rows={4}
              fullWidth
              value={newNiche.description}
              onChange={handleChangeNewNiche('description')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
            <Button variant="outlined" onClick={handleCloseAddDialog} sx={{ borderWidth: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="success" onClick={handleSaveNiche}>
              Guardar
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

    </Box>
  );
}