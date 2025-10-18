import type { LoginCredentials, LoginResponse, User } from "../types/auth";
import type { DeleteProductResponse, ProductsResponse } from "../types/product";
import { StorageKeys, storageUtils } from "../utils/storage";

const API_BASE_URL = "https://dummyjson.com";

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = storageUtils.getItem(StorageKeys.ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async me(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async getProducts(limit = 30, skip = 0): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>("/products/categories");
  }

  async getProductsByCategory(
    category: string,
    limit = 12,
    skip = 0
  ): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    );
  }

  async deleteProduct(id: number): Promise<DeleteProductResponse> {
    return this.request<DeleteProductResponse>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
