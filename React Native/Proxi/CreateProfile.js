import styled from "styled-components/native";
import {
  Group1,
  Group2,
  BackButton,
  LineImage,
  NotCompleted,
} from "./LetsGetStarted.js";
import { TouchableWithoutFeedback } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export const CreateProfile = ({ route, navigation }) => {
  const { phoneNumber } = route.params;

  return (
    <CreateProfileRootRoot>
      <FixedProfileDiv>
        <Group1>
          <Group2>
            <BackButton onPress={() => navigation.goBack()}>
              <LineImage source={require("./assets/backLine.png")} />
            </BackButton>
          </Group2>
          <NotCompleted>
            <Completed />
          </NotCompleted>
        </Group1>
        <TouchableWithoutFeedback>
          <CreateProfileLabel>Create Profile</CreateProfileLabel>
        </TouchableWithoutFeedback>
        <ProfileImage />
      </FixedProfileDiv>
    </CreateProfileRootRoot>
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
const FixedProfileDiv = styled.View`
  width: 100%;
  position: relative;
  gap: 7px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-self: center;
  margin: 0px 0px 9px 0px;
  padding: 46px 14px 12px 14px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
const CreateProfileRootRoot = styled.View`
  position: relative;
  gap: 9px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
