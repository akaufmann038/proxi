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
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import {
  getFeedHttp,
  makePostRequest,
  dates,
  getConnectionsAllHttp,
  queryHashDataHttp,
  getConnectionsDataHttp,
} from './utils.js';
import {
  EventContext,
  RegisteredContext,
  PendingConnectionsCount,
  ConnectionsData,
} from './App.tsx';
import {Profile} from './Profile.js';

export const Connections = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';
  const {connectionsData, setConnectionsData} = useContext(ConnectionsData);
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);

  // Connections.js
  // number of pending connections (context)
  // connections data (state)
  // - photo
  // - fullName
  // - event name
  // - userId

  // PendingConnections.js
  // pendingConnections data (state)
  // - photo
  // - fullName
  // - jobTitle
  // - event name
  // - userId
  // acceptConnection() -> server returns number of pending connections (front end shows the change)
  // recommendedConnections data (state)
  // - photo
  // - fullName
  // - jobTitle

  // PartialProfile.js
  // - profile data (state)
  useEffect(() => {
    const getConnectionsData = async () => {
      try {
        const res = await makePostRequest(getConnectionsDataHttp, {
          phoneNumber: phoneNumber,
        });

        const resData = await res.json();

        return resData;
      } catch (err) {
        console.log(err);
      }
    };

    getConnectionsData().then(res => {
      setConnectionsData(res.result['connectionsData']);
      setPendingCount(res.result['pendingConnectionCount']);
    });
  }, []);

  return (
    <SafeAreaView style={{backgroundColor:'#ffffff'}}>
      <MaxWidth>
        {connectionsData != null && pendingCount != null ? (
          <MarginContainer>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 0,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <ConnectionsHeader>Connections</ConnectionsHeader>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 7,
                  shadowRadius: 12,
                  shadowOpacity: 0.12,
                }}>
                <SearchImage source={require('./assets/search.png')} />
              </TouchableOpacity>
            </View>
                <PendingConnectionsHeader>
                  Pending Connections
                </PendingConnectionsHeader>
                <PendingConnectionsBox
                  onPress={() => navigation.navigate('PendingConnections')}>
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
                      +{pendingCount}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
                    <ViewRequestsText>
                      View all {pendingCount} requests
                    </ViewRequestsText>
                    <Image
                      style={{marginLeft: 0}}
                      source={require('./assets/right_line.png')}
                    />
                  </View>
                </PendingConnectionsBox>
            <YourConnections>Your Connections</YourConnections>
            <ScrollView
              style={{width: '100%'}}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              {connectionsData.map(connection => (
                <Connection
                  navigation={navigation}
                  name={connection.fullName}
                  event={connection.eventName}
                  photo={connection.photo}
                  userId={connection.connUserId}
                  key={connection.connUserId}
                />
              ))}
            </ScrollView>
          </MarginContainer>
        ) : (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator color="#786cff" />
          </View>
        )}
      </MaxWidth>
    </SafeAreaView>
  );
};

const Connection = ({navigation, name, event, photo, userId}) => {
  return (
    <ConnectionContainer
      onPress={() =>
        navigation.navigate('ShowProfile', {
          userId: userId,
        })
      }>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ProfileImageContainer>
          <Image
            source={{uri: `data:image/png;base64,${photo}`}}
            style={{height: 45, width: 45}}
          />
        </ProfileImageContainer>
        <View style={{flexDirection: 'column', gap: 2, marginLeft: 10}}>
          <ConnectionName>{name}</ConnectionName>
          <ConnectionEvent>{event}</ConnectionEvent>
        </View>
      </View>
      <Image
        style={{marginRight: 20}}
        source={require('./assets/right_line.png')}
      />
    </ConnectionContainer>
  );
};

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
  justify-content: space-between;
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
`;
const PendingConnectionsBox = styled.TouchableOpacity`
  border-radius: 5px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  width: 100%;
  gap: 10px;
  padding: 0px 15px 0px 15px;
  height: 65px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
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
