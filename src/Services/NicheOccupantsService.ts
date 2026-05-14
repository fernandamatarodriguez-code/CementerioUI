import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { 
  CreateNicheOccupantDto, 
  NicheOccupantDto, 
  UpdateNicheOccupantDto 
} from "../Models/NicheOccupantDto";

/**
 * Obtiene todos los ocupantes de nichos
 * @returns Lista de ocupantes
 */
export const getAllOccupants = async (): Promise<NicheOccupantDto[]> => {
  return await ApiService.get<NicheOccupantDto[]>(endpoints.nicheOccupants.getOccupant);
};

/**
 * Obtiene un ocupante por su ID
 * @param id - ID del ocupante
 * @returns Datos del ocupante
 */
export const getOccupantById = async (id: number): Promise<NicheOccupantDto> => {
  return await ApiService.getById<NicheOccupantDto>(endpoints.nicheOccupants.getOccupant, id);
};

/**
 * Obtiene los ocupantes de un nicho específico
 * @param nicheId - ID del nicho
 * @returns Lista de ocupantes del nicho
 */
export const getOccupantsByNicheId = async (nicheId: number): Promise<NicheOccupantDto[]> => {
  return await ApiService.get<NicheOccupantDto[]>(endpoints.nicheOccupants.getOccupant, { nicheId });
};

/**
 * Crea un nuevo ocupante de nicho
 * @param occupant - Datos del nuevo ocupante
 * @returns Ocupante creado
 */
export const insertOccupant = async (occupant: CreateNicheOccupantDto): Promise<NicheOccupantDto> => {
  return await ApiService.post<NicheOccupantDto>(endpoints.nicheOccupants.insertOccupant, occupant);
};

/**
 * Actualiza un ocupante existente
 * @param id - ID del ocupante
 * @param occupant - Datos a actualizar
 * @returns Ocupante actualizado
 */
export const updateOccupant = async (id: number, occupant: UpdateNicheOccupantDto): Promise<NicheOccupantDto> => {
  return await ApiService.patch<NicheOccupantDto>(endpoints.nicheOccupants.updateOccupant, id.toString(), occupant);
};

/**
 * Elimina un ocupante
 * @param id - ID del ocupante a eliminar
 */
export const deleteOccupant = async (id: number): Promise<void> => {
  return await ApiService.delete<void>(endpoints.nicheOccupants.deleteOccupant, id);
};
