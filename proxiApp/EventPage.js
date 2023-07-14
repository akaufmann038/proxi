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
import { NativeModules } from 'react-native';

export const EventPage = ({route, navigation}) => {
  const {eventId, phoneNumber} = route.params;
  const {events, setEvents} = useContext(EventContext);
  const {registered, setRegistered} = useContext(RegisteredContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [eCode, setECode] = useState('');

  // gets the event data for this page
  const eventData = events.filter(event => event.id == eventId).find(x => x);

  const date = new Date(eventData.date);
  const tags = eventData.tags.split(',');

  const handleEnterEvent = () => {
    // TODO: just for testing
    const tempRecommendedPhoneNumbers = ["(222) 222-2222", "(333) 333-3333", "(444) 444-4444"]
    const tempRecommendedUUIDs = tempRecommendedPhoneNumbers.map(element => GenerateUUID(element))
    
    NativeModules.ProximityDetection.initializeProxi(GenerateUUID(phoneNumber),
    recommendedUUIDs = tempRecommendedUUIDs,
    connectionDistance = -75)

    navigation.navigate('EventScreen', {
      eventId: eventId,
      phoneNumber: phoneNumber,
    })
  };

  const handleRegister = async () => {
    if (eventData['public'] == 'true') {
      const result = await makePostRequest(registerUserHttp, {
        phoneNumber: phoneNumber,
        eventId: parseInt(eventData.id),
      });
      const data = await result.json();

      if (data['success']) {
        setRegistered(data['registeredEvents']);
      }
    } else if (eventData['public'] == 'false') {
      setModalVisible(true);
    }
  };

  const handleConfirmEventCode = async () => {
    const result = await makePostRequest(registerUserHttp, {
      phoneNumber: phoneNumber,
      eventId: parseInt(eventData.id),
      eventCode: eCode,
    });
    const data = await result.json();

    if (data['success']) {
      setRegistered(data['registeredEvents']);
      setModalVisible(false);
    } else {
      console.log(data['message']);
    }
  };

  return (
    <MaxWidth>
      <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
        <ModalView>
          <View style={{width: '85%', alignSelf: 'center', marginTop: 20}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <EventCode>Event Code</EventCode>
              <XOutContainer onPress={() => setModalVisible(false)}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
            </View>
            <Text>
              Look for a 6-digit event code in your confimation or scan QR code
            </Text>
            <InputBoxes>
              <TextInput
                placeholder="XXXX"
                keyboardType="numeric"
                onChangeText={text => {
                  if (text.length <= 4) {
                    setECode(text);
                  }
                }}
                value={eCode}
              />
            </InputBoxes>
            <Text
              style={{alignSelf: 'center', marginTop: 20, marginBottom: 10}}>
              OR
            </Text>
            <TouchableOpacity
              onPress={() => console.log('scan qr code!')}
              style={{alignSelf: 'center'}}>
              <Image source={require('./assets/camera.png')} />
            </TouchableOpacity>
            <View style={{alignSelf: 'center', marginTop: 20}}>
              <RedButton onPress={handleConfirmEventCode} label="Confirm" />
            </View>
          </View>
        </ModalView>
      </Modal>
      <BackgroundImageContainer
        source={{uri: `data:image/png;base64,${eventData.photo}`}}>
        <View
          style={{
            width: '100%',
            height: 200,
            backgroundColor: 'black',
            alignItems: 'center',
            opacity: 0.8,
          }}>
          <MarginContainer>
            <View style={{flexDirection: 'column', marginTop: 60}}>
              <BackButton label="back" onPress={() => navigation.goBack()} />
              <TitleText>{eventData.name}</TitleText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <DateImage source={require('./assets/date_light.png')} />
                  <DateText>{`${date.getDate()} ${
                    dates[date.getMonth()]
                  } ${date.getFullYear()}`}</DateText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    marginLeft: '10%',
                  }}>
                  <LocationImage
                    source={require('./assets/location_light.png')}
                  />
                  <LocationText>{eventData.location}</LocationText>
                </View>
              </View>
              <View style={{flexDirection: 'row', gap: 5}}>
                <HostedByImageContainer>
                  <Image
                    source={{
                      uri: `data:image/png;base64,${eventData.hostedByImage}`,
                    }}
                    style={{width: 20, height: 20}}
                  />
                </HostedByImageContainer>
                <View>
                  <HostedByText>Hosted By</HostedByText>
                  <HostNameText>{eventData.hostedBy}</HostNameText>
                </View>
              </View>
            </View>
          </MarginContainer>
        </View>
      </BackgroundImageContainer>
      <MarginContainer>
        <OverviewHeader>Overview</OverviewHeader>
        <RedButton onPress={handleEnterEvent} label="Enter Event" />
        <SummaryText>{eventData.overview}</SummaryText>
        <TagsHeader>Tags</TagsHeader>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10}}>
          {tags.map((element, index) => (
            <TagComponent tagText={element} key={index} />
          ))}
        </View>
        {registered.includes(eventData.id) ? (
          <RedButton onPress={handleEnterEvent} label="Enter Event" />
        ) : (
          <RedButton onPress={handleRegister} label="Register" style={{position: 'absolute', bottom: 0, left: 0}}/>
        )}
      </MarginContainer>
    </MaxWidth>
  );
};

