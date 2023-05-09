import styled from "styled-components/native";
import { useState } from "react";

export const Login = ({ navigation }) => {
  const [phoneNumber, onChangePhoneNumber] = useState("");

  return (
    <SignUpContainerRoot>
      <SignUpBox>
        <Icon source={require("./assets/proxilogo.png")} />
        <SignUpOrLoginText>
          Sign up or login with your phone #
        </SignUpOrLoginText>
        <PhoneNumberInput>
          <PhoneInputWrapper>
            <CountryCode>+1</CountryCode>
          </PhoneInputWrapper>
          <PhoneNumber
            placeholder="(781)201-0366"
            keyboardType="numeric"
            onChangeText={onChangePhoneNumber}
          />
        </PhoneNumberInput>
        <ConfirmButton>
          <ConfirmButtonText>Confirm</ConfirmButtonText>
        </ConfirmButton>
      </SignUpBox>
    </SignUpContainerRoot>
  );
};

export const VerifyLogin = () => {};

const SignUpContainerRoot = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px 0px 0px 0px;
  box-sizing: border-box;
  background-color: #786cff;
  overflow: hidden;
`;

const SignUpBox = styled.View`
  width: 100%;
  height: 100%;
  position: static;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 60px 30px 60px 30px;
  border-radius: 20px 20px 0px 0px;
  box-sizing: border-box;
  background-color: #ffffff;
`;



const Icon = styled.Image`
  width: 175px;
  height: 73px;
  object-fit: fill;
`;

const SignUpOrLoginText = styled.Text`
  position: relative;
  margin: 0px 0px 11px 0px;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
  margin: 60px 0px 10px 0px
`;

const PhoneNumberInput = styled.View`
  width: 300px;
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
  margin: 0px 0px;
  padding: 14px 15px;
  border-width: 1px;
  border-radius: 8px;
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
