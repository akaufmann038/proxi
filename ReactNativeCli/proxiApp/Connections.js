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
import * as Style from './Style.js';

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
                paddingRight: '7%',
                paddingLeft: '7%',
              }}>
              <Style.H1>Connections</Style.H1>
              <SquareWrapper>
                <SearchImage source={require('./assets/search.png')} style={{width: 20, height: 20,}} />
              </SquareWrapper>
            </View>
            <ScrollView
              style={{width: '100%', height: '100%', paddingLeft: '7%', paddingRight: '7%', paddingTop: 20}}
              contentContainerStyle={{justifyContent: 'center', alignItems: 'flex-start',}}>

              <Style.TitleText>Pending Connections</Style.TitleText>
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
                      fontSize: 12,
                    }}>
                    +{pendingCount}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
                  <Style.BodyText> View all {pendingCount} requests</Style.BodyText>
                  <Image
                    style={{marginLeft: 0}}
                    source={require('./assets/right_line.png')}
                  />
                </View>
              </PendingConnectionsBox>
              <Style.TitleText>Your Connections</Style.TitleText>
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
  border-bottom-width: 1.5px;
  border-color: #EDEDED;
`;
const YourConnections = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-top: 20px;
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
  margin-bottom: 20px;
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
const MarginContainer = styled.View`
  width: 100%;
  height: 100%;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;

const SquareWrapper = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 7px;
  shadow-radius: 12px;
  shadow-opacity: 0.1;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;