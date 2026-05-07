import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { LoginDto } from "../Models/LoginDto";
import type { IToken } from "../Interfaces/IToken";
import type { SendPasswordDto, SendPasswordResponseDto } from "../Models/UserDto";

/**
 * Inicia sesión con credenciales de usuario
 * @param credentials - Credenciales de login (username y password)
 * @returns Token de autenticación
 */
export const login = async (credentials: LoginDto): Promise<IToken> => {
  return await ApiService.post<IToken>(endpoints.auth.login, credentials);
};

/**
 * Envía una contraseña temporal al correo del usuario
 * @param data - Datos con el email del usuario
 * @returns Respuesta indicando si se envió correctamente
 */
export const sendPassword = async (data: SendPasswordDto): Promise<SendPasswordResponseDto> => {
  return await ApiService.post<SendPasswordResponseDto>(endpoints.auth.password, data);
};

