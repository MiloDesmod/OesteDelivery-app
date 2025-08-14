// app/(app)/cart.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartItem } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CartScreen() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { authState } = useAuth();
  const cartTotal = items.reduce((total: number, item: CartItem) => total + item.quantity * item.precio, 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert("Carrito Vacío", "No puedes realizar un pedido sin productos.");
      return;
    }

    const orderData = {
      direccion_entrega: "Av. de Mayo 1234, Ramos Mejía",
      items: items.map(item => ({
        producto: item.id,
        cantidad: item.quantity,
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/ordenes/crear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authState.token}`,
        },
        body: JSON.stringify(orderData),
      });

      // --- LÓGICA CORREGIDA ---
      // Si la respuesta es exitosa (ok), vaciamos el carrito y
      // navegamos a la pantalla de confirmación. ¡Nada más!
      if (response.ok) {
        clearCart();
        router.push('/(app)/confirmation');
      } else {
        const errorData = await response.json();
        Alert.alert("Error al Crear Pedido", `${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor. Revisa la consola.");
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemQuantity}>{item.quantity}x</Text>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <Text style={styles.itemPrice}>${(item.quantity * item.precio).toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Carrito</Text>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<Text style={styles.listHeader}>Resumen del Pedido</Text>}
        ListEmptyComponent={<Text style={styles.emptyCartText}>Tu carrito está vacío</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${cartTotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#A9A9A9', marginLeft: 20, marginTop: 10, marginBottom: 10 },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#333333' },
  itemQuantity: { color: '#FFA500', fontSize: 16, fontWeight: 'bold' },
  itemName: { color: '#FFFFFF', fontSize: 16, flex: 1, marginHorizontal: 10 },
  itemPrice: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyCartText: { color: '#A9A9A9', textAlign: 'center', marginTop: 50, fontSize: 16 },
  footer: { borderTopWidth: 1, borderTopColor: '#333333', padding: 20 },
  totalText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  checkoutButton: { backgroundColor: '#00C853', padding: 15, borderRadius: 8, alignItems: 'center' },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});