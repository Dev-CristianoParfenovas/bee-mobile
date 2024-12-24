import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import EmployeeCustomer from "./screens/employee_customer/employee_customer.jsx";
import EmployeeRegistrationScreen from "./screens/reg_employee/employee_registration_screen.jsx";
import ClientRegistrationScreen from "./screens/reg_clients/client_registration_screen.jsx";
import ProductsRegistrationScreen from "./screens/reg_products/products_registration_screen.jsx";
import CategoryRegistrationScreen from "./screens/reg_category/category_registration_screen.jsx";
import DrawerScreen from "./screens/drawer_screen/drawer_screen.jsx";
import Products from "./screens/products/products.jsx";
import Cart from "./screens/cart/cart.jsx";
import Payment from "./screens/payment/payment.jsx";
import { COLORS } from "./constants/theme.js";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Certifique-se de instalar o react-native-vector-icons
import { useAuth } from "./context/AuthContext.jsx"; // Caminho correto
import SalesDashboard from "./screens/sales_dashboard/sales_dashboard.jsx";

const Drawer = createDrawerNavigator();

// Componente personalizado para o conteúdo do menu Drawer
function CustomDrawerContent(props) {
  const { userName } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Cabeçalho personalizado */}
      <View style={{ padding: 20, backgroundColor: "#f4f4f4" }}>
        <Text style={{ fontSize: 16 }}>Olá</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
          {userName}
        </Text>
      </View>
      {/* Renderiza os itens padrão do menu Drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function RoutesAuth() {
  const { isAdmin, isAuthenticated, userName, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="DrawerScreen"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} userName={userName} />
        )}
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: COLORS.blueprincipal,
          },
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{
                padding: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          drawerStyle: {
            backgroundColor: COLORS.bluedrawer,
            width: 250,
          },
          drawerItemStyle: {
            paddingVertical: 10,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          drawerActiveTintColor: COLORS.blueprincipal,
          drawerInactiveTintColor: COLORS.blueprincipal,
        })}
      >
        <Drawer.Screen
          name="DrawerScreen"
          component={DrawerScreen}
          options={{
            title: "Home",
            drawerLabel: () => null, // Remove o rótulo
            drawerItemStyle: { height: 0 }, // Remove o espaço ocupado
            headerShadowVisible: false,
          }}
        />
        {/*Rota do adm*/}
        {isAuthenticated && isAdmin && (
          <>
            <Drawer.Screen
              name="Cadastrar Funcionários"
              component={EmployeeRegistrationScreen}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="person-add"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Cadastrar Clientes"
              component={ClientRegistrationScreen}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="person"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Cadastrar Produtos"
              component={ProductsRegistrationScreen}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="inventory"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Cadastrar Categorias"
              component={CategoryRegistrationScreen}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="category"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Acessar Clientes"
              component={EmployeeCustomer}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="people"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Lista de Produtos"
              component={Products}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="store"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Carrinho"
              component={Cart}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="shopping-cart"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Pagamento"
              component={Payment}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="payment"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Painel de Vendas"
              component={SalesDashboard}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="bar-chart"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
          </>
        )}
        {/*Rota para funcionários*/}
        {isAuthenticated && !isAdmin && (
          <>
            <Drawer.Screen
              name="Acessar Clientes"
              component={EmployeeCustomer}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="person-add"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Lista de Produtos"
              component={Products}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="store"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Carrinho"
              component={Cart}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="shopping-cart"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Pagamento"
              component={Payment}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="payment"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  />
                ),
              }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RoutesAuth;
