import {useEffect, useState, useContext} from 'react';
import styled from 'styled-components/native';
import {
  View,
  Image,
  Animated,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getFeedHttp, makePostRequest, dates} from './utils.js';
import {EventContext, RegisteredContext} from './App.tsx';
import {Profile} from './Profile.js';

export const Connections = ({route, navigation}) => {
  return (
    <MaxWidth>
      <MarginContainer>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 70,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <ConnectionsHeader>Connections</ConnectionsHeader>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 7,
              shadowRadius: 10,
              shadowOpacity: 0.2,
            }}>
            <SearchImage source={require('./assets/search.png')} />
          </TouchableOpacity>
        </View>
        <PendingConnectionsHeader>Pending Connections</PendingConnectionsHeader>
        <PendingConnectionsBox>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{marginRight: -30, zIndex: 2}}
              source={require('./assets/purple_circle.png')}
            />
            <Image
              style={{marginRight: -30, zIndex: 1}}
              source={require('./assets/red_circle.png')}
            />
            <Image source={require('./assets/grey_circle.png')} />
            <Text
              style={{
                marginLeft: -47,
                zIndex: 3,
                color: 'white',
                fontWeight: '500',
              }}>
              +4
            </Text>
          </View>
          <ViewRequestsText>View all 4 requests</ViewRequestsText>
          <Image
            style={{marginLeft: 20}}
            source={require('./assets/right_line.png')}
          />
        </PendingConnectionsBox>
        <YourConnections>Your Connections</YourConnections>
        <ScrollView
          style={{height: '20%', width: '100%'}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Connection />
        </ScrollView>
      </MarginContainer>
    </MaxWidth>
  );
};

const Connection = () => {
  return (
    <ConnectionContainer>
      <ProfileImageContainer>
        <Image
          source={require('./assets/test.png')}
          style={{height: 45, width: 45}}
        />
      </ProfileImageContainer>
      <View style={{flexDirection: 'column', gap: 2, marginLeft: 10}}>
        <ConnectionName>Alexander Kaufmann</ConnectionName>
        <ConnectionEvent>Introduction to UX</ConnectionEvent>
      </View>
      <Image
        style={{marginLeft: '35%'}}
        source={require('./assets/right_line.png')}
      />
    </ConnectionContainer>
  );
};

const DividerImage = styled.Image`
  margin-top: 10px;
  width: 400px;
`;
const ConnectionEvent = styled.Text`
  color: #786cff;
  font-size: 12px;
`;
const ConnectionName = styled.Text`
  color: #786cff;
  font-size: 15px;
  font-weight: 600;
`;
const ProfileImageContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
`;
const ConnectionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 70px;
  border-bottom-width: 0.5px;
  border-color: #000000;
`;
const YourConnections = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-top: 40px;
`;
const ViewRequestsText = styled.Text`
  color: #786cff;
  font-size: 20px;
  margin-left: 100px;
`;
const PendingConnectionsBox = styled.TouchableOpacity`
  border-radius: 5px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  width: 100%;
  height: 65px;
  flex-direction: row;
  align-items: center;
`;
const PendingConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-top: 30px;
`;
const SearchImage = styled.Image`
  width: 25px;
  height: 25px;
  margin: 10px 10px 10px 10px;
`;
const ConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: bold;
  font-size: 35px;
`;
const MarginContainer = styled.View`
  width: 85%;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;
