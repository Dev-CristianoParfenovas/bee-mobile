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
      // Simula a autenticação; substitua pela lógica real
      setIsAuthenticated(false); // Altere para false para simular logout
    };
    checkAuthStatus();
  }, []);

  return isAuthenticated ? <RoutesAuth /> : <Routes />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        {/* Envolva com o UserProvider também */}
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
}
