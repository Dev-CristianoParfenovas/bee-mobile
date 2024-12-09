import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token) => {
    try {
      // Salva o token no AsyncStorage
      await AsyncStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  };

  const logout = async () => {
    try {
      // Remove o token do AsyncStorage
      await AsyncStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
