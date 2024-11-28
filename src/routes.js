import Login from "./screens/login/login.jsx";
import Account from "./screens/account/account.jsx";
import EmployeeCustomer from "./screens/employee_customer/employee_customer.jsx";
import Products from "./screens/products/products.jsx";
import Cart from "./screens/cart/cart.jsx";
import Payment from "./screens/payment/payment.jsx";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          component={Account}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="employeecustomer"
          component={EmployeeCustomer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="products"
          component={Products}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cart"
          component={Cart}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="payment"
          component={Payment}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
