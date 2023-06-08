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
} from './utils.js';
import {
  EventContext,
  RegisteredContext,
  ConnectionsContext,
  PendingConnectionsContext,
} from './App.tsx';
import {Profile} from './ShowProfile.js';
import {BackButton} from './SignupComponents.js';

export const ShowProfile = ({route, navigation}) => {
  const links = {
    linkResume: {
      color: '#0072B1',
      title: 'Linkedin',
      iconSource: require('./assets/linkedin.png'),
      textColor: 'white',
    },
    linkInstagram: {
      color: 'rgba(186,120,237,1)',
      title: 'Instagram',
      iconSource: require('./assets/instagram.png'),
      textColor: 'white',
    },
    linkLinkedin: {
      color: '#0072B1',
      title: 'Linkedin',
      iconSource: require('./assets/linkedin.png'),
      textColor: 'white',
    },
    linkGithub: {
      color: 'black',
      title: 'GitHub',
      iconSource: require('./assets/github.png'),
      textColor: 'white',
    },
    linkDropbox: {
      color: '#0060FF',
      title: 'DropBox',
      iconSource: require('./assets/dropbox.png'),
      textColor: 'white',
    },
    linkMedium: {
      color: 'black',
      title: 'Medium',
      iconSource: require('./assets/medium.png'),
      textColor: 'white',
    },
    linkFacebook: {
      color: '#385C8E',
      title: 'Facebook',
      iconSource: require('./assets/facebook.png'),
      textColor: 'white',
    },
    linkTiktok: {
      color: 'grey',
      title: 'Tiktok',
      iconSource: require('./assets/tiktok.png'),
      textColor: 'white',
    },
  };

  const {userId} = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [phoneModalVisible, setPhoneVisible] = useState(false);
  const [emailModalVisible, setEmailVisible] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await makePostRequest(getProfileHttp, {
          userId: userId,
        });

        const data = res.json();

        return data;
      } catch (err) {
        console.log(err);
      }
    };

    getProfile().then(res => {
      setUserProfile(res.userProfile);
    });
  }, []);

  return (
    <MaxWidth
      style={{opacity: phoneModalVisible || emailModalVisible ? 0.3 : 1}}>
      {userProfile ? (
        <MarginContainer>
          <Modal
            visible={phoneModalVisible}
            transparent={true}
            animationType={'none'}>
            <ModalView>
              <XOutContainer onPress={() => setPhoneVisible(false)}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <DataContainer>
                <Text style={{marginLeft: 25, color: 'grey'}}>
                  +1 {userProfile['phoneNumber']}
                </Text>
              </DataContainer>
            </ModalView>
          </Modal>
          <Modal
            visible={emailModalVisible}
            transparent={true}
            animationType={'none'}>
            <ModalView>
              <XOutContainer onPress={() => setEmailVisible(false)}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <DataContainer>
                <Text style={{marginLeft: 25, color: 'grey'}}>
                  {userProfile['email']}
                </Text>
              </DataContainer>
            </ModalView>
          </Modal>
          <View
            style={{
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <BackButton label="back" onPress={() => navigation.goBack()} />
            <View style={{flexDirection: 'row', gap: 25}}>
              <PhoneContainer onPress={() => setPhoneVisible(true)}>
                <Image source={require('./assets/phone.png')} />
              </PhoneContainer>
              <EmailContainer onPress={() => setEmailVisible(true)}>
                <Image source={require('./assets/email.png')} />
              </EmailContainer>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              gap: -5,
            }}>
            <ProfileImageContainer>
              <Image
                source={{
                  uri: `data:image/png;base64,${userProfile['photo']}`,
                }}
                style={{height: 90, width: 90}}
              />
            </ProfileImageContainer>
            <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
              <Text style={{color: '#828282', fontSize: 25, fontWeight: 800}}>
                {userProfile['fullName']}
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Image source={require('./assets/jobTitle.png')} />
                <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                  {userProfile['jobTitle']}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Image source={require('./assets/jobTitle.png')} />
                <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                  {userProfile['company']}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <Text
              style={{
                marginTop: 40,
                color: '#828282',
                fontSize: 25,
                fontWeight: 700,
                marginBottom: 5,
              }}>
              Biography
            </Text>
            <Text style={{color: '#828282', fontWeight: 500}}>
              {userProfile['biography']}
            </Text>
            <Text
              style={{
                color: '#828282',
                fontSize: 25,
                fontWeight: 700,
                marginTop: 30,
              }}>
              {userProfile['fullName'].split(' ')[0]}'s Skills
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
              {userProfile['skills'].split(',').map(skill => (
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
              {userProfile['fullName'].split(' ')[0]}'s Interests
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
              {userProfile['interests'].split(',').map(interest => (
                <Skill name={interest} />
              ))}
            </View>
            <Text
              style={{
                color: '#828282',
                fontSize: 20,
                fontWeight: 400,
                marginTop: 30,
              }}>
              More Information
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 10,
              }}>
              {Object.keys(links).map(link => {
                if (userProfile[link] == '') {
                  return <></>;
                }

                return (
                  <ViewAccount
                    color={links[link]['color']}
                    title={links[link]['title']}
                    iconSource={links[link]['iconSource']}
                    textColor={links[link]['textColor']}
                    link={userProfile[link]}
                  />
                );
              })}
            </View>
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

const ViewAccount = ({color, link, iconSource, textColor, title}) => {
  const [isVisible, setIsVisible] = useState(false);

  const Container = styled.TouchableOpacity`
    width: 110px;
    height: 50px;
    border-radius: 10px;
    background-color: grey;
    justify-content: center;
    align-items: center;
  `;
  const ModalView = styled.View`
    width: 80%;
    height: 15%;
    margin-top: 70%;
    background-color: white;
    align-self: center;
    border-radius: 10px;
    elevation: 5;
    shadow-radius: 10px;
    shadow-opacity: 0.5;
  `;
  const AccountText = styled.Text``;
  const Icon = styled.Image``;
  const XOutContainer = styled.TouchableOpacity`
    align-self: flex-end;
  `;
  const XOut = styled.Image`
    width: 27px;
    height: 27px;
  `;
  const InstructionText = styled.Text`
    align-self: center;
    margin-bottom: 20px;
  `;
  const InputBoxes = styled.View`
    width: 80%;
    height: 50px;
    flex-direction: column;
    justify-content: center;
    padding: 14px;
    border-width: 1px;
    border-radius: 5px;
    border-style: solid;
    border-color: #000000;
    background-color: #ffffff;
    margin-bottom: 20px;
    align-self: center;
  `;

  return (
    <Container
      style={{backgroundColor: color}}
      onPress={() => setIsVisible(true)}>
      <Modal visible={isVisible} transparent={true} animationType={'fade'}>
        <ModalView>
          <XOutContainer onPress={() => setIsVisible(false)}>
            <XOut source={require('./assets/x_out.png')} />
          </XOutContainer>
          {<InstructionText>Link</InstructionText>}
          <InputBoxes>
            <Text>{link}</Text>
          </InputBoxes>
        </ModalView>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          gap: 10,
        }}>
        <Icon source={iconSource} />
        <AccountText style={{color: textColor}}>{title}</AccountText>
      </View>
    </Container>
  );
};

const Skill = ({name}) => {
  const SkillContainer = styled.View`
    justify-content: center;
    align-items: flex-start;
    border-width: 1px;
    border-radius: 15px;
    border-style: solid;
    border-color: #786cff;
  `;

  const SkillText = styled.Text`
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #786cff;
    font-size: 16px;
  `;

  return (
    <SkillContainer>
      <SkillText>{name}</SkillText>
    </SkillContainer>
  );
};

const ProfileImageContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
`;
const DataContainer = styled.View`
  border-width: 0.4px;
  border-radius: 10px;
  height: 55px;
  width: 80%;
  align-self: center;
  margin-top: 20px;
  justify-content: center;
`;
const XOutContainer = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: 5px;
  margin-right: 5px;
`;
const XOut = styled.Image`
  width: 27px;
  height: 27px;
`;
const ModalView = styled.View`
  width: 80%;
  height: 15%;
  margin-top: 70%;
  background-color: white;
  align-self: center;
  border-radius: 10px;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
`;
const EmailContainer = styled.TouchableOpacity`
  border-radius: 5px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;
const PhoneContainer = styled.TouchableOpacity`
  border-radius: 5px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;
const MarginContainer = styled.View`
  width: 85%;
`;
