import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import EmployeeCustomer from "./screens/employee_customer/employee_customer.jsx";
import EmployeeRegistrationScreen from "./screens/reg_employee/employee_registration_screen.jsx";
import DrawerScreen from "./screens/drawer_screen/drawer_screen.jsx";
import Products from "./screens/products/products.jsx";
import Cart from "./screens/cart/cart.jsx";
import Payment from "./screens/payment/payment.jsx";
import { COLORS } from "./constants/theme.js";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Certifique-se de instalar o react-native-vector-icons
import { useUser } from "./context/UserContext.jsx"; // Caminho correto

const Drawer = createDrawerNavigator();

function RoutesAuth() {
  const { userRole } = useUser(); // Acessa o papel do usuário (admin ou employee)

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="DrawerScreen"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: COLORS.blueprincipal, // Cor de fundo do cabeçalho
          },
          headerTintColor: "#fff", // Cor do texto do cabeçalho
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{
                padding: 15, // Aumenta a área clicável do botão
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          drawerStyle: {
            backgroundColor: COLORS.bluedrawer, //"#f5f5f5", // Cor de fundo do menu
            width: 250,
          },
          drawerItemStyle: {
            paddingVertical: 12, // Aumenta a área clicável verticalmente
            marginHorizontal: 0, // Remove margens extras
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 0,
          },
          drawerActiveTintColor: COLORS.blueprincipal, // Cor de itens ativos
          drawerInactiveTintColor: COLORS.blueprincipal, // Cor de itens inativos
        })}
      >
        {/* Rota disponível para qualquer usuário */}
        <Drawer.Screen
          name="DrawerScreen"
          component={DrawerScreen}
          options={{
            title: "Bem vindo",
            headerStyle: {
              backgroundColor: COLORS.blueprincipal, // Cor de fundo do cabeçalho
            },
            headerTintColor: "#fff", // Cor do texto e ícones no cabeçalho
          }}
        />

        {/* Rotas exclusivas para administrador */}
        {userRole === true && (
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
                  /> // Ícone de adicionar pessoa
                ),
              }}
            />

            <Drawer.Screen
              name="Produtos"
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

        {/* Rotas exclusivas para funcionário */}
        {userRole === false && (
          <>
            <Drawer.Screen
              name="Funcionário / Vendas"
              component={EmployeeCustomer}
              options={{
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="person-add"
                    color={color}
                    size={size}
                    style={{ marginLeft: -15 }}
                  /> // Ícone de adicionar pessoa
                ),
              }}
            />
            <Drawer.Screen
              name="Produtos"
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
