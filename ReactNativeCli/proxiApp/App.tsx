import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './Login.js';
import {ConfirmNumber} from './ConfirmNumber.js';
import {LetsGetStarted} from './LetsGetStarted.js';
import {CreateProfile} from './CreateProfile.js';
import {Connect} from './Connect.js';
import {Home} from './Home.js';
import {EventPage} from './EventPage.js';
import {useContext, createContext, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Connections} from './Connections.js';
import {TabBar} from './SignupComponents.js';
import {Events} from './Events.js';
import {Profile} from './Profile.js';
import {ShowProfile} from './ShowProfile.js';

export const EventContext = createContext({});
export const RegisteredContext = createContext({});
export const ConnectionsContext = createContext({});
export const PendingConnectionsContext = createContext({});
const Tab = createBottomTabNavigator();

export default function App() {
  const Stack = createNativeStackNavigator();
  const [events, setEvents] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [connections, setConnections] = useState(null);
  const [pendingConnections, setPendingConnections] = useState(null);

  return (
    <NavigationContainer>
      <EventContext.Provider value={{events, setEvents}}>
        <RegisteredContext.Provider value={{registered, setRegistered}}>
          <ConnectionsContext.Provider value={{connections, setConnections}}>
            <PendingConnectionsContext.Provider
              value={{pendingConnections, setPendingConnections}}>
              <Stack.Navigator
                screenOptions={{headerShown: false}}
                initialRouteName="BottomNavigator">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ConfirmNumber" component={ConfirmNumber} />
                <Stack.Screen
                  name="LetsGetStarted"
                  component={LetsGetStarted}
                />
                <Stack.Screen name="CreateProfile" component={CreateProfile} />
                <Stack.Screen name="Connect" component={Connect} />
                <Stack.Screen name="EventPage" component={EventPage} />
                <Stack.Screen
                  name="BottomNavigator"
                  component={BottomNavigator}
                />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="ShowProfile" component={ShowProfile} />
              </Stack.Navigator>
            </PendingConnectionsContext.Provider>
          </ConnectionsContext.Provider>
        </RegisteredContext.Provider>
      </EventContext.Provider>
    </NavigationContainer>
  );
}

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Connections" component={Connections} />
      <Tab.Screen name="Events" component={Events} />
    </Tab.Navigator>
  );
};
