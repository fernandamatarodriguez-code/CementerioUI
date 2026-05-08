export interface NicheOccupantDto {
  id: number;
  nicheId: number;
  name: string;
  lastName?: string;
  fechaNacimiento?: string;
  fechaDefuncion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNicheOccupantDto {
  nicheId: number;
  name: string;
  lastName?: string;
  fechaNacimiento?: string;
  fechaDefuncion?: string;
}

export interface UpdateNicheOccupantDto {
  id: number;
  name?: string;
  lastName?: string;
  fechaNacimiento?: string;
  fechaDefuncion?: string;
}
