import axiosInstance from './AxiosInstance';

class ApiService {
  static async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  }

  static async getById <T>(url: string, id: number): Promise<T> {
    const response = await axiosInstance.get<T>(`${url}/${id}`);
    return response.data;
  }

  static async post<T>(url: string, data: any): Promise<T> {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  }

  static async put<T>(url: string, data: any): Promise<T> {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }

  static async patch<T>(url: string, id: string, data: any): Promise<T> {
    const response = await axiosInstance.patch<T>(`${url}/${id}`, data);
    return response.data;
  }
}

export default ApiService;
