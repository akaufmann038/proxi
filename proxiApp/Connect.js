import styled from 'styled-components/native';
import {BackButton, AddAccount, RedButton} from './SignupComponents.js';
import {NotCompleted} from './LetsGetStarted.js';
import {useState} from 'react';
import {View, TouchableOpacity, Touchable} from 'react-native';
import {makePostRequest, registerFullUserHttp} from './utils.js';

export const Connect = ({route, navigation}) => {
  const {
    phoneNumber,
    fullName,
    jobTitle,
    company,
    location,
    skills,
    interests,
  } = route.params;
  const [email, setEmail] = useState('');
  const [sharePhone, setSharePhone] = useState(false);
  const [links, setLinks] = useState({
    Resume: '',
    Linkedin: '',
    GitHub: '',
    DropBox: '',
    Medium: '',
    Facebook: '',
    Instagram: '',
    Tiktok: '',
  });

  const handleOnConfirm = async () => {
    // send api request to register user
    try {
      let finalSkills = [];
      let finalInterests = [];

      for (const skill of Object.keys(skills)) {
        if (skills[skill]['active']) {
          finalSkills.push(skill);
        }
      }
      for (const interest of Object.keys(interests)) {
        if (interests[interest]['active']) {
          finalInterests.push(interest);
        }
      }
      console.log(String(finalSkills));
      console.log(String(finalInterests));

      // TODO: uncomment this for production and add photo
      /*
      const res = await makePostRequest(registerFullUserHttp, {
        phoneNumber: phoneNumber,
        fullName: fullName,
        jobTitle: jobTitle,
        company: company,
        location: location,
        email: email,
        sharePhone: sharePhone,
        links: links,
        biography: "",
        skills: finalSkills,
        interests: finalInterests
      });

      const message = await res.json();

      if (message.success) {
        // navigate to events page just passing phone number
        navigation.navigate('Events', {
          phoneNumber: phoneNumber,
        });
      }
      */

      navigation.navigate('BottomNavigator', {
        phoneNumber: phoneNumber,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MaxWidth>
      <HeaderNav>
        <BackButton label="Change" onPress={() => navigation.goBack()} />
        <NotCompleted>
          <Completed />
        </NotCompleted>
      </HeaderNav>
      <ConnectText>Connect📲</ConnectText>
      <InfoText>
        Add any profiles you want to share with your new connections!
      </InfoText>
      <MarginContainer>
        <SubHeader>E-mail (optional)</SubHeader>
        <InputBoxes>
          <EmailInput
            placeholder="mail@yourdomain.com"
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </InputBoxes>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 40,
          }}>
          <SharePhone>Share Phone #</SharePhone>
          <View style={{flexDirection: 'column', width: '40%'}}>
            <NoYesContainer>
              <TouchableOpacity onPress={() => setSharePhone(false)}>
                <NoText>NO</NoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSharePhone(true)}>
                <YesText>YES</YesText>
              </TouchableOpacity>
            </NoYesContainer>
            <YesNoLine>
              {sharePhone ? <YesNoSelectedRight /> : <YesNoSelectedLeft />}
            </YesNoLine>
          </View>
        </View>
        <Productivity>Productivity</Productivity>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
          <AddAccount
            color="#A59DFF"
            title="Resume"
            iconSource={require('./assets/resume.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="#0072B1"
            title="Linkedin"
            iconSource={require('./assets/linkedin.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="black"
            title="GitHub"
            iconSource={require('./assets/github.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="#0060FF"
            title="DropBox"
            iconSource={require('./assets/dropbox.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="black"
            title="Medium"
            iconSource={require('./assets/medium.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
        </View>
        <Socials>Socials</Socials>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
          <AddAccount
            color="#385C8E"
            title="Facebook"
            iconSource={require('./assets/facebook.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="rgba(186,120,237,1)"
            title="Instagram"
            iconSource={require('./assets/instagram.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="grey"
            title="Tiktok"
            iconSource={require('./assets/tiktok.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
          <AddAccount
            color="black"
            title="Medium"
            iconSource={require('./assets/medium.png')}
            textColor="white"
            links={links}
            setLinks={setLinks}
          />
        </View>
      </MarginContainer>
      <View
        style={{
          bottom: 0,
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          marginBottom: 30,
          marginTop: 20,
        }}>
        <RedButton label="Confirm" onPress={handleOnConfirm} />
      </View>
    </MaxWidth>
  );
};
const Socials = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 20px;
`;
const Productivity = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 30px;
`;
const YesNoSelectedRight = styled.View`
  width: 50%;
  height: 6px;
  border-radius: 10px;
  background-color: #786cff;
  align-self: flex-end;
`;
const YesNoSelectedLeft = styled.View`
  width: 50%;
  height: 6px;
  border-radius: 10px;
  background-color: #786cff;
  align-self: flex-start;
`;
const YesNoLine = styled.View`
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background-color: #d9d9d9;
  margin-top: 5px;
`;
const NoYesContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
const YesText = styled.Text`
  color: grey;
  font-size: 20px;
  margin-right: 20px;
`;
const NoText = styled.Text`
  color: grey;
  font-size: 20px;
  margin-left: 20px;
`;
const MarginContainer = styled.View`
  width: 85%;
`;
const SharePhone = styled.Text`
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
`;
const EmailInput = styled.TextInput``;
const InputBoxes = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  padding: 14px;
  border-width: 1px;
  border-radius: 5px;
  border-style: solid;
  border-color: #000000;
  background-color: #ffffff;
  margin-top: 10px;
`;
const SubHeader = styled.Text`
  align-self: flex-start;
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
`;
const InfoText = styled.Text`
  width: 60%;
  text-align: center;
  margin-bottom: 20px;
`;
const ConnectText = styled.Text`
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
`;
const Completed = styled.View`
  width: 95%;
  height: 6px;
  position: relative;
  flex-shrink: 0;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #786cff;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;
const HeaderNav = styled.View`
  width: 100%;
  height: 100px;
  gap: 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-self: flex-start;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
`;
