import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDeleteProduct } from "../hooks/api";
import { useAppSelector } from "../hooks/redux";
import type { Product } from "../types/product";
import { StorageKeys, storageUtils } from "../utils/storage";
import { ConfirmationModal } from "./ConfirmationModal";

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { user } = useAppSelector((state) => state.auth);
  const deleteProductMutation = useDeleteProduct();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isSuperAdmin = () => {
    const superAdminUsername = storageUtils.getItem(
      StorageKeys.SUPERADMIN_USERNAME
    );
    return user?.username === superAdminUsername;
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(product.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.category}>{product.category}</Text>
          {product.rating && (
            <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
          )}
        </View>
        {isSuperAdmin() && (
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="delete" size={20} color="#FF3B30" />
            )}
          </TouchableOpacity>
        )}
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  rating: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
