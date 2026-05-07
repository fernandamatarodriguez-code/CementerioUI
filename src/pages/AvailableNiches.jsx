// src/pages/AvailableNiches.jsx
import * as React from 'react';
import {
  Box, Stack, Typography, Card, CardContent, Grid, Button, MenuItem, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, Chip, ToggleButtonGroup, ToggleButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { getAvailableNiches, updateNiche } from '../Services/Niches';

// ---------- DIALOGO: Detalles ----------
function NicheDetailsDialog({ open, onClose, data, onConfirm }) {
  if (!data) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Detalles del Nicho {data.number}
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Typography><strong>Número:</strong> {data.number}</Typography>
          <Typography>
            <strong>Tipo:</strong>{' '}
            <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: .5 }} />
            {data.type}
          </Typography>
          <Typography><strong>Estado:</strong> {data.status}</Typography>
          <Typography><strong>Dirección:</strong> {data.address}</Typography>
          <Typography><strong>Descripción:</strong> {data.description}</Typography>
          <Typography align="center" sx={{ mt:8}}>
            ¿Desea reservar este nicho?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="secondary" onClick={() => onConfirm?.(data)}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ---------- DIALOGO: Reserva exitosa ----------
function ReserveResultDialog({ open, onClose, nicheId, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Nicho Reservado
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography align="center" sx={{ color: 'text.secondary' }}>
          El nicho <strong>{nicheId}</strong> ha sido reservado exitosamente. Proceda con
          el proceso de venta.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="secondary" onClick={onConfirm}>
          Confirmar
          
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AvailableNiches() {
  const navigate = useNavigate();

  // Estado de datos
  const [available, setAvailable] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // filtros
  const [tipo, setTipo] = React.useState('');
  const [view, setView] = React.useState('list');

  // diálogos
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const [reserveOpen, setReserveOpen] = React.useState(false);
  const [reservedId, setReservedId] = React.useState('');

  // Cargar nichos disponibles
  React.useEffect(() => {
    const fetchAvailableNiches = async () => {
      try {
        setLoading(true);
        const response = await getAvailableNiches();
        setAvailable(response);
      } catch (error) {
        console.error('Error al cargar nichos disponibles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableNiches();
  }, []);

  const filtered = available.filter(n =>
    (tipo ? n.type === tipo : true)
  );

  const handleView = (_e, v) => { if (v) setView(v); };

  // Ver detalles
  const onVer = (row) => { setSelected(row); setDetailsOpen(true); };
  const onCloseDetails = () => setDetailsOpen(false);

  // Confirmar desde el diálogo de detalles -> reservar nicho
  const onConfirmDetails = async (row) => {
    try {
      await updateNiche(row.id, { status: 'reservado' });
      setDetailsOpen(false);
      setReservedId(row.number);
      setReserveOpen(true);
      // Actualizar lista de disponibles
      setAvailable(prev => prev.filter(n => n.id !== row.id));
    } catch (error) {
      console.error('Error al reservar nicho:', error);
    }
  };

  // Click en botón "Reservar" de la tabla
  const onReservar = async (row) => {
    try {
      await updateNiche(row.id, { status: 'reservado' });
      setReservedId(row.number);
      setReserveOpen(true);
      // Actualizar lista de disponibles
      setAvailable(prev => prev.filter(n => n.id !== row.id));
    } catch (error) {
      console.error('Error al reservar nicho:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Título + volver */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Nichos Disponibles para Venta
        </Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}>
          Volver al Inicio
        </Button>
      </Stack>

      {/* Filtros + Toggle de vista */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Tipo de Nicho" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Familiar">Familiar</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" sx={{ height: 56, bgcolor: 'primary.dark' }}>
                Filtrar
              </Button>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <ToggleButtonGroup size="small" color="primary" exclusive value={view} onChange={handleView}>
                <ToggleButton value="grid">Vista Grid</ToggleButton>
                <ToggleButton value="list">Vista Lista</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Nichos Disponibles ({filtered.length})
          </Typography>
          <Divider />

          {loading ? (
            <Stack alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Stack>
          ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              
            </TableHead>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id} hover>
                  <TableCell>{n.number}</TableCell>
                  <TableCell>
                    <Chip icon={<PersonIcon />} label={n.type || 'Individual'} variant="outlined" />
                  </TableCell>
                  <TableCell>{n.owner || 'N/A'}</TableCell>
                  <TableCell>{n.address || 'N/A'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5}>
                      <Button variant="contained" startIcon={<VisibilityIcon />} onClick={() => onVer(n)}>
                        Ver
                      </Button>
                      <Button variant="outlined" onClick={() => onReservar(n)}>
                        Reservar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <NicheDetailsDialog
        open={detailsOpen}
        onClose={onCloseDetails}
        data={selected}
        onConfirm={onConfirmDetails}
      />

      <ReserveResultDialog
        open={reserveOpen}
        nicheId={reservedId}
        onClose={() => setReserveOpen(false)}
        onConfirm={() => {
          setReserveOpen(false);
        }}
      />
    </Box>
  );
}
