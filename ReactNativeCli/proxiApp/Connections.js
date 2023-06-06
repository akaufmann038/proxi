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
import {
  getFeedHttp,
  makePostRequest,
  dates,
  getConnectionsAllHttp,
  queryHashDataHttp,
} from './utils.js';
import {
  EventContext,
  RegisteredContext,
  ConnectionsContext,
  PendingConnectionsContext,
} from './App.tsx';
import {Profile} from './Profile.js';

export const Connections = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';
  const {connections, setConnections} = useContext(ConnectionsContext);
  const {pendingConnections, setPendingConnections} = useContext(
    PendingConnectionsContext,
  );
  const [connectionData, setConnectionData] = useState(null); // { user,{id}: [value, value...] }

  useEffect(() => {
    const getConnections = async () => {
      // get all connections and connection requests for this user
      try {
        const res = await makePostRequest(getConnectionsAllHttp, {
          phoneNumber: phoneNumber,
        });

        const resData = await res.json();

        let hashData = {};
        for (const key of Object.keys(resData.connectionRequests)) {
          hashData['user,' + key] = ['photo', 'fullName'];
          hashData['event,' + resData.connectionRequests[key]] = ['name'];
        }

        for (const key of Object.keys(resData.connections)) {
          hashData['user,' + key] = ['photo', 'fullName'];
          hashData['event,' + resData.connections[key]] = ['name'];
        }

        const res2 = await makePostRequest(queryHashDataHttp, {
          // TODO: get profile picture, name
          hashData: hashData,
        });

        const userData = await res2.json();

        return [resData, userData];
      } catch (err) {
        console.log(err);
      }
    };

    getConnections().then(res => {
      setConnections(res[0].connections);
      setPendingConnections(res[0].connectionRequests);
      setConnectionData(res[1].hashData);
    });

    console.log('welcome to connections page');
  }, []);

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
              +
              {pendingConnections ? (
                Object.keys(pendingConnections).length
              ) : (
                <></>
              )}
            </Text>
          </View>
          <ViewRequestsText>
            View all{' '}
            {pendingConnections ? (
              Object.keys(pendingConnections).length
            ) : (
              <></>
            )}{' '}
            requests
          </ViewRequestsText>
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
          {connectionData ? (
            Object.keys(connections).map(connectionUserId => (
              <Connection
                navigation={navigation}
                name={connectionData['user,' + connectionUserId][1]}
                event={
                  connectionData['event,' + connections[connectionUserId]][0]
                }
                photo={connectionData['user,' + connectionUserId][0]}
                userId={connectionUserId}
                key={connectionUserId}
              />
            ))
          ) : (
            <></>
          )}
        </ScrollView>
      </MarginContainer>
    </MaxWidth>
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
