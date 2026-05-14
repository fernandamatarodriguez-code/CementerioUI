import type { NicheOccupantDto } from "./NicheOccupantDto";
import type { PaymentResponseDto } from "./PaymentResponseDto";

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
  payments?: PaymentResponseDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NicheListResponseDto {
  data: NicheResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NichesMainResponseDto {
  id: number;
  number: string;
  type: string;
  address: string;
  description: string;
  status: string; 
  niches?: NicheResponseDto[];
}
