import styled from "styled-components/native";
import { useState } from "react";
import { Alert } from "react-native";
import { makePostRequest, getCodeHttp } from "./utils.js";

export const Login = ({ navigation }) => {
  const [phoneNumber, onChangePhoneNumber] = useState("");

  const onPressConfirmButton = async () => {
    if (phoneNumber.length != 10) {
      Alert.alert("Please enter a valid phone number");
    } else {
      try {
        const res = await makePostRequest(getCodeHttp, {
          phoneNumber: phoneNumber,
        });

        navigation.navigate("ConfirmNumber", {
          phoneNumber: phoneNumber,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <ContainerRoot>
      <SignUpBox>
        <Group>
          <Icon source={require("./assets/p.png")} />
          <Icon1 source={require("./assets/r.png")} />
          <Icon1 source={require("./assets/o.png")} />
          <Icon3 source={require("./assets/x.png")} />
          <Icon4 source={require("./assets/i.png")} />
        </Group>
        <SignUpOrLoginText>
          Sign up or login with your phone #
        </SignUpOrLoginText>
        <PhoneNumberInput>
          <PhoneInputWrapper>
            <CountryCode>+1</CountryCode>
          </PhoneInputWrapper>
          <PhoneNumber
            placeholder="7812010366"
            keyboardType="numeric"
            onChangeText={onChangePhoneNumber}
          />
        </PhoneNumberInput>
        <ConfirmButton onPress={onPressConfirmButton}>
          <ConfirmButtonText>Confirm</ConfirmButtonText>
        </ConfirmButton>
      </SignUpBox>
    </ContainerRoot>
  );
};

export const ContainerRoot = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 69px 0px 0px 0px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #786cff;
  overflow: hidden;
`;

const SignUpBox = styled.View`
  width: 100%;
  position: relative;
  gap: 9px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 167px 30px 59px 30px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const Group = styled.View`
  width: 173px;
  position: relative;
  gap: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0px 0px 110px 0px;
`;

const Icon = styled.Image`
  width: 36px;
  min-width: 0px;
  min-height: 0px;
  position: relative;
  flex-shrink: 0;
  align-self: center;
`;
const Icon1 = styled.Image`
  width: 36px;
  min-width: 0px;
  min-height: 0px;
  position: relative;
  flex-shrink: 0;
`;
const Icon3 = styled.Image`
  width: 36px;
  min-width: 0px;
  min-height: 0px;
  position: relative;
  flex-shrink: 0;
  margin: 0px 4px 0px 0px;
`;
const Icon4 = styled.Image`
  width: 9px;
  min-width: 0px;
  min-height: 0px;
  position: relative;
  flex-shrink: 0;
`;
const SignUpOrLoginText = styled.Text`
  position: relative;
  margin: 0px 0px 11px 0px;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
`;

const PhoneNumberInput = styled.View`
  width: 330px;
  position: relative;
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  align-self: center;
  margin: 0px 0px 11px 0px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: #000000;
  background-color: #ffffff;
  overflow: hidden;
`;
const PhoneInputWrapper = styled.View`
  width: 50px;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: -1px 0px;
  padding: 14px 15px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: #000000;
`;
const CountryCode = styled.Text`
  position: relative;
  line-height: 20px;
`;
const PhoneNumber = styled.TextInput`
  position: relative;
  color: #828282;
  line-height: 20px;
`;
const ConfirmButton = styled.TouchableOpacity`
  width: 190px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 75px 0px;
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
const ConfirmButtonText = styled.Text`
  color: #ffffff;
  font-weight: 600;
`;
