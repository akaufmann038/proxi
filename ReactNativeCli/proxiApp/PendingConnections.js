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
} from 'react-native';
import {
  getFeedHttp,
  makePostRequest,
  dates,
  getConnectionsAllHttp,
  queryHashDataHttp,
  getPendingConnectionsDataHttp,
  acceptRequestHttp,
  rejectRequestHttp,
} from './utils.js';
import {PendingConnectionsCount, ConnectionsData} from './App.tsx';
import {Profile} from './Profile.js';
import {BackButton} from './SignupComponents.js';

export const PendingConnections = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);
  const [pendingConnectionsData, setPendingConnections] = useState(null);

  useEffect(() => {
    const getPendingConnectionsData = async () => {
      try {
        const res = await makePostRequest(getPendingConnectionsDataHttp, {
          phoneNumber: phoneNumber,
        });

        const resData = await res.json();

        return resData;
      } catch (err) {
        console.log(err);
      }
    };

    getPendingConnectionsData().then(res => {
      setPendingConnections(res.result['pendingConnectionsData']);
    });
  }, []);

  return (
    <MaxWidth>
      {pendingConnectionsData != null && pendingCount != null ? (
        <MarginContainer>
          <View
            style={{
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <BackButton label="back" onPress={() => navigation.goBack()} />
            <View style={{alignItems: 'flex-end'}}>
              <PendingConnectionsHeader>Pending</PendingConnectionsHeader>
              <PendingConnectionsHeader>Connections</PendingConnectionsHeader>
            </View>
          </View>
          <ScrollView>
            <View
              style={{
                height: 30,
                borderBottomWidth: 0.4,
              }}
            />
            {pendingConnectionsData.map(pendingConnection => (
              <PendingConnection
                navigation={navigation}
                name={pendingConnection['fullName']}
                event={pendingConnection['eventName']}
                profilePicture={pendingConnection['photo']}
                userId={pendingConnection['connUserId']}
                key={pendingConnection['connUserId']}
                jobTitle={pendingConnection['jobTitle']}
                eventId={pendingConnection['eventId']}
                phoneNumber={phoneNumber}
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
  );
};

const PendingConnection = ({
  navigation,
  name,
  jobTitle,
  event,
  profilePicture,
  userId,
  eventId,
  phoneNumber,
}) => {
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);
  const {connectionsData, setConnectionsData} = useContext(ConnectionsData);

  const getShortTitle = longString => {
    if (longString.length > 23) {
      let newString = longString.slice(0, 24);

      return newString + '...';
    } else {
      return longString;
    }
  };

  const handleReject = async () => {
    try {
      const res = await makePostRequest(rejectRequestHttp, {
        phoneNumber: phoneNumber,
        otherUserId: userId,
      });

      const resData = await res.json();

      if (resData.success) {
        setPendingCount(resData.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await makePostRequest(acceptRequestHttp, {
        phoneNumber: phoneNumber,
        otherUserId: userId,
        eventId: eventId,
      });

      const resData = await res.json();

      if (resData.success) {
        setPendingCount(resData.result);

        setConnectionsData([
          ...connectionsData,
          {
            photo: profilePicture,
            fullName: name,
            eventName: event,
            connUserId: userId,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ConnectionContainer
      onPress={() =>
        navigation.navigate('ShowPartialProfile', {
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
            source={{uri: `data:image/png;base64,${profilePicture}`}}
            style={{height: 45, width: 45}}
          />
        </ProfileImageContainer>
        <View style={{flexDirection: 'column', gap: 2, marginLeft: 10}}>
          <ConnectionName>{name}</ConnectionName>
          <ConnectionEvent>{getShortTitle(jobTitle)}</ConnectionEvent>
          <ConnectionEvent>{getShortTitle(event)}</ConnectionEvent>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={() => handleReject()}>
          <Image source={require('./assets/reject.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAccept()}>
          <Image source={require('./assets/accept.png')} />
        </TouchableOpacity>
      </View>
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
  border-bottom-width: 0.4px;
  border-color: #000000;
`;
const PendingConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: bold;
  font-size: 30px;
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
