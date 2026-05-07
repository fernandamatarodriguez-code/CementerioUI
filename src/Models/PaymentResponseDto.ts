export interface PaymentResponseDto {
  id: number;
  nicheId: number;
  documentName: string;
  documentType: string;
  documentSize: number;
  documentMimeType: string;
  documentBase64?: string;
  year: number;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentListResponseDto {
  data: PaymentResponseDto[];
  total: number;
}
