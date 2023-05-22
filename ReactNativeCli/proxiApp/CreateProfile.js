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
import {RedButton, BackButton, Skill, SIModal} from './SignupComponents';
import {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  skills,
  interests,
  recommendedInterests,
  recommendedSkills,
} from './utils.js';

export const CreateProfile = ({route, navigation}) => {
  const {phoneNumber, fullName, jobTitle} = route.params;
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [interestsVisible, setInterestsVisible] = useState(false);
  const [allSkills, setSkills] = useState(null);
  const [allInterests, setInterests] = useState(null);

  // TODO: this will become api request for skills and interests
  // stored in database
  // TODO: make sure data from database has some kind of id and
  // use it in the .map()
  useEffect(() => {
    let reformatSkills = {};
    let reformatInterests = {};

    skills.forEach(element => {
      reformatSkills[element.name] = {active: false, id: element.id};
    });
    interests.forEach(element => {
      reformatInterests[element.name] = {active: false, id: element.id};
    });

    setSkills(reformatSkills);
    setInterests(reformatInterests);
  }, []);

  return (
    <MaxWidth>
      <HeaderNav>
        <BackButton label="Change" onPress={() => navigation.goBack()} />
        <NotCompleted>
          <Completed />
        </NotCompleted>
      </HeaderNav>
      <SIModal
        data={allSkills}
        setData={setSkills}
        header="Skills"
        subheader="Adding more skills will help you connect with more people!"
        isVisible={skillsVisible}
        setIsVisible={setSkillsVisible}
        recommendedElements={recommendedSkills}
      />
      <SIModal
        data={allInterests}
        setData={setInterests}
        header="Interests"
        subheader="Adding more interests will help you connect with more people!"
        isVisible={interestsVisible}
        setIsVisible={setInterestsVisible}
        recommendedElements={recommendedInterests}
      />
      <CreateProfileLabel>Create Profile</CreateProfileLabel>
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
          {allSkills ? (
            Object.keys(allSkills)
              .filter(element =>
                recommendedSkills.includes(allSkills[element].id),
              )
              .map(skill => (
                <Skill
                  skillName={skill}
                  skillData={allSkills}
                  setSkillData={setSkills}
                  key={allSkills[skill].id}
                />
              ))
          ) : (
            <></>
          )}
        </SkillsContainer>
        <ViewMoreContainer onPress={() => setSkillsVisible(true)}>
          <ViewMore>View More</ViewMore>
          <ViewMoreLine source={require('./assets/ViewMore.png')} />
        </ViewMoreContainer>
        <LocationLabel>Recommended Interests</LocationLabel>
        <SkillsContainer>
          {allInterests ? (
            Object.keys(allInterests)
              .filter(element =>
                recommendedInterests.includes(allInterests[element].id),
              )
              .map(interest => (
                <Skill
                  skillName={interest}
                  skillData={allInterests}
                  setSkillData={setInterests}
                  key={allInterests[interest].id}
                />
              ))
          ) : (
            <></>
          )}
        </SkillsContainer>
        <ViewMoreContainer
          style={{marginBottom: 30}}
          onPress={() => setInterestsVisible(true)}>
          <ViewMore>View More</ViewMore>
          <ViewMoreLine source={require('./assets/ViewMore.png')} />
        </ViewMoreContainer>
      </ScrollView>
      <View style={{marginBottom: 30, marginTop: 20}}>
        <RedButton label="Confirm" />
      </View>
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
          style={{width: 150, height: 150}}
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
`;
const UserFullName = styled.Text`
  align-self: center;
  color: #828282;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
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
  height: 150px;
  width: 150px;
  background-color: #efefef;
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 12px;
`;
const CreateProfileLabel = styled.Text`
  align-self: center;
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
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
