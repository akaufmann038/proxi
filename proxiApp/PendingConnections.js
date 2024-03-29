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
  getPendingConnectionsDataHttp,
  acceptRequestHttp,
  rejectRequestHttp,
} from './utils.js';
import {
  PendingConnectionsCount,
  ConnectionsData,
  PendingConnectionsData,
} from './App.tsx';
import {Profile} from './Profile.js';
import {BackButton} from './SignupComponents.js';

export const PendingConnections = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);
  const {pendingConnectionsData, setPendingConnections} = useContext(
    PendingConnectionsData,
  );

  // updates the pending connections when request is accepted or rejected
  const updatePending = userToDelete => {
    const updatedPending = pendingConnectionsData.filter(
      element => element['connUserId'] !== userToDelete,
    );

    setPendingConnections(updatedPending);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setPendingConnections(null);
    });

    return unsubscribe;
  }, [navigation]);

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
    <SafeAreaView style={{backgroundColor:'#ffffff'}}>
      <MaxWidth>
        {pendingConnectionsData != null && pendingCount != null ? (
          <MarginContainer>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <BackButton
                label="back"
                onPress={() => {
                  navigation.goBack();
                }}
              />
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
                  eventDate={pendingConnection['eventDate']}
                  profilePicture={pendingConnection['photo']}
                  userId={pendingConnection['connUserId']}
                  key={pendingConnection['connUserId']}
                  jobTitle={pendingConnection['jobTitle']}
                  eventId={pendingConnection['eventId']}
                  phoneNumber={phoneNumber}
                  updatePending={updatePending}
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

const PendingConnection = ({
  navigation,
  name,
  jobTitle,
  event,
  eventDate,
  profilePicture,
  userId,
  eventId,
  phoneNumber,
  updatePending,
}) => {
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);
  const {connectionsData, setConnectionsData} = useContext(ConnectionsData);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const getShortTitle = longString => {
    if (longString.length > 23) {
      let newString = longString.slice(0, 24);

      return newString + '...';
    } else {
      return longString;
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      const res = await makePostRequest(rejectRequestHttp, {
        phoneNumber: phoneNumber,
        otherUserId: userId,
      });

      const resData = await res.json();

      if (resData.success) {
        setPendingCount(resData.result);
        updatePending(userId);
      }
      setRejectLoading(false);
    } catch (err) {
      console.log(err);
      setRejectLoading(false);
    }
  };

  const handleAccept = async () => {
    setAcceptLoading(true);
    try {
      const res = await makePostRequest(acceptRequestHttp, {
        phoneNumber: phoneNumber,
        otherUserId: userId,
        eventId: eventId,
      });

      const resData = await res.json();

      if (resData.success) {
        setPendingCount(resData.result);
        updatePending(userId);

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
      setAcceptLoading(false);
    } catch (err) {
      console.log(err);
      setAcceptLoading(false);
    }
  };

  return (
    <ConnectionContainer
      onPress={() =>
        navigation.navigate('ShowPartialProfile', {
          userId: userId,
          event: event,
          eventDate: eventDate,
          eventId: eventId,
          phoneNumber: phoneNumber,
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
            style={{height: 50, width: 50}}
          />
        </ProfileImageContainer>
        <View style={{flexDirection: 'column', gap: 2, marginLeft: 10}}>
          <ConnectionName>{name}</ConnectionName>
          <ConnectionEvent>{getShortTitle(jobTitle)}</ConnectionEvent>
          <ConnectionEvent>{getShortTitle(event)}</ConnectionEvent>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        {rejectLoading ? (
          <ActivityIndicator size={40} color="#786cff" duration={500} />
        ) : (
          <TouchableOpacity onPress={() => handleReject()}>
            <Image
              style={{width: 40, height: 40}}
              source={require('./assets/reject.png')}
            />
          </TouchableOpacity>
        )}
        {acceptLoading ? (
          <ActivityIndicator size={40} color="#786cff" duration={500} />
        ) : (
          <TouchableOpacity onPress={() => handleAccept()}>
            <Image
              style={{width: 40, height: 40}}
              source={require('./assets/accept.png')}
            />
          </TouchableOpacity>
        )}
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
