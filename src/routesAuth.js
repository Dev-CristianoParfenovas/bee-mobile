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

const Drawer = createDrawerNavigator();

function RoutesAuth() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#f5f5f5",
            width: 250,
          },
          drawerItemStyle: {
            paddingVertical: 8, // Aumenta a área de clique verticalmente
            marginHorizontal: 0, // Remove margens extras
            minWidth: "100%", // Faz com que o item ocupe toda a largura
          },
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            marginLeft: 0,
          },
          drawerActiveTintColor: COLORS.bluebtn,
          drawerInactiveTintColor: COLORS.black,
        }}
      >
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
        <Drawer.Screen
          name="EmployeeRegistrationScreen"
          component={EmployeeRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="employeeCustomer"
          component={EmployeeCustomer}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="products"
          component={Products}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="cart"
          component={Cart}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="payment"
          component={Payment}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RoutesAuth;
