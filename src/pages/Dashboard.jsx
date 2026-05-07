// src/pages/Dashboard.jsx
import *  as React from 'react';
import {
  Box, Stack, Typography, Card, CardContent, Grid, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper,
  CircularProgress
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CloseIcon from '@mui/icons-material/Close';

import { useNavigate } from 'react-router-dom';
import { getNiche } from '../Services/Niches';
import { useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDifuntos, setSelectedDifuntos] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState([
    { label: 'Total Nichos', value: 0 },
    { label: 'Nichos Disponibles', value: 0 },
    { label: 'Próximos a Vencer', value: 0 },
    { label: 'Vencidos', value: 0 },
  ]);

  // Función para obtener los nichos desde la API
  const fetchNiches = async () => {
    try {
      setLoading(true);
      const response = await getNiche();
      
      // Mapea la respuesta de la API al formato esperado por la tabla
      const mappedRows = response.map((niche) => ({
        id: niche.id,
        number: niche.number,
        propietario: niche.owner,
        ultima: niche.lastPaymentYear || new Date().getFullYear().toString(),
        difuntos: niche.occupants || [],
        status: niche.status,
        isActive: niche.is_active
      }));

      setRows(mappedRows);

      // Calcular estadísticas
      const añoActual = new Date().getFullYear();
      const totalNichos = mappedRows.length;
      const nichosDisponibles = mappedRows.filter(r => r.status === 'disponible' || !r.isActive).length;
      const proximosVencer = mappedRows.filter(r => {
        const diff = añoActual - Number(r.ultima);
        return diff === 1;
      }).length;
      const vencidos = mappedRows.filter(r => {
        const diff = añoActual - Number(r.ultima);
        return diff > 1;
      }).length;

      setStats([
        { label: 'Total Nichos', value: totalNichos },
        { label: 'Nichos Disponibles', value: nichosDisponibles },
        { label: 'Próximos a Vencer', value: proximosVencer },
        { label: 'Vencidos', value: vencidos },
      ]);

    } catch (error) {
      console.error('Error al obtener los nichos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiches();
  }, []);

  const handleOpenDialog = (difuntos) => {
    setSelectedDifuntos(difuntos);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDifuntos([]);
  };

  // 🔥 Calcula el estado automáticamente
  const getEstado = (ultima) => {
    const añoActual = new Date().getFullYear();
    const diff = añoActual - Number(ultima);

    if (diff <= 0) return 'ok';       // Verde
    if (diff === 1) return 'warning'; // Amarillo
    return 'danger';                  // Rojo
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Tarjetas de métricas */}
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

      {/* Botones de acción */}
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
          onClick={() => navigate('/niches/add')}
        >
          Agregar
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

      {/* Tabla */}
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
                  <TableCell sx={{ fontWeight: 700 }}>
                    Nombre del Propietario
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Última Anualidad Pagada
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((r, idx) => {
                  const estado = getEstado(r.ultima);

                  return (
                    <TableRow key={idx} hover>
                      
                      <TableCell>{r.propietario}</TableCell>
                      <TableCell>{r.ultima}</TableCell>

                      <TableCell>
                        {estado === 'ok' && (
                          <CheckCircleRoundedIcon
                            sx={{
                              color: 'success.main',
                              verticalAlign: 'middle',
                            }}
                          />
                        )}

                        {estado === 'warning' && (
                          <WarningAmberRoundedIcon
                            sx={{
                              color: 'warning.main',
                              verticalAlign: 'middle',
                            }}
                          />
                        )}

                        {estado === 'danger' && (
                          <ErrorRoundedIcon
                            sx={{
                              color: 'error.main',
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            color="primary"
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

      {/* Dialog para ver datos del difunto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Difuntos Registrados
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Apellidos</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha de Nacimiento</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha de Defunción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDifuntos.map((difunto, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{difunto.name}</TableCell>
                    <TableCell>{difunto.lastName}</TableCell>
                    <TableCell>{difunto.fechaNacimiento ? new Date(difunto.fechaNacimiento).toLocaleDateString() : ""}</TableCell>
                    <TableCell>{difunto.fechaDefuncion ? new Date(difunto.fechaDefuncion).toLocaleDateString() : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}