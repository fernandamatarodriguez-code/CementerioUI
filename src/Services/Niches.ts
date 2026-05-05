import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { NichesDto } from "../Models/NichesDto";

export const insertOccupant = async <T>(niche: NichesDto): Promise<T> => {
  return await ApiService.post<T>(endpoints.nicheOccupants.insertOccupant, niche);
};
export const getOccupant = async <T>(): Promise<T> => {
  return await ApiService.get<T>(endpoints.nicheOccupants.getOccupant);
};
export const updateOccupant = async <T>(niche: NichesDto): Promise<T> => {
  return await ApiService.patch<T>(endpoints.nicheOccupants.updateOccupant, niche.number, niche);
};

export const addNiche = async <T>(niche: NichesDto): Promise<T> => {
  return await ApiService.post<T>(endpoints.niche.addNiche, niche);
};
export const getNiche = async <T>(): Promise<T> => {
  return await ApiService.get<T>(endpoints.niche.getNiches);
};

export const getNicheById = async <T>(id: number): Promise<T> => {
  return await ApiService.getById<T>(endpoints.niche.getNicheById, id);
};

export const updateNiche = async <T>(id: string, niche: NichesDto): Promise<T> => {
  return await ApiService.patch<T>(endpoints.niche.updateNiche, id, niche);
};
