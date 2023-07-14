import {useEffect, useState, useContext} from 'react';
import {
  View,
  Image,
  Animated,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
import {BackButton} from './SignupComponents.js';
import {LocationComponent, DateComponent} from './Home.js';
import {dates, makePostRequest, registerUserHttp} from './utils.js';
import {RedButton} from './SignupComponents.js';
import {EventContext, RegisteredContext} from './App.tsx';
import { NativeModules } from 'react-native';

export const EventScreen = ({route, navigation}) => {
    const {eventId, phoneNumber} = route.params;
    const [connections, setConnections] = useState()

    // next, listen for events within swift module, listen for a connection
    // and a disconnection, and that should all you need

    const handleButtonPress = () => {
        /*
        NativeModules.ProximityDetection.getCurrentConnections(result => {
            setConnections(result)
        })
        */
       NativeModules.ProximityDetection.retrievePeripherals(result => {
        setConnections(result)
       })
    }

    return (<MaxWidth>
        <View style={{marginTop: 50, display: 'flex', flexDirection: "row"}}>
            <RedButton onPress={handleButtonPress} label="Show" />
            {connections ? connections.map((item, index) => (
                <Text key={index}>
                    {item}is an item
                </Text>
            )) : <></>}
        </View>
    </MaxWidth>)
}

const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
`;