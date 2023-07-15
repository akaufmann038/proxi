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

export const ConfirmFilters = ({route, navigation}) => {
  const {eventId, phoneNumber} = route.params;

  return (
    <MaxWidth>
      <MarginContainer>
        <View style={{flexDirection: 'column', marginTop: 70}}>
          <BackButton label="Profile" onPress={() => navigation.goBack()} />
          <ConnectionsHeader>Confirm Filters</ConnectionsHeader>
          <ScrollView>
            <Text
              style={{
                marginTop: 15,
                color: '#828282',
                fontSize: 20,
                fontWeight: 700,
              }}>
              Who do you want to meet?
            </Text>
            <Text style={{color: '#737373', marginTop: 5}}>
              Check off the characteristics that fits the profile of people you
              are trying to meet. We have provided recommendations below
            </Text>
          </ScrollView>
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
const ConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: bold;
  font-size: 35px;
`;
