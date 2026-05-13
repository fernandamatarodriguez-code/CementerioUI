import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { NichesDto } from "../Models/NichesDto";
import type { NicheResponseDto, NicheListResponseDto } from "../Models/NicheResponseDto";

// ============== NICHES ==============

/**
 * Agrega un nuevo nicho vacío
 * @param niche - Datos del nicho a crear
 * @returns Nicho creado
 */
export const addNiche = async (niche: NichesDto): Promise<NicheResponseDto> => {
  return await ApiService.post<NicheResponseDto>(endpoints.niche.addNiche, niche);
};

/**
 * Asigna un nicho reservado
 * @param niche - Datos del nicho a crear
 * @returns Nicho creado
 */
export const allocateNiche = async (niche: NichesDto): Promise<NicheResponseDto> => {
  return await ApiService.post<NicheResponseDto>(endpoints.niche.allocateNiche, niche);
};

/**
 * Obtiene todos los nichos
 * @param params - Parámetros opcionales de filtrado
 * @returns Lista de nichos
 */
export const getNiche = async (params?: Record<string, any>): Promise<NicheResponseDto[]> => {
  return await ApiService.get<NicheResponseDto[]>(endpoints.niche.getNiches, params);
};

/**
 * Obtiene nichos paginados
 * @param page - Número de página
 * @param pageSize - Tamaño de página
 * @param filters - Filtros opcionales
 * @returns Respuesta paginada de nichos
 */
export const getNichesPaginated = async (
  page: number = 1, 
  pageSize: number = 10, 
  filters?: Record<string, any>
): Promise<NicheListResponseDto> => {
  return await ApiService.get<NicheListResponseDto>(endpoints.niche.getNiches, {
    page,
    pageSize,
    ...filters
  });
};

/**
 * Obtiene los nichos disponibles
 * @returns Lista de nichos disponibles
 */
export const getAvailableNiches = async (): Promise<NicheResponseDto[]> => {
  return await ApiService.get<NicheResponseDto[]>(endpoints.niche.getNiches, { status: 'disponible' });
};

/**
 * Busca nichos por criterio
 * @param query - Término de búsqueda
 * @returns Lista de nichos que coinciden
 */
export const searchNiches = async (query: string): Promise<NicheResponseDto[]> => {
  return await ApiService.get<NicheResponseDto[]>(endpoints.niche.getNiches, { search: query });
};

/**
 * Obtiene un nicho por su ID
 * @param id - ID del nicho
 * @returns Datos del nicho
 */
export const getNicheById = async (id: number): Promise<NicheResponseDto> => {
  return await ApiService.getById<NicheResponseDto>(endpoints.niche.getNicheById, id);
};

/**
 * Actualiza un nicho existente
 * @param id - ID del nicho
 * @param niche - Datos a actualizar
 * @returns Nicho actualizado
 */
export const updateNiche = async (id: number, niche: Partial<NichesDto>): Promise<NicheResponseDto> => {
  return await ApiService.patch<NicheResponseDto>(endpoints.niche.updateNiche, id.toString(), niche);
};

/**
 * Elimina un nicho (soft delete - marca como inactivo)
 * @param id - ID del nicho
 * @returns Nicho desactivado
 */
export const deleteNiche = async (id: number): Promise<NicheResponseDto> => {
  return await ApiService.patch<NicheResponseDto>(endpoints.niche.updateNiche, id.toString(), { is_active: false });
};

/**
 * Reactiva un nicho previamente desactivado
 * @param id - ID del nicho
 * @returns Nicho reactivado
 */
export const reactivateNiche = async (id: number): Promise<NicheResponseDto> => {
  return await ApiService.patch<NicheResponseDto>(endpoints.niche.updateNiche, id.toString(), { is_active: true });
};
