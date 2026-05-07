import type { NicheOccupantDto } from "./NicheOccupantDto";

export interface NicheResponseDto {
  id: number;
  number: string;
  owner: string;
  type: string;
  identification: string;
  phone: string;
  address: string;
  email: string;
  description: string;
  status: string;
  is_active: boolean;
  lastPaymentYear?: string;
  occupants?: NicheOccupantDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NicheListResponseDto {
  data: NicheResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
