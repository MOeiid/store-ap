import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { ProductItem } from "../components/ProductItem";
import { useInfiniteCategoryProducts } from "../hooks/api";
import type { Product } from "../types/product";

const CHOSEN_CATEGORY = "smartphones";

export const CategoryProductsScreen = () => {
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCategoryProducts(CHOSEN_CATEGORY);

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) ?? [];
  }, [data]);

  const totalProducts = data?.pages[0]?.total ?? 0;

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductItem product={item} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <OfflineIndicator />
      <Text style={styles.title}>Smartphones</Text>
      <Text style={styles.subtitle}>{totalProducts} smartphones</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ? "Failed to load smartphones" : "No smartphones found"}
      </Text>
      {error && (
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading more smartphones...</Text>
        </View>
      );
    }

    if (isLoading && !isRefetching) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View>{renderHeader()}</View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={!products?.length ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});
