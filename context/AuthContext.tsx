// context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

const AuthContext = createContext({
  onLogin: async (email, password) => false,
  onLogout: async () => {},
  authState: { token: null, authenticated: false }
});

const TOKEN_KEY = 'my-jwt';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState<{token: string | null; authenticated: boolean | null;}>({
    token: null,
    authenticated: null,
  });
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      setAuthState({
        token: token,
        authenticated: !!token,
      });
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (authState.authenticated === null) return;
    const inAuthGroup = segments[0] === '(app)';
    if (authState.authenticated && !inAuthGroup) {
      router.replace('/(app)');
    } else if (!authState.authenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [authState.authenticated, segments]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthState({
          token: data.key,
          authenticated: true,
        });
        await SecureStore.setItemAsync(TOKEN_KEY, data.key);
        return true; // <-- CAMBIO IMPORTANTE: Devolvemos 'true' en caso de éxito
      } else {
        throw new Error(data.non_field_errors?.[0] || 'Error de login');
      }
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}