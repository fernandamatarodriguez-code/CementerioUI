import ApiService from "../Api/ApiService";
import axiosInstance from "../Api/AxiosInstance";
import endpoints from "../Api/Endpoints";
import type { PaymentDto } from "../Models/PaymentDto";
import type { PaymentResponseDto, PaymentListResponseDto } from "../Models/PaymentResponseDto";

/**
 * Crea un nuevo pago/anualidad
 * @param payment - Datos del pago incluyendo documento
 * @returns Pago creado
 */
export const insertPayment = async (payment: PaymentDto): Promise<PaymentResponseDto> => {
  return await ApiService.post<PaymentResponseDto>(endpoints.payments.addPayment, payment);
};

/**
 * Obtiene todos los pagos
 * @param filters - Filtros opcionales
 * @returns Lista de pagos
 */
export const getPayments = async (filters?: Record<string, any>): Promise<PaymentResponseDto[]> => {
  return await ApiService.get<PaymentResponseDto[]>(endpoints.payments.getPayments, filters);
};

/**
 * Obtiene los pagos de un nicho específico
 * @param nicheId - ID del nicho
 * @returns Lista de pagos del nicho
 */
export const getPaymentsByNicheId = async (nicheId: number): Promise<PaymentResponseDto[]> => {
  return await ApiService.get<PaymentResponseDto[]>(endpoints.payments.getPayments, { nicheId });
};

/**
 * Obtiene un pago por su ID
 * @param id - ID del pago
 * @param includeDocument - Si se debe incluir el documento en base64
 * @returns Datos del pago
 */
export const getPaymentById = async (id: number, includeDocument: boolean = true): Promise<PaymentResponseDto> => {
  // El backend no tiene endpoint individual, usar lista con filtro
  const payments = await ApiService.get<PaymentResponseDto[]>(endpoints.payments.getPayments, 
    includeDocument ? { id, includeDocument: true } : { id }
  );
  if (payments && payments.length > 0) {
    return payments[0];
  }
  throw new Error('Pago no encontrado');
};

/**
 * Obtiene el documento de un pago directamente
 * @param id - ID del pago
 * @returns Blob del documento
 */
export const getPaymentDocument = async (id: number): Promise<Blob> => {
  const url = endpoints.payments.getDocument.replace('{id}', id.toString());
  const response = await axiosInstance.get(url, { responseType: 'blob' });
  return response.data;
};

/**
 * Actualiza un pago existente
 * @param id - ID del pago
 * @param payment - Datos a actualizar
 * @returns Pago actualizado
 */
export const updatePayment = async (id: number, payment: Partial<PaymentDto>): Promise<PaymentResponseDto> => {
  return await ApiService.patch<PaymentResponseDto>(endpoints.payments.updatePayment, id.toString(), payment);
};

/**
 * Elimina un pago
 * @param id - ID del pago a eliminar
 */
export const deletePayment = async (id: number): Promise<void> => {
  return await ApiService.delete<void>(`${endpoints.payments.getPayments}/${id}`);
};

/**
 * Obtiene el historial de pagos paginado
 * @param page - Número de página
 * @param pageSize - Tamaño de página
 * @param filters - Filtros opcionales
 * @returns Respuesta paginada de pagos
 */
export const getPaymentHistory = async (
  page: number = 1, 
  pageSize: number = 10, 
  filters?: Record<string, any>
): Promise<PaymentListResponseDto> => {
  return await ApiService.get<PaymentListResponseDto>(endpoints.payments.getPayments, {
    page,
    pageSize,
    ...filters
  });
};

/**
 * Convierte un archivo a Base64 para enviarlo como pago
 * @param file - Archivo a convertir
 * @returns Promise con el string en Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remover el prefijo "data:...;base64,"
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Crea un PaymentDto a partir de un archivo
 * @param file - Archivo del documento
 * @param nicheId - ID del nicho asociado
 * @returns PaymentDto listo para enviar
 */
export const createPaymentFromFile = async (file: File, nicheId: number, documentType: 'compra' | 'anualidad'): Promise<PaymentDto> => {
  const base64 = await fileToBase64(file);
  
  return {
    nicheId,
    documentName: file.name,
    documentType: documentType,
    documentSize: file.size,
    documentMimeType: file.type,
    documentBase64: base64
  };
};