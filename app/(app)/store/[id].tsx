// app/(app)/store/[id].tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Local, Producto } from '@/types';

// Leemos la URL base desde el archivo .env
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [local, setLocal] = useState<Local | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
        // Usamos la variable API_BASE_URL para construir la ruta correcta
        fetch(`${API_BASE_URL}/api/locales/${id}/`)
            .then(res => {
                if (!res.ok) { 
                    throw new Error('La respuesta del servidor no fue exitosa');
                }
                return res.json();
            })
            .then((data: Local) => {
                setLocal(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar el local:", err); 
                setIsLoading(false);
            });
    }
  }, [id]);

  if (isLoading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }
  if (!local) {
    return <View style={[styles.container, styles.center]}><Text style={styles.errorText}>No se pudo cargar el local.</Text></View>;
  }
  
  const renderProduct = ({ item }: { item: Producto }) => (
    <View style={styles.productCard}>
      <View style={styles.productTextContainer}>
        <Text style={styles.productTitle}>{item.nombre}</Text>
        <Text style={styles.productDescription}>{item.descripcion}</Text>
        <Text style={styles.productPrice}>${item.precio}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      
      <FlatList
        data={local.productos}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <Image style={styles.bannerImage} source={{ uri: 'https://via.placeholder.com/400x150.png/1C1C1E/FFFFFF?text=Oeste+Delivery' }} />
            <View style={styles.headerContainer}>
              <Image style={styles.logo} source={{ uri: local.logo || undefined }} />
              <Text style={styles.title}>{local.nombre}</Text>
            </View>
            <Text style={styles.menuTitle}>Menú</Text>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  backButton: { position: 'absolute', top: 50, left: 15, zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { color: 'white', fontSize: 28, lineHeight: 30 },
  bannerImage: { width: '100%', height: 150 },
  headerContainer: { padding: 15, alignItems: 'center', marginTop: -50 },
  logo: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#121212', backgroundColor: '#000' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10 },
  menuTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 15, marginBottom: 10, marginTop: 10 },
  productCard: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 10, alignItems: 'center' },
  productTextContainer: { flex: 1, marginRight: 10 },
  productTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  productDescription: { color: '#A9A9A9', fontSize: 14, marginVertical: 4 },
  productPrice: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFA500', justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});