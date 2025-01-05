import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado de admin como booleano
  const [userName, setUserName] = useState("");
  const [companyId, setCompanyId] = useState(""); // Novo estado para company_id
  const [authToken, setAuthToken] = useState(""); // Adicionei o estado authToken
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    const loadUserName = async () => {
      // await AsyncStorage.clear();
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
      // await AsyncStorage.clear();
      try {
        const token = await AsyncStorage.getItem("authToken");
        const adminStatus = await AsyncStorage.getItem("isAdmin");
        const storedCompanyId = await AsyncStorage.getItem("companyId");
        //const storedEmployeeId = await AsyncStorage.getItem("employeeId");

        console.log("Company ID carregado:", storedCompanyId); // Deve exibir o valor correto
        console.log("Auth Token carregado:", token);
        //console.log("Employee ID carregado:", storedEmployeeId);
        console.log("Admin carregado: ", isAdmin);
        if (token) {
          setIsAuthenticated(true);
          setIsAdmin(adminStatus === "true");
          setCompanyId(storedCompanyId || ""); // Certifica que o estado é atualizado corretamente
          //  setEmployeeId(storedEmployeeId ? parseInt(storedEmployeeId, 10) : 0);
          setAuthToken(token); // Atualiza o estado authToken
        }
      } catch (error) {
        console.error("Erro ao carregar estado de autenticação:", error);
      }
    };

    loadAuthState();
  }, []);

  const login = async (token, name, company_id, admin = true) => {
    try {
      const companyIdToSave = company_id ? company_id.toString() : ""; // Converte para string
      //  const employeeIdToSave = employeeId ? employeeId.toString() : "";

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("isAdmin", admin.toString());
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("companyId", companyIdToSave);
      // await AsyncStorage.setItem("employeeId", employeeIdToSave);

      console.log("Company_ID salvo corretamente:", companyIdToSave);
      //  console.log("Employee_ID salvo corretamente:", employeeIdToSave);

      setIsAuthenticated(true);
      setIsAdmin(admin);
      setUserName(name);
      setCompanyId(companyIdToSave); // Atualiza o estado corretamente
      // setEmployeeId(employeeIdToSave);
      setAuthToken(token); // Atualiza o estado authToken
    } catch (error) {
      console.error("Erro ao salvar dados de login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("isAdmin");
      await AsyncStorage.removeItem("userName"); // Remove o nome do usuário
      await AsyncStorage.removeItem("companyId");
      // await AsyncStorage.removeItem("employeeId");
      setIsAuthenticated(false);
      setIsAdmin(false); // Reseta o estado de admin
      setCompanyId("");
      //  setEmployeeId("");
      setUserName(""); // Limpa o nome do usuário
    } catch (error) {
      console.error("Erro ao remover dados de logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        userName,
        companyId,
        //  employeeId,
        authToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
