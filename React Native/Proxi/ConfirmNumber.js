import styled from "styled-components/native";
import { useState, useRef } from "react";
import { ContainerRoot } from "./Login.js";
import { verifyCodeHttp, makePostRequest, getCodeHttp } from "./utils.js";
import { Alert } from "react-native";

export const ConfirmNumber = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");
  const inputRef = useRef();

  const onPressGroup2 = () => {
    inputRef.current.focus();
  };

  const onPressConfirm = async () => {
    if (code.length == 4) {
      // send request to verify code with phone number
      console.log("sending: " + String(code));
      const res = await makePostRequest(verifyCodeHttp, {
        phoneNumber: phoneNumber,
        verificationCode: code,
      });
      const mes = await res.json();
      if (mes.success) {
        // navigate to new screen
        navigation.navigate("LetsGetStarted");
      } else {
        // TODO: make customer notifications within the app instead of ugly ass alerts
        Alert.alert("Invalid code");
      }
    }
  };

  // TODO: consider having to wait a certain amount of time in between sending these
  // don't want client to be able to spam it
  const onPressResendCode = async () => {
    await makePostRequest(getCodeHttp, {
      phoneNumber: phoneNumber,
    });
  };

  return (
    <ContainerRoot>
      <ConfirmPhoneDiv>
        <Group1>
          <BackButton onPress={() => navigation.goBack()}>
            <LineImage source={require("./assets/backLine.png")} />
            <ChangeButton>Change #</ChangeButton>
          </BackButton>
        </Group1>
        <Group>
          <ConfirmTitle>Confirm</ConfirmTitle>
          <PhoneVerificationMessage>
            To ensure the security of your account, we need to verify your phone
            number: + 1 {phoneNumber}
          </PhoneVerificationMessage>
        </Group>
        <Group2 onPress={onPressGroup2}>
          <SplitBoxes>
            <SplitBoxText>{code[0] || ""}</SplitBoxText>
          </SplitBoxes>
          <SplitBoxes>
            <SplitBoxText>{code[1] || ""}</SplitBoxText>
          </SplitBoxes>
          <SplitBoxes>
            <SplitBoxText>{code[2] || ""}</SplitBoxText>
          </SplitBoxes>
          <SplitBoxes>
            <SplitBoxText>{code[3] || ""}</SplitBoxText>
          </SplitBoxes>
        </Group2>
        <Group3>
          <FirstRectangle />
          <FirstRectangle />
          <FirstRectangle />
          <FirstRectangle />
        </Group3>
        <TextInputHidden
          value={code}
          onChangeText={setCode}
          maxLength={4}
          ref={inputRef}
        />
        <Group4>
          <ResendCodeButton
            title="Resend Code"
            color="#c4c4c4"
            onPress={onPressResendCode}
          />
          <MediumButton onPress={onPressConfirm}>
            <ConfirmCodeButtonText>Confirm</ConfirmCodeButtonText>
          </MediumButton>
        </Group4>
      </ConfirmPhoneDiv>
    </ContainerRoot>
  );
};

const ConfirmPhoneDiv = styled.View`
  width: 100%;
  position: relative;
  gap: 26px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 18px 359px 18px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const Group1 = styled.View`
  width: 120px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  align-items: flex-start;
  margin: 0px 0px 2px 0px;
  padding: 0px 12px 31px 12px;
  box-sizing: border-box;
`;
const BackButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  left: 0px;
  top: 4px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  padding: 0px;
  padding-top: 12px;
  padding-bottom: 11px;
  border-width: 0px;
  box-sizing: content-box;
  cursor: pointer;
`;

const ChangeButton = styled.Text`
  position: relative;
  color: #bdbdbd;
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
  padding-bottom: 21px;
`;
const LineImage = styled.Image`
  width: 25px;
  min-width: 0px;
  min-height: 0px;
  position: relative;
`;

const Group = styled.View`
  width: 330px;
  position: relative;
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0px 0px 34px 0px;
  box-sizing: border-box;
`;
const ConfirmTitle = styled.Text`
  position: relative;
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  line-height: 35.20000076293945px;
`;
const PhoneVerificationMessage = styled.Text`
  width: 244px;
  position: relative;
  font-size: 12px;
  line-height: 17px;
`;
const Group2 = styled.Pressable`
  width: 229px;
  position: relative;
  gap: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`;
const SplitBoxes = styled.View`
  border-color: #e5e5e5;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
  min-width: 50px;
`;
const SplitBoxText = styled.Text`
  position: relative;
  font-size: 36px;
  font-weight: 500;
  text-align: center;
`;
const Group3 = styled.View`
  width: 229px;
  position: relative;
  gap: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin: 0px 0px 14px 0px;
  box-sizing: border-box;
`;
const FirstRectangle = styled.View`
  width: 50px;
  height: 5px;
  position: relative;
  border-radius: 4px;
  background-color: #d9d9d9;
`;
const TextInputHidden = styled.TextInput`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;
const Group4 = styled.View`
  width: 330px;
  position: relative;
  gap: 53px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
`;
const ResendCodeButton = styled.Button`
  position: relative;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
`;
const MediumButton = styled.TouchableOpacity`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
const ConfirmCodeButtonText = styled.Text`
  position: relative;
  color: #ffffff;
  font-weight: 600;
  line-height: 20px;
`;
