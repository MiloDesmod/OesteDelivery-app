// components/StoreCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Local } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 30;

const placeholderImage = 'https://via.placeholder.com/400x200.png/1C1C1E/FFFFFF?text=Oeste+Delivery';

export default function StoreCard({ local }: { local: Local }) {
  // Construimos la URL completa de la imagen. Si el local no tiene imagen, usamos la de por defecto.
  const imageUrl = local.imagen ? `${process.env.EXPO_PUBLIC_API_URL}${local.imagen}` : placeholderImage;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{local.nombre}</Text>
        <Text style={styles.subtitle}>{local.direccion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
    width: CARD_WIDTH,
    alignSelf: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 150,
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#A9A9A9',
    marginTop: 5,
  },
});