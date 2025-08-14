// app/register.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !password2 || !nombre || !apellido) {
      Alert.alert('Error', 'Por favor, completá todos los campos.');
      return;
    }
    if (password !== password2) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      email: email,
      nombre: nombre,
      apellido: apellido,
      password: password,
      password2: password2,
    };
    
    try {
      // --- LÍNEA CORREGIDA ---
      // Apuntamos a nuestra nueva URL de registro personalizada
      const response = await fetch(`${API_BASE_URL}/api/usuarios/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada. Ahora serás dirigido para iniciar sesión.',
          [{ text: 'Ir a Login', onPress: () => router.push('/login') }]
        );
      } else {
        const errorMessages = Object.values(data).flat().join('\n');
        Alert.alert('Error de Registro', errorMessages || 'Ocurrió un error al registrar tu cuenta.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Completá tus datos para empezar</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#A9A9A9"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor="#A9A9A9"
          value={apellido}
          onChangeText={setApellido}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#A9A9A9"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#121212" /> : <Text style={styles.buttonText}>Registrarse</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>¿Ya tenés cuenta? Inicia Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20, },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 10, },
  subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginBottom: 30, },
  input: { backgroundColor: '#1C1C1E', color: '#FFFFFF', padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 15, },
  button: { backgroundColor: '#FFA500', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, },
  buttonText: { color: '#121212', fontSize: 18, fontWeight: 'bold', },
  linkText: { color: '#FFA500', textAlign: 'center', marginTop: 20, paddingBottom: 20, }
});