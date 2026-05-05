import ApiService from "../Api/ApiService";
import endpoints from "../Api/Endpoints";
import type { PaymentDto} from "../Models/PaymentDto";

export const insertPayment = async <T>(payment: PaymentDto): Promise<T> => {
  return await ApiService.post<T>(endpoints.payments.addPayment, payment);
};

export const getPayment = async <T>(payment: PaymentDto): Promise<T> => {
  return await ApiService.get<T>(endpoints.payments.getPayments, payment);
};

export const updatePayment = async <T>(payment: PaymentDto): Promise<T> => {
  return await ApiService.patch<T>(endpoints.payments.updatePayment, payment.nicheId.toString(), payment);
};