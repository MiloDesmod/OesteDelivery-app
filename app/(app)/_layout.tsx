// app/(app)/_layout.tsx

import { Stack } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router'; // Usamos Link para el historial, es más robusto

export default function AppLayout() {
  // Ahora solo necesitamos la función 'onLogout'
  const { onLogout } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Locales',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Link href="/(app)/orders" asChild>
                <TouchableOpacity>
                  <FontAwesome name="history" size={24} color="#FFA500" style={{ marginRight: 20 }} />
                </TouchableOpacity>
              </Link>

              {/* El botón ahora solo llama a onLogout y no hace más nada */}
              <TouchableOpacity onPress={onLogout}>
                <Text style={{ color: '#FFA500', fontSize: 16, fontWeight: '600' }}>Salir</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {/* El resto de las pantallas se mantiene igual */}
      <Stack.Screen name="cart" options={{ title: 'Mi Carrito' }} />
      <Stack.Screen name="store/[id]" options={{ title: 'Menú del Local' }} />
      <Stack.Screen name="confirmation" options={{ title: 'Pedido Confirmado', presentation: 'modal' }} />
      <Stack.Screen name="orders" options={{ title: 'Mis Pedidos' }} />
    </Stack>
  );
}