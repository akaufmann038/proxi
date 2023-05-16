import { Text, TouchableWithoutFeedback, Button } from "react-native";
import { useState, useRef } from "react";
import styled from "styled-components/native";
import { AnimatedButton, BackButton } from "./SignupComponents";

export const LetsGetStarted = ({ navigation }) => {
  const onPressConfirmBtn = () => {};
  const nameInputRef = useRef();
  const jobInputRef = useRef();
  const [nameInFocus, setNameInFocus] = useState(false);
  const [jobInFocus, setJobInFocus] = useState(false);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  // this ensures that the placeholder text reapears when the input text box
  // is unfocused, only if the user has no entered any text into it
  const InputConditional = ({ isInFocus, inputName, inputVariable }) => {
    // not in focus and no input => job title
    // in focus or is input
    if (!isInFocus && inputVariable == "") {
      return (
        <>
          {inputName}
          <TextInput>*</TextInput>
        </>
      );
    } else {
      return <></>;
    }
  };

  const handleNameTextChange = (text) => {
    setName(text);
  };

  const handleJobTitleTextChange = (text) => {
    setJobTitle(text);
  };

  return (
    <ProfileRootRoot>
      <MaxWidth>
        <HeaderNav>
          <BackButton 
              label="Change #"
              onPress={() => navigation.goBack()}
          />
          <NotCompleted>
            <Completed />
          </NotCompleted>
        </HeaderNav>

        <GetStartedHeader>Let's get started!</GetStartedHeader>
        <VisibilityInfo>
          This information will be visible to other attendees at events around you
        </VisibilityInfo>
        <TouchableWithoutFeedback onPress={() => nameInputRef.current.focus()}>
          <JobTitleBox>
            <FullNameInput
              ref={nameInputRef}
              onFocus={() => setNameInFocus(true)}
              onBlur={() => setNameInFocus(false)}
              value={name}
              onChangeText={handleNameTextChange}
            >
              <InputConditional
                isInFocus={nameInFocus}
                inputName={"Full Name"}
                inputVariable={name}
              />
            </FullNameInput>
          </JobTitleBox>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => jobInputRef.current.focus()}>
          <JobTitleBox>
            <FullNameInput
              ref={jobInputRef}
              onFocus={() => setJobInFocus(true)}
              onBlur={() => setJobInFocus(false)}
              value={jobTitle}
              onChangeText={handleJobTitleTextChange}
            >
              <InputConditional
                isInFocus={jobInFocus}
                inputName={"Job Title"}
                inputVariable={jobTitle}
              />
            </FullNameInput>
          </JobTitleBox>
        </TouchableWithoutFeedback>
        <Footer>
          <BackButtonFooter onPress={() => navigation.goBack()}>
            <BackCodeButtonText>Back</BackCodeButtonText>
          </BackButtonFooter>
          <AnimatedButton
            onPress={onPressConfirmBtn}
            active="1"
            label="Confirm"
          />
        </Footer>
      </MaxWidth>
    </ProfileRootRoot>
  );
};

const MaxWidth = styled.View`
  width: 100%;
  max-width: 390px;
  height: 100%;
  gap: 30px;
  flex-direction: column;
  padding: 30px 30px 0px 30px;
  align-items: center;
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
`;

const NotCompleted = styled.View`
  flex: 1;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background-color: #d9d9d9;
`;

const Completed = styled.View`
  width: 33%;
  height: 6px;
  position: relative;
  border-radius: 10px;
  background-color: #786cff;
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
  width: 100%;
  max-width: 300px;
  position: relative;
  gap: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-center;
  justify-content: flex-end;

`;
const JobTitleBox = styled.View`
  width: 300px;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 14px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: #000000;
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
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
`;

const GetStartedHeader = styled.Text`
  position: relative;
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  line-height: 35.20000076293945px;
  text-align: center;
`;



const BackButtonFooter = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  padding-top: 16px;
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
  border-radius: 8px;
`;

const BackCodeButtonText = styled.Text`
  color: #c4c4c4;
  font-weight: 600;
  line-height: 20px;
`;