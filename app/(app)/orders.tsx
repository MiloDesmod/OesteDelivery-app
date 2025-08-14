// app/(app)/orders.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Orden } from '@/types'; // Vamos a agregar la definición de Orden a nuestros tipos

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/ordenes/historial/`;

export default function OrdersScreen() {
  const { authState } = useAuth();
  const [orders, setOrders] = useState<Orden[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authState.token) return;

      setIsLoading(true);
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue exitosa');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [authState.token]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FFA500" /></View>;
  }

  const renderOrder = ({ item }: { item: Orden }) => (
    <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>
            <Text style={styles.orderTotal}>${item.total}</Text>
        </View>
        <Text style={styles.orderDate}>{new Date(item.fecha_creacion).toLocaleDateString()}</Text>
        <Text style={styles.orderLocal}>{item.local.nombre}</Text>
        <Text style={[styles.orderStatus, { backgroundColor: getStatusColor(item.estado) }]}>{item.estado}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
        <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>Todavía no has realizado ningún pedido.</Text>}
            contentContainerStyle={{ paddingTop: 10 }}
        />
    </SafeAreaView>
  );
}

// Función de ayuda para darle color al estado
const getStatusColor = (status: string) => {
    if (status === 'ENTREGADO') return '#28a745';
    if (status === 'EN_CAMINO') return '#17a2b8';
    if (status === 'CANCELADO') return '#dc3545';
    return '#6c757d'; // RECIBIDO, EN_PREPARACION
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    emptyText: { color: '#A9A9A9', textAlign: 'center', marginTop: 50, fontSize: 16 },
    orderCard: { backgroundColor: '#1C1C1E', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 10 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    orderId: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    orderTotal: { color: '#FFA500', fontSize: 18, fontWeight: 'bold' },
    orderDate: { color: '#A9A9A9', fontSize: 12, marginBottom: 5 },
    orderLocal: { color: '#FFFFFF', fontSize: 14, marginBottom: 10 },
    orderStatus: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10, alignSelf: 'flex-start', overflow: 'hidden' },
});
