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
import {Event} from './Home.js';

export const Events = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';

  const {events, setEvents} = useContext(EventContext);
  const {registered, setRegistered} = useContext(RegisteredContext);

  const [registeredFilter, setRegisteredFilter] = useState(true);
  const [publicFilter, setPublicFilter] = useState(false);
  const [privateFilter, setPrivateFilter] = useState(false);
  const filterFuncs = {
    Registered: val => setRegisteredFilter(val),
    Public: val => setPublicFilter(val),
    Private: val => setPrivateFilter(val),
  };
  const [pressedLast, setPressedLast] = useState('Registered');

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
                <FilterText style={{color: '#ffffff'}}>All</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Registered')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>All</FilterText>
              </FilterButton>
            )}
            {publicFilter ? (
              <FilterButton
                onPress={() => handleFilterPress('Public')}
                style={{backgroundColor: '#786cff'}}>
                <FilterText style={{color: '#ffffff'}}>Upcoming</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Public')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>Upcoming</FilterText>
              </FilterButton>
            )}
            {privateFilter ? (
              <FilterButton
                onPress={() => handleFilterPress('Private')}
                style={{backgroundColor: '#786cff'}}>
                <FilterText style={{color: '#ffffff'}}>Past</FilterText>
              </FilterButton>
            ) : (
              <FilterButton
                onPress={() => handleFilterPress('Private')}
                style={{backgroundColor: '#ffffff'}}>
                <FilterText style={{color: '#786cff'}}>Past</FilterText>
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
              <SportsEvents>All</SportsEvents>
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
              <SportsEvents>Upcoming</SportsEvents>
              {events
                .filter(
                  event =>
                    new Date() < new Date(event['date']) &&
                    registered.includes(event.id),
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
                    new Date(event['date']) < new Date() &&
                    registered.includes(event.id),
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
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  overflow: visible;
`;
