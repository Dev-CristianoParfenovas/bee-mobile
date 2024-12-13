import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado de admin como booleano
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUserName = async () => {
      await AsyncStorage.clear();
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          console.log("Nome do usuário carregado:", storedName);
          setUserName(storedName);
        }
      } catch (error) {
        console.error("Erro ao carregar o nome do usuário:", error);
      }
    };

    loadUserName();
  }, []);

  useEffect(() => {
    const loadAuthState = async () => {
      await AsyncStorage.clear(); // Isso pode apagar o token e o status, você pode remover essa linha se não precisar limpar sempre
      try {
        const token = await AsyncStorage.getItem("authToken");
        const adminStatus = await AsyncStorage.getItem("isAdmin");

        console.log("Token carregado:", token);
        console.log("Admin Status (raw):", adminStatus);

        if (token) {
          setIsAuthenticated(true);
          // Garantir que adminStatus seja tratado como booleano
          setIsAdmin(adminStatus === "true");
        }
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação:", error);
      }
    };
    loadAuthState();
  }, []);

  const login = async (token, name, admin = true) => {
    try {
      const adminStatus = admin === true ? true : false; // Garantir que isAdmin seja sempre true
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("isAdmin", adminStatus.toString()); // Salva admin como string "true"
      await AsyncStorage.setItem("userName", name); // Salva o nome do usuário

      console.log("Token salvo:", token);
      console.log("Nome do usuário salvo:", name);

      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
      setUserName(name); // Atualiza o estado com o nome do usuário
    } catch (error) {
      console.error("Erro ao salvar dados de login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("isAdmin");
      await AsyncStorage.removeItem("userName"); // Remove o nome do usuário
      setIsAuthenticated(false);
      setIsAdmin(null); // Reseta o estado de admin
      setUserName(""); // Limpa o nome do usuário
    } catch (error) {
      console.error("Erro ao remover dados de logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
