import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './Login.js';
import {ConfirmNumber} from './ConfirmNumber.js';
import {LetsGetStarted} from './LetsGetStarted.js';
import {CreateProfile} from './CreateProfile.js';
import {Connect} from './Connect.js';
import {Events} from './Events.js';
import {EventPage} from './EventPage.js';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Events">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ConfirmNumber" component={ConfirmNumber} />
        <Stack.Screen name="LetsGetStarted" component={LetsGetStarted} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="Connect" component={Connect} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="EventPage" component={EventPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
