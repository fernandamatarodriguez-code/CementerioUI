export interface NicheOccupantDto {
  id: number;
  nicheId: number;
  name: string;
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNicheOccupantDto {
  nicheId: number;
  name: string;
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
}

export interface UpdateNicheOccupantDto {
  id: number;
  name?: string;
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
}
