import styled from "styled-components/native";
import {
  MaxWidth,
  HeaderNav,
  NotCompleted,
  ProfileRootRoot,
} from "./LetsGetStarted.js";
import { TouchableWithoutFeedback } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { AnimatedButton, BackButton } from "./SignupComponents";

export const CreateProfile = ({ route, navigation }) => {
  const { phoneNumber } = route.params;

  return (
    <ProfileRootRoot>
      <MaxWidth>
        <HeaderNav>
          <BackButton label="Change #" onPress={() => navigation.goBack()} />
          <NotCompleted>
            <Completed />
          </NotCompleted>
        </HeaderNav>
        <TouchableWithoutFeedback>
          <CreateProfileLabel>Create Profile</CreateProfileLabel>
        </TouchableWithoutFeedback>
        <ProfileImage />
      </MaxWidth>
    </ProfileRootRoot>
  );
};
const ProfileImage = styled.Image`
  min-width: 0px;
  min-height: 0px;
  position: relative;
  align-self: center;
  margin: 0px 0px 12px 0px;
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
