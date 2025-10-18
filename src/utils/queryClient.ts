import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QUERY_KEYS = {
  PRODUCTS: ["products"],
  PRODUCT: (id: number) => ["product", id],
  CATEGORIES: ["categories"],
  CATEGORY_PRODUCTS: (category: string) => ["category-products", category],
  USER: ["user"],
} as const;
