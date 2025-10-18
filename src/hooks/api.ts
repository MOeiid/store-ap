import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { loginFailure, loginStart, loginSuccess } from "../store/authSlice";
import type { LoginCredentials } from "../types/auth";
import { QUERY_KEYS } from "../utils/queryClient";
import { useAppDispatch, useAppSelector } from "./redux";

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message));
    },
  });
};

export const useMe = () => {
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => apiClient.me(),
    enabled: !!accessToken && isAuthenticated,
    retry: false,
  });
};

export const useProducts = (limit = 30, skip = 0) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, limit, skip],
    queryFn: () => apiClient.getProducts(limit, skip),
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteProducts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "infinite", limit],
    queryFn: ({ pageParam = 0 }) => apiClient.getProducts(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => apiClient.getCategories(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useCategoryProducts = (category: string, limit = 30, skip = 0) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORY_PRODUCTS(category), limit, skip],
    queryFn: () => apiClient.getProductsByCategory(category, limit, skip),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteCategoryProducts = (category: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.CATEGORY_PRODUCTS(category), "infinite", limit],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.getProductsByCategory(category, limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.PRODUCTS },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                products: page.products.filter((p: any) => p.id !== deletedId),
                total: page.total - 1,
              })),
            };
          }

          if (oldData.products) {
            return {
              ...oldData,
              products: oldData.products.filter((p: any) => p.id !== deletedId),
              total: oldData.total - 1,
            };
          }

          return oldData;
        }
      );

      queryClient.setQueriesData(
        { predicate: (query) => query.queryKey[0] === "category-products" },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                products: page.products.filter((p: any) => p.id !== deletedId),
                total: page.total - 1,
              })),
            };
          }

          if (oldData.products) {
            return {
              ...oldData,
              products: oldData.products.filter((p: any) => p.id !== deletedId),
              total: oldData.total - 1,
            };
          }

          return oldData;
        }
      );
    },
  });
};
