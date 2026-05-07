export interface UserDto {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface UpdateUserDto {
  id: number;
  username?: string;
  email?: string;
  name?: string;
  password?: string;
}

export interface SendPasswordDto {
  email: string;
}

export interface SendPasswordResponseDto {
  message: string;
  success: boolean;
}
