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
import {PendingConnections} from './PendingConnections.js';
import {ShowPartialProfile} from './ShowPartialProfile.js';
import {EventScreen} from './EventScreen.js';
import {ConfirmEvent} from './ConfirmEvent.js';
import {ConfirmProfile} from './ConfirmProfile.js';
import {ConfirmFilters} from './ConfirmFilters.js';

export const EventContext = createContext({});
export const RegisteredContext = createContext({});
export const PendingConnectionsCount = createContext({});
export const ConnectionsData = createContext({});
export const PendingConnectionsData = createContext({});
export const UserProfile = createContext({});

const Tab = createBottomTabNavigator();

export default function App() {
  const Stack = createNativeStackNavigator();
  const [events, setEvents] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);
  const [connectionsData, setConnectionsData] = useState(null);
  const [pendingConnectionsData, setPendingConnections] = useState(null);
  const [userProfileData, setUserProfile] = useState(null);

  return (
    <NavigationContainer>
      <EventContext.Provider value={{events, setEvents}}>
        <RegisteredContext.Provider value={{registered, setRegistered}}>
          <PendingConnectionsCount.Provider
            value={{pendingCount, setPendingCount}}>
            <ConnectionsData.Provider
              value={{connectionsData, setConnectionsData}}>
              <PendingConnectionsData.Provider
                value={{pendingConnectionsData, setPendingConnections}}>
                <UserProfile.Provider value={{userProfileData, setUserProfile}}>
                  <Stack.Navigator
                    screenOptions={{headerShown: false}}
                    initialRouteName="BottomNavigator">
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen
                      name="ConfirmNumber"
                      component={ConfirmNumber}
                    />
                    <Stack.Screen
                      name="LetsGetStarted"
                      component={LetsGetStarted}
                    />
                    <Stack.Screen
                      name="CreateProfile"
                      component={CreateProfile}
                    />
                    <Stack.Screen name="Connect" component={Connect} />
                    <Stack.Screen name="EventPage" component={EventPage} />
                    <Stack.Screen
                      name="BottomNavigator"
                      component={BottomNavigator}
                    />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="ShowProfile" component={ShowProfile} />
                    <Stack.Screen
                      name="PendingConnections"
                      component={PendingConnections}
                    />
                    <Stack.Screen
                      name="ShowPartialProfile"
                      component={ShowPartialProfile}
                    />
                    <Stack.Screen name="EventScreen" component={EventScreen} />
                    <Stack.Screen
                      name="ConfirmEvent"
                      component={ConfirmEvent}
                    />
                    <Stack.Screen
                      name="ConfirmProfile"
                      component={ConfirmProfile}
                    />
                    <Stack.Screen
                      name="ConfirmFilters"
                      component={ConfirmFilters}
                    />
                  </Stack.Navigator>
                </UserProfile.Provider>
              </PendingConnectionsData.Provider>
            </ConnectionsData.Provider>
          </PendingConnectionsCount.Provider>
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
