// App.js
import { useEffect } from "react";
import Routes from "./src/routes";
import RoutesAuth from "./src/routesAuth";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { UserProvider } from "./src/context/UserContext"; // Importe o UserProvider

function AppContent() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token); // Define como autenticado se o token existir
    };

    checkAuthStatus();
  }, [setIsAuthenticated]);

  return isAuthenticated ? <RoutesAuth /> : <Routes />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
}
