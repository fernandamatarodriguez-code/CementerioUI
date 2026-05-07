import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { LoginDto } from "../Models/LoginDto";
import type { IToken } from "../Interfaces/IToken";
import type { UserDto, UpdateUserDto } from "../Models/UserDto";

/**
 * Inicia sesión con credenciales de usuario
 * @param user - Credenciales de login
 * @returns Token de autenticación
 */
export const loginUser = async (user: LoginDto): Promise<IToken> => {
  return await ApiService.post<IToken>(endpoints.auth.login, user);
};

/**
 * Obtiene la información del usuario logueado
 * @returns Datos del usuario
 */
export const getUserInfo = async (): Promise<UserDto> => {
  return await ApiService.get<UserDto>(endpoints.users.userInfo);
};

/**
 * Actualiza los datos de un usuario
 * @param id - ID del usuario
 * @param userData - Datos a actualizar
 * @returns Usuario actualizado
 */
export const updateUser = async (id: number, userData: UpdateUserDto): Promise<UserDto> => {
  return await ApiService.patch<UserDto>(endpoints.users.updateUser, id.toString(), userData);
};
