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
import {NativeModules} from 'react-native';
import {StyleSheet} from 'react-native';
import {EventHeader} from './OtherComponents.js';

export const ConfirmEvent = ({route, navigation}) => {
  const {eventId, phoneNumber} = route.params;
  const {events, setEvents} = useContext(EventContext);

  // get event data for this page
  const eventData = events.filter(event => event.id == eventId).find(x => x);

  const handleButtonPress = () => {
    navigation.navigate('ConfirmProfile', {
      eventId: eventId,
      phoneNumber: phoneNumber,
    });
  };

  return (
    <MaxWidth>
      <MarginContainer>
        <View style={{flexDirection: 'column', marginTop: 60}}>
          <BackButton label="back" onPress={() => navigation.goBack()} />
          <EventHeader
            image={eventData.hostedByImage}
            eventName={eventData.name}
            hostedByName={eventData.hostedBy}
          />
          <Text style={{color: '#737373', marginTop: 20, marginBottom: 30}}>
            {eventData.overview}
          </Text>
          <RedButton onPress={handleButtonPress} label={'Confirm'} />
        </View>
      </MarginContainer>
    </MaxWidth>
  );
};

const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
`;
const MarginContainer = styled.View`
  width: 85%;
  height: 100%;
  position: relative;
`;
