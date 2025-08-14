// app/(app)/confirmation.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmationScreen() {
  const router = useRouter();
  const animation = useRef<LottieView>(null); // Tipamos la referencia

  useEffect(() => {
    // Inicia la animación explícitamente cuando el componente se monta
    animation.current?.play();

    const redirectTimeout = setTimeout(() => {
      router.replace('/(app)');
    }, 3000); 

    return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animation}
          style={{ width: '100%', height: '100%' }}
          source={require('@/assets/animations/success.json')}
          loop={false}
          // --- AJUSTE CLAVE ---
          // A veces, en ciertas versiones, se necesita esta propiedad para el manejo correcto de la animación
          useNativeLooping 
        />
      </View>
      <Text style={styles.text}>¡Pedido Confirmado!</Text>
      <Text style={styles.subtext}>Tu orden está en preparación.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 250,
    height: 250,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#A9A9A9',
    marginTop: 10,
  },
});