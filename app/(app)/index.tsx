// app/(app)/index.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, SafeAreaView, TouchableOpacity, View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Link, Href } from 'expo-router';
import StoreCard from '@/components/StoreCard';
import { useCart } from '@/context/CartContext';
import { Local } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons'; // Asegúrate de que esta importación esté

const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

export default function HomeScreen() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const fetchLocales = useCallback(async () => {
    setIsLoading(true);
    const url = `${API_BASE_URL}/locales/?search=${searchTerm}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLocales(data);
    } catch (error) {
      console.error('Hubo un error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchLocales();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocales();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchLocales]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar locales por nombre..."
          placeholderTextColor="#A9A9A9"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FFA500" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={locales}
          renderItem={({ item }) => (
            <Link href={`/store/${item.id}` as Href<string>} asChild>
              <TouchableOpacity>
                <StoreCard local={item} />
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron locales.</Text>}
        />
      )}

      {/* --- SECCIÓN DEL BOTÓN DEL CARRITO AÑADIDA --- */}
      {cartCount > 0 && (
        <Link href={"/cart" as Href<string>} asChild>
          <TouchableOpacity style={styles.fab}>
            <FontAwesome5 name="shopping-cart" size={22} color="white" />
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#121212' 
    },
    searchContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    },
    searchInput: {
      backgroundColor: '#1C1C1E',
      color: '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
    },
    emptyText: {
        color: '#A9A9A9',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16
    },
    // --- ESTILOS PARA EL BOTÓN DEL CARRITO AÑADIDOS ---
    fab: { 
      position: 'absolute', 
      width: 60, 
      height: 60, 
      alignItems: 'center', 
      justifyContent: 'center', 
      right: 30, 
      bottom: 30, 
      backgroundColor: '#FFA500', 
      borderRadius: 30,
    },
    fabBadge: {
      position: 'absolute',
      right: -5,
      top: -5,
      backgroundColor: '#dc3545',
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFA500'
    },
    fabBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
});