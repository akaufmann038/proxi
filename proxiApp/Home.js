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
  SafeAreaView,
} from 'react-native';
import {getFeedHttp, makePostRequest, dates} from './utils.js';
import {EventContext, RegisteredContext} from './App.tsx';

export const Home = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111'; // change this to change accounts - change back to 111
  //const phoneNumber = '(222) 222-2222'
  // TODO: uncomment for production
  //const {phoneNumber} = route.params;
  const [registeredFilter, setRegisteredFilter] = useState(true);
  const [publicFilter, setPublicFilter] = useState(false);
  const [privateFilter, setPrivateFilter] = useState(false);
  const filterFuncs = {
    Registered: val => setRegisteredFilter(val),
    Public: val => setPublicFilter(val),
    Private: val => setPrivateFilter(val),
  };
  const [pressedLast, setPressedLast] = useState('Registered');
  //const [events, setEvents] = useState(null);
  //const [registered, setRegistered] = useState(null);

  const {events, setEvents} = useContext(EventContext);
  const {registered, setRegistered} = useContext(RegisteredContext);

  useEffect(() => {
    const getFeed = async () => {
      // get all events for current user
      try {
        const res = await makePostRequest(getFeedHttp, {
          phoneNumber: phoneNumber,
        });
        const resData = await res.json();

        return resData;
      } catch (err) {
        console.log(err);
      }
    };

    getFeed().then(res => {
      setEvents(res.eventData);
      setRegistered(res.registered);
    });

    console.log('hello events page!');
  }, []);

  const handleFilterPress = pressed => {
    filterFuncs[pressedLast](false);
    filterFuncs[pressed](true);
    setPressedLast(pressed);
  };

  return (
    <SafeAreaView style={{backgroundColor: '#ffffff'}}>
      <MaxWidth>
        <View
          style={{
            zIndex: 1,
            backgroundColor: '#ffffff',
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <PhoneInputWrapper>
              <SearchImage source={require('./assets/search.png')} />
              <PhoneNumber placeholder="Search" />
            </PhoneInputWrapper>
            <ProfileImageContainer>
              <Image
                source={require('./assets/test.png')}
                style={{height: 40, width: 40}}
              />
            </ProfileImageContainer>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10,
              gap: 10,
            }}>
            {registeredFilter ? (
              <FilterButton
                onPress={() => handleFilterPress('Registered')}
                style={{backgroundColor: '#786cff'}}>
                <FilterText style={{color: '#ffffff'}}>Registered</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Registered')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>Registered</FilterText>
              </FilterButton>
            )}
            {publicFilter ? (
              <FilterButton
                onPress={() => handleFilterPress('Public')}
                style={{backgroundColor: '#786cff'}}>
                <FilterText style={{color: '#ffffff'}}>Public</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Public')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>Public</FilterText>
              </FilterButton>
            )}
            {privateFilter ? (
              <FilterButton
                onPress={() => handleFilterPress('Private')}
                style={{backgroundColor: '#786cff'}}>
                <FilterText style={{color: '#ffffff'}}>Private</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Private')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>Private</FilterText>
              </FilterButton>
            )}
          </View>
        </View>
        <ScrollView
          style={{
            height: '100%',
            width: '100%',
            paddingLeft: '7%',
            paddingRight: '7%',
          }}
          contentContainerStyle={{gap: 20}}>
          {registeredFilter && events && registered ? (
            <>
              <SportsEvents>Registered</SportsEvents>
              {events
                .filter(event => registered.includes(event.id))
                .map(event => (
                  <Event
                    eventData={event}
                    key={event.id}
                    navigation={navigation}
                    phoneNumber={phoneNumber}
                  />
                ))}
            </>
          ) : (
            <></>
          )}
          {publicFilter && events && registered ? (
            <>
              <SportsEvents>Public</SportsEvents>
              {events
                .filter(
                  event =>
                    event['public'] == 'true' && !registered.includes(event.id),
                )
                .map(event => (
                  <Event
                    eventData={event}
                    key={event.id}
                    navigation={navigation}
                    phoneNumber={phoneNumber}
                  />
                ))}
            </>
          ) : (
            <></>
          )}
          {privateFilter && events && registered ? (
            <>
              <SportsEvents>Private</SportsEvents>
              {events
                .filter(
                  event =>
                    event['public'] == 'false' &&
                    !registered.includes(event.id),
                )
                .map(event => (
                  <Event
                    eventData={event}
                    key={event.id}
                    navigation={navigation}
                    phoneNumber={phoneNumber}
                  />
                ))}
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </MaxWidth>
    </SafeAreaView>
  );
};

export const Event = ({eventData, navigation, phoneNumber}) => {
  const date = new Date(eventData.date);

  // left off doing dates
  return (
    <EventContainer
      style={{
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 11,
      }}
      onPress={() =>
        navigation.navigate('EventPage', {
          eventId: eventData.id,
          phoneNumber: phoneNumber,
        })
      }>
      <EventImage source={{uri: `data:image/png;base64,${eventData.photo}`}} />
      <View style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
        <EventTitle>{eventData.name}</EventTitle>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <DateComponent
            day={date.getDate()}
            month={dates[date.getMonth()]}
            year={date.getFullYear()}
          />
          <LocationComponent location={eventData.location} />
        </View>
        <DividerImage source={require('./assets/divider.png')} />
        <View style={{flexDirection: 'row', gap: 5}}>
          <HostedByImageContainer>
            <Image
              source={{uri: `data:image/png;base64,${eventData.hostedByImage}`}}
              style={{width: 20, height: 20}}
            />
          </HostedByImageContainer>
          <View>
            <HostedByText>Hosted By</HostedByText>
            <HostNameText>{eventData.hostedBy}</HostNameText>
          </View>
        </View>
      </View>
    </EventContainer>
  );
};

const LocationComponent = ({location}) => {
  return (
    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
      <LocationImage source={require('./assets/location.png')} />
      <LocationText>{location}</LocationText>
    </View>
  );
};
const DateComponent = ({day, month, year}) => {
  return (
    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
      <DateImage source={require('./assets/date.png')} />
      <DateText>{`${day} ${month} ${year}`}</DateText>
    </View>
  );
};

const HostedByText = styled.Text`
  font-size: 12px;
`;
const HostNameText = styled.Text`
  font-size: 12px;
  font-weight: bold;
`;
const HostedByImageContainer = styled.View`
  border-radius: 10px;
  overflow: hidden;
  background-color: lightgray;
  height: 35px;
  width: 35px;
  justify-content: center;
  align-items: center;
`;
const DividerImage = styled.Image`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 10px;
`;
const LocationImage = styled.Image``;
const DateImage = styled.Image``;
const LocationText = styled.Text``;
const DateText = styled.Text``;
const EventTitle = styled.Text`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
`;
const EventImage = styled.Image`
  height: 250px;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
const EventContainer = styled.TouchableOpacity`
  width: 100%;
  height: 360px;
  border-radius: 20px;
  background-color: white;
`;

const SportsEvents = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-top: 10px;
`;
const FilterText = styled.Text`
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #786cff;
  font-size: 12px;
`;
const FilterButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: flex-start;
  border-width: 1px;
  border-radius: 15px;
  border-style: solid;
  border-color: #786cff;
`;
const ProfileImageContainer = styled.View`
  elevation: 2;
  border-radius: 999px;
  overflow: hidden;
  margin-left: 20px;
`;
const ProfileImage = styled.Image``;
const SearchImage = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
`;
const PhoneNumber = styled.TextInput`
  color: #828282;
  font-size: 14px;
`;
const PhoneInputWrapper = styled.View`
  width: 80%;
  height: 40px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: 8px;
  border-color: #000000;
`;
const MarginContainer = styled.View``;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  overflow: visible;
`;
