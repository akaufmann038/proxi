import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login.js";
import { ConfirmNumber } from "./ConfirmNumber.js";
import { LetsGetStarted } from "./LetsGetStarted.js";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: true }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ConfirmNumber" component={ConfirmNumber} />
        <Stack.Screen name="LetsGetStarted" component={LetsGetStarted} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
