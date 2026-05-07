import * as React from 'react'
import {
  Card, CardContent, Typography, Stack, List, ListItem, ListItemText,
  Button, Pagination, Divider, Chip, CircularProgress
} from '@mui/material'
import SearchBar from '../components/SearchBar.jsx'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { searchNiches } from '../Services/Niches'
import { Link as RouterLink } from 'react-router-dom'


export default function SearchNiches(){
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  const PAGE_SIZE = 5 // <- cambia aquí el tamaño de página

  const onSubmit = async () => {
    const q = query.trim().toLowerCase()
    if (!q) return;
    
    setLoading(true);
    try {
      const response = await searchNiches(q);
      setResults(response);
      setPage(1); // reset a la primera página en cada búsqueda
    } catch (error) {
      console.error('Error al buscar nichos:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // datos de la página actual
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end   = start + PAGE_SIZE
  const pageData = results.slice(start, end)

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Consultar Nichos</Typography>
        <Button startIcon={<ArrowBackIcon/>} component={RouterLink} to="/dashboard" variant="outlined">
          Volver al Inicio
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <SearchBar value={query} onChange={setQuery} onSubmit={onSubmit} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6">Resultados de Búsqueda</Typography>
            {!!results.length && (
              <Chip label={`${results.length} resultado${results.length!==1?'s':''}`} />
            )}
          </Stack>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Stack alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Stack>
          ) : results.length === 0 ? (
            <Typography color="text.secondary">Sin resultados.</Typography>
          ) : (
            <>
              <List>
                {pageData.map(r => (
                  <ListItem
                    key={r.id}
                    secondaryAction={
                      <Button
                        component={RouterLink}
                        to={`/niches/${r.id}`}
                        variant="contained"
                        size="small"
                      >
                        Ver
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={r.occupants && r.occupants.length > 0 
                        ? r.occupants.map(o => o.name).join(', ') 
                        : 'Sin ocupantes'}
                      secondary={
                        <span>
                          <strong>Propietario:</strong> {r.owner}<br/>
                          <strong>Nicho:</strong> {r.number}&nbsp;&nbsp;
                          <strong>Última Anualidad:</strong>{' '}
                          {r.lastPaymentYear || 'N/A'}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Paginación */}
              <Stack alignItems="center" sx={{ mt: 2 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}
