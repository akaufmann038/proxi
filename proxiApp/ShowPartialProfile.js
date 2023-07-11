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
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  getFeedHttp,
  makePostRequest,
  dates,
  getConnectionsAllHttp,
  queryHashDataHttp,
  getProfileHttp,
  getPartialProfileHttp,
  acceptRequestHttp,
  rejectRequestHttp,
} from './utils.js';
import {
  EventContext,
  RegisteredContext,
  ConnectionsData,
  PendingConnectionsCount,
  PendingConnectionsData,
} from './App.tsx';
import {Profile} from './ShowProfile.js';
import {BackButton, RedButton} from './SignupComponents.js';
import {Skill} from './ShowProfile.js';
import {Connect} from './Connect.js';

export const ShowPartialProfile = ({route, navigation}) => {
  const {userId, event, eventDate, eventId, phoneNumber} = route.params;
  const [userData, setUserData] = useState(null);
  const {pendingConnectionsData, setPendingConnections} = useContext(
    PendingConnectionsData,
  );
  const {pendingCount, setPendingCount} = useContext(PendingConnectionsCount);
  const {connectionsData, setConnectionsData} = useContext(ConnectionsData);
  const [requestHappening, setRequestHappening] = useState(false);

  // updates the pending connections when request is accepted or rejected
  const updatePending = userToDelete => {
    const updatedPending = pendingConnectionsData.filter(
      element => element['connUserId'] !== userToDelete,
    );

    setPendingConnections(updatedPending);
  };

  const handleOnAccept = async () => {
    setRequestHappening(true);
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
            photo: userData['photo'],
            fullName: userData['fullName'],
            eventName: event,
            connUserId: userId,
          },
        ]);

        navigation.goBack();
      } else {
        setRequestHappening(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnReject = async () => {
    setRequestHappening(true);
    try {
      const res = await makePostRequest(rejectRequestHttp, {
        phoneNumber: phoneNumber,
        otherUserId: userId,
      });

      const resData = await res.json();

      if (resData.success) {
        setPendingCount(resData.result);
        updatePending(userId);

        navigation.goBack();
      } else {
        setRequestHappening(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPartialProfile = async () => {
      try {
        const res = await makePostRequest(getPartialProfileHttp, {
          userId: userId,
        });

        const data = await res.json();

        return data;
      } catch (err) {
        console.log(err);
      }
    };

    getPartialProfile().then(res => {
      setUserData(res['partialProfile']);
    });
  }, []);

  return (
    <MaxWidth>
      {requestHappening == false && userData != null ? (
        <MarginContainer>
          <View
            style={{
              marginTop: 50,
            }}>
            <BackButton label="back" onPress={() => navigation.goBack()} />
            <View
              style={{
                flexDirection: 'row',
                height: 120,
                width: 120,
                alignSelf: 'center',
              }}>
              <Image
                style={{height: 120, width: 120}}
                source={require('./assets/profile_ellipse.png')}
              />
              <ProfileImageContainer>
                <Image
                  source={{
                    uri: `data:image/png;base64,${userData['photo']}`,
                  }}
                  style={{height: 100, width: 100}}
                />
              </ProfileImageContainer>
            </View>
            <Text
              style={{
                color: '#828282',
                fontSize: 25,
                fontWeight: 800,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              {userData['fullName']}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              <Image source={require('./assets/jobTitle.png')} />
              <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                {userData['jobTitle']}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                alignSelf: 'center',
              }}>
              <Image source={require('./assets/jobTitle.png')} />
              <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                {userData['company']}
              </Text>
            </View>
            <ScrollView>
              <Text
                style={{
                  color: '#828282',
                  fontSize: 25,
                  fontWeight: 700,
                  marginTop: 30,
                }}>
                Where you connected
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  elevation: 4,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  backgroundColor: 'white',
                  marginLeft: 2,
                  marginRight: 2,
                  borderRadius: 5,
                }}>
                <Image
                  source={require('./assets/calendar.png')}
                  style={{
                    height: 40,
                    width: 40,
                    marginLeft: 5,
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                />
                <View style={{flexDirection: 'column'}}>
                  <ConnectedWhere>{event}</ConnectedWhere>
                  <ConnectionEvent>{eventDate.slice(0, 10)}</ConnectionEvent>
                </View>
              </View>
              <Text
                style={{
                  marginTop: 40,
                  color: '#828282',
                  fontWeight: 500,
                  marginBottom: 5,
                }}>
                Why you matched with {userData['fullName'].split(' ')[0]}
                TODO: FILL IN filters
              </Text>
              <Text
                style={{
                  marginTop: 0,
                  color: '#828282',
                  fontSize: 25,
                  fontWeight: 700,
                  marginBottom: 5,
                }}>
                Biography
              </Text>
              <Text style={{color: '#828282', fontWeight: 500}}>
                {userData['biography']}
              </Text>
              <Text
                style={{
                  color: '#828282',
                  fontSize: 25,
                  fontWeight: 700,
                  marginTop: 30,
                }}>
                Their skills
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                {userData['skills'].split(',').map(skill => (
                  <Skill name={skill} />
                ))}
              </View>
              <Text
                style={{
                  color: '#828282',
                  fontSize: 25,
                  fontWeight: 700,
                  marginTop: 30,
                }}>
                Their interests
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                {userData['interests'].split(',').map(skill => (
                  <Skill name={skill} />
                ))}
              </View>
            </ScrollView>
            <View
              style={{
                bottom: 0,
                position: 'absolute',
                width: '100%',
                alignItems: 'center',
                paddingTop: 10,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Button
                color="#786cff"
                title="Dismiss"
                onPress={handleOnReject}
              />
              <RedButton label="Accept Request" onPress={handleOnAccept} />
            </View>
          </View>
        </MarginContainer>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="#786cff" />
        </View>
      )}
    </MaxWidth>
  );
};

const ConnectionEvent = styled.Text`
  color: #786cff;
  font-size: 12px;
`;
const ConnectedWhere = styled.Text`
  color: #786cff;
  font-size: 15px;
  font-weight: 600;
`;
const ProfileImageContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
  margin-left: -110px;
  margin-top: 10px;
  width: 100px;
  height: 100px;
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
