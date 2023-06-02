import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './Login.js';
import {ConfirmNumber} from './ConfirmNumber.js';
import {LetsGetStarted} from './LetsGetStarted.js';
import {CreateProfile} from './CreateProfile.js';
import {Connect} from './Connect.js';
import {Events} from './Events.js';
import {EventPage} from './EventPage.js';
import {useContext, createContext, useState} from 'react';

export const EventContext = createContext({});
export const RegisteredContext = createContext({});

export default function App() {
  const Stack = createNativeStackNavigator();
  const [events, setEvents] = useState(null);
  const [registered, setRegistered] = useState(null);

  return (
    <NavigationContainer>
      <EventContext.Provider value={{events, setEvents}}>
        <RegisteredContext.Provider value={{registered, setRegistered}}>
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
        </RegisteredContext.Provider>
      </EventContext.Provider>
    </NavigationContainer>
  );
}
