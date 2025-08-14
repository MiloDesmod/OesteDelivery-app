// app/index.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Oeste Delivery</Text>
        <Text style={styles.subtitle}>Tu comida favorita, a un toque de distancia.</Text>
      </View>

      <View style={styles.footer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  registerButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#A9A9A9',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
});