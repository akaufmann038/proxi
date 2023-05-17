import styled from 'styled-components/native';
import {
  MaxWidth,
  HeaderNav,
  NotCompleted,
  ProfileRootRoot,
} from './LetsGetStarted.js';
import {TouchableWithoutFeedback, Text} from 'react-native';
import {AnimatedButton, BackButton} from './SignupComponents';
import {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const CreateProfile = ({route, navigation}) => {
  const {phoneNumber} = route.params;

  return (
    <ProfileRootRoot>
      <MaxWidth>
        <HeaderNav>
          <BackButton label="Change Info" onPress={() => navigation.goBack()} />
          <NotCompleted>
            <Completed />
          </NotCompleted>
        </HeaderNav>
        <TouchableWithoutFeedback>
          <CreateProfileLabel>Create Profile</CreateProfileLabel>
        </TouchableWithoutFeedback>
        <UploadImage />
      </MaxWidth>
    </ProfileRootRoot>
  );
};

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const addImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    console.log(result);
  };

  return (
    <ImageContainer>
      <UploadBtnContainer>
        <UploadBtn onPress={addImage}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
        </UploadBtn>
      </UploadBtnContainer>
    </ImageContainer>
  );
};
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
