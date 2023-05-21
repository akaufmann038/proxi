import styled from 'styled-components/native';
import {NotCompleted} from './LetsGetStarted.js';
import {
  TouchableWithoutFeedback,
  Text,
  Image,
  ScrollView,
  Modal,
  Button,
  View,
  StyleSheet,
} from 'react-native';
import {AnimatedButton, BackButton, Skill} from './SignupComponents';
import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

export const CreateProfile = ({route, navigation}) => {
  const {phoneNumber, fullName, jobTitle} = route.params;
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [interestsVisible, setInterestsVisible] = useState(false);

  return (
    <MaxWidth>
      <HeaderNav>
        <BackButton label="Change" onPress={() => navigation.goBack()} />
        <NotCompleted>
          <Completed />
        </NotCompleted>
      </HeaderNav>
      <ModalContainer
        visible={skillsVisible}
        transparent={true}
        animationType={'fade'}>
        <ModalView>
          <Text>Hello World</Text>
          <Button title="close" onPress={() => setSkillsVisible(false)} />
        </ModalView>
      </ModalContainer>
      <TouchableWithoutFeedback>
        <CreateProfileLabel>Create Profile</CreateProfileLabel>
      </TouchableWithoutFeedback>
      <UploadImage />
      <UserFullName>{fullName}</UserFullName>
      <UserMajor>{jobTitle}</UserMajor>
      <ScrollView
        style={{height: '20%', width: '100%'}}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 30,
          paddingTop: 30,
          paddingRight: 30,
          paddingBottom: 0,
          paddingLeft: 30,
        }}>
        <CompanyLabel>Company</CompanyLabel>
        <InputBoxes>
          <UniversityInput placeholder="Northeastern University" />
        </InputBoxes>
        <LocationLabel>Location</LocationLabel>
        <InputBoxes>
          <JobInput placeholder="Boston, MA" />
        </InputBoxes>
        <LocationLabel>Recommended Skills</LocationLabel>
        <SkillsContainer>
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
        </SkillsContainer>
        <ViewMoreContainer onPress={() => setSkillsVisible(true)}>
          <ViewMore>View More</ViewMore>
          <ViewMoreLine source={require('./assets/ViewMore.png')} />
        </ViewMoreContainer>
        <LocationLabel>Recommended Interests</LocationLabel>
        <SkillsContainer>
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
          <Skill skillName="Valuation" />
        </SkillsContainer>
      </ScrollView>
    </MaxWidth>
  );
};

const UploadImage = () => {
  const [image, setImage] = useState(null);

  const addImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel) {
      // TODO: this needs to access actual picture from library instead of just
      // the placeholder picture
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageContainer>
      {image && (
        <Image
          source={require('./assets/test.png')}
          style={{width: 200, height: 200}}
        />
      )}
      <UploadBtnContainer>
        <UploadBtn onPress={addImage}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
        </UploadBtn>
      </UploadBtnContainer>
    </ImageContainer>
  );
};
const ModalView = styled.View`
  width: 80%;
  height: 80%;
  margin-top: 30%;
  flex-direction: column;
  align-items: flex-start;
  align-self: center;
  background-color: grey;
`;
const ModalContainer = styled.Modal`
  margin-left: 50px;
  margin-right: 50px;
`;
const ViewMoreContainer = styled.TouchableOpacity`
  margin-top: -10px;
`;
const ViewMoreLine = styled.Image``;
const ViewMore = styled.Text``;
const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;
const UniversityInput = styled.TextInput``;
const JobInput = styled.TextInput``;
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
`;
const LocationLabel = styled.Text`
  align-self: flex-start;
  margin-bottom: -20px;
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
`;
const CompanyLabel = styled.Text`
  align-self: flex-start;
  margin-bottom: -20px;
  color: #786cff;
  font-weight: 600;
  font-size: 20px;
`;
const UserMajor = styled.Text`
  align-self: center;
  color: #828282;
  font-size: 13px;
  margin-bottom: 5px;
`;
const UserFullName = styled.Text`
  align-self: center;
  margin-bottom: -15px;
  color: #828282;
  font-size: 20px;
`;
const UploadBtn = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const UploadBtnContainer = styled.View`
  opacity: 0.7;
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: lightgrey;
  width: 100%;
  height: 25%;
`;
const ImageContainer = styled.View`
  elevation: 2;
  height: 200px;
  width: 200px;
  background-color: #efefef;
  position: relative;
  border-radius: 999px;
  overflow: hidden;
`;
const CreateProfileLabel = styled.Text`
  position: relative;
  align-self: center;
  margin: 0px 0px 6px 0px;
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  line-height: 35.20000076293945px;
  text-align: center;
`;
const Completed = styled.View`
  width: 75%%;
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
  gap: 30px;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;
const HeaderNav = styled.View`
  width: 100%;
  height: 100px;
  position: relative;
  gap: 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-self: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
`;
const ProfileRootRoot = styled.View`
  position: relative;
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
