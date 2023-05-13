import { Text } from "react-native";
import styled from "styled-components/native";
import { BackButton, LineImage } from "./ConfirmNumber.js";

export const LetsGetStarted = ({ navigation }) => {
  const onPressConfirmBtn = () => {};

  return (
    <ProfileRootRoot>
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
      <GetStartedHeader>Let's get started!</GetStartedHeader>
      <VisibilityInfo>
        This information will be visible to other attendees at events around you
      </VisibilityInfo>
      <NameBox>
        <FullNameInput>
          Full Name<TextInput>*</TextInput>
        </FullNameInput>
      </NameBox>
      <JobTitleBox>
        <FullNameInput>
          Job Title<TextInput>*</TextInput>
        </FullNameInput>
      </JobTitleBox>
      <Group>
        <Footer>
          <BackBtnFooter
            title="back"
            color="#c4c4c4"
            onPress={() => navigation.goBack()}
          />
          <FooterButton>
            <ConfirmBtn onPress={onPressConfirmBtn}>Confirm</ConfirmBtn>
          </FooterButton>
        </Footer>
      </Group>
    </ProfileRootRoot>
  );
};
const ConfirmBtn = styled.Text`
  position: relative;
  color: #ffffff;
  font-weight: 600;
  line-height: 20px;
`;
const FooterButton = styled.TouchableOpacity`
  height: 60%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  padding-top: 16px;
  padding-right: 61px;
  padding-bottom: 16px;
  padding-left: 61px;
  border-width: 0px;
  border-radius: 8px;
  box-sizing: content-box;
  background-color: #ff5a5f;
  overflow: hidden;
  cursor: pointer;
`;
const BackBtnFooter = styled.Button`
  position: relative;
  color: #c4c4c4;
  font-size: 13px;
  font-family: Poppins;
  line-height: 17px;
  text-align: center;
  box-sizing: border-box;
`;
const Footer = styled.View`
  width: 330px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
`;
const Group = styled.View`
  width: 330px;
  position: relative;
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
`;
const JobTitleBox = styled.View`
  width: 330px;
  height: 50px;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0px 0px 1px 0px;
  padding: 14px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: #000000;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
const TextInput = styled.Text`
  color: #ff5a5f;
  line-height: 20px;
`;
const FullNameInput = styled.TextInput`
  position: relative;
  justify-content: flex-start;
  color: #828282;
  line-height: 20px;
`;
const NameBox = styled.View`
  width: 330px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0px 0px 3px 0px;
  padding: 14px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: #000000;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
const VisibilityInfo = styled.Text`
  width: 260px;
  position: relative;
  margin: 0px 0px 20px 0px;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
`;
const ProfileRootRoot = styled.View`
  position: relative;
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 46px 14px 314px 14px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;
const Group1 = styled.View`
  width: 93.65%;
  position: relative;
  gap: 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-self: flex-start;
  align-items: center;
  margin: 0px 0px 29px 0px;
  box-sizing: border-box;
`;
const Group2 = styled.View`
  width: 14.16%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 0px 1px 39px 1px;
  box-sizing: border-box;
`;
const NotCompleted = styled.View`
  width: 80.53%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-end;
  align-items: flex-start;
  margin: 0px 0px 22px 0px;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #d9d9d9;
`;
const Completed = styled.View`
  width: 66px;
  height: 6px;
  position: relative;
  flex-shrink: 0;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #786cff;
`;
const GetStartedHeader = styled.Text`
  position: relative;
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  line-height: 35.20000076293945px;
  text-align: center;
`;
