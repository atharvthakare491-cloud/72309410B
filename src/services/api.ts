import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '@/logger/logger';
import { API_BASE_URL } from '@/constants';

interface ApiErrorResponse {
  message?: string;
  status?: number;
}

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params as Record<string, unknown> | undefined,
          data: config.data as Record<string, unknown> | undefined
        }, 'ApiClient');
        return config;
      },
      (error: Error) => {
        logger.error('API Request Error', error, 'ApiClient');
        return Promise.reject(error);
      }
    );
    
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`, {
          status: response.status,
          dataLength: JSON.stringify(response.data).length
        }, 'ApiClient');
        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        logger.error('API Response Error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message
        }, 'ApiClient');
        return Promise.reject(error);
      }
    );
  }
  
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();