const TagComponent = ({tagText}) => {
  return (
    <TagContainer>
      <TagText># {tagText}</TagText>
    </TagContainer>
  );
};

// converts an integer user_id into a UUID
const GenerateUUID = (phoneNumber) => {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
  const byteString = cleanedPhoneNumber.padStart(32, '0');

  const sections = [
    byteString.substr(0, 8),
    byteString.substr(8, 4),
    byteString.substr(12, 4),
    byteString.substr(16, 4),
    byteString.substr(20, 12)
  ];

  const uuidString = sections.join('-');
  return uuidString;
}

const InputBoxes = styled.View`
  width: 90%;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  padding: 14px;
  border-width: 1px;
  border-radius: 5px;
  border-style: solid;
  border-color: #000000;
  align-self: center;
  margin-top: 30px;
`;
const EventCode = styled.Text`
  color: #786cff;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const XOut = styled.Image`
  width: 27px;
  height: 27px;
`;
const XOutContainer = styled.TouchableOpacity``;
const ModalView = styled.View`
  width: 80%;
  height: 40%;
  margin-top: 50%;
  flex-direction: column;
  align-items: flex-start;
  align-self: center;
  background-color: white;
  border-radius: 15px;
`;
const TagText = styled.Text`
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #786cff;
  font-size: 12px;
`;
const TagContainer = styled.View`
  justify-content: center;
  align-items: flex-start;
  border-width: 1px;
  border-radius: 15px;
  border-style: solid;
  border-color: #786cff;
  max-width: 400px;
`;
const TagsHeader = styled.Text`
  color: #786cff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 10px;
`;
const SummaryText = styled.Text``;
const OverviewHeader = styled.Text`
  color: #786cff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 10px;
`;
const HostNameText = styled.Text`
  color: white;
  font-weight: bold;
`;
const HostedByText = styled.Text`
  color: white;
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
const LocationText = styled.Text`
  color: white;
`;
const LocationImage = styled.Image``;
const DateText = styled.Text`
  color: white;
`;
const DateImage = styled.Image``;
const BackgroundImageContainer = styled.ImageBackground`
  width: 100%;
  height: 400px;
  flex-direction: column;
  align-items: center;
  background-color: 'rgb(255,0,0)';
`;
const TitleText = styled.Text`
  color: white;
  font-weight: bold;
`;
const MarginContainer = styled.View`
  width: 85%;
  height: 100%;
  position: relative;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
`;
