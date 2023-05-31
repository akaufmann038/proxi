import styled from 'styled-components/native';
import {useState, useRef} from 'react';
import {Alert, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {makePostRequest, getCodeHttp} from './utils.js';
import {AnimatedButton} from './SignupComponents';

export const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const inputRef = useRef();

  // commented this out for now because it says that some phone numbers aren't
  // valid when they are
  /*
  const validatePhoneNumber = (phoneNumber) => {
    let phoneRegex = /^[2-9]{2}[0-9]{8}$/; // sample phone number validation
    return phoneRegex.test(phoneNumber);
  };
  */

  const handlePhoneNumberChange = text => {
    let cleaned = ('' + text).replace(/\D/g, '');
    if (cleaned === '') {
      setPhoneNumber('');
      setIsValidPhoneNumber(false);
      return;
    }
    let match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/);
    let number = [
      '(',
      match[1] || '',
      match[2] ? ') ' : '',
      match[2],
      match[3] ? '-' : '',
      match[3],
    ].join('');

    setPhoneNumber(number);
    if (cleaned.length == 10) {
      setIsValidPhoneNumber(true);
    }

    if (cleaned.length != 10) {
      setIsValidPhoneNumber(false);
    }
    //setIsValidPhoneNumber(validatePhoneNumber(cleaned));
  };

  const onPressConfirmButton = async () => {
    if (phoneNumber.length != 14) {
      Alert.alert('Please enter a valid phone number');
    } else {
      // REACTIVATE FOR TEXTS
      /*
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
      */
      navigation.navigate('ConfirmNumber', {
        phoneNumber: phoneNumber,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SignUpContainerRoot>
        <SignUpBox>
          <Icon source={require('./assets/proxilogo.png')} />
          <SignUpOrLoginText>
            Sign up or login with your phone #
          </SignUpOrLoginText>
          <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
            <PhoneNumberInput>
              <PhoneInputWrapper>
                <CountryCode>+1</CountryCode>
              </PhoneInputWrapper>
              <PhoneNumber
                ref={inputRef}
                placeholder="(781) 201-0366"
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
              />
            </PhoneNumberInput>
          </TouchableWithoutFeedback>
          <AnimatedButton
            onPress={onPressConfirmButton}
            active={isValidPhoneNumber}
            label="Confirm"
          />
        </SignUpBox>
      </SignUpContainerRoot>
    </TouchableWithoutFeedback>
  );
};

const SignUpContainerRoot = styled.View`
  height: 100%;
  justify-content: flex-end;
  background-color: #786cff;
`;

const SignUpBox = styled.View`
  height: 85%;
  justify-content: flex-start;
  align-items: center;
  padding: 60px 30px 60px 30px;
  background-color: #ffffff;
  border-radius: 20px 20px 0px 0px;
`;

const Icon = styled.Image`
  width: 175px;
  height: 73px;
`;

const SignUpOrLoginText = styled.Text`
  font-size: 13px;
  line-height: 17px;
  text-align: center;
  margin: 60px 0px 10px 0px;
`;

const PhoneNumberInput = styled.View`
  width: 300px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin: 0px 0px 11px 0px;
  border-width: 1px;
  border-radius: 10px;
  border-color: #000000;
  background-color: #ffffff;
`;

const PhoneInputWrapper = styled.View`
  width: 50px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding: 14px 15px;
  border-width: 1px;
  border-radius: 8px;
  border-color: #000000;
`;

const CountryCode = styled.Text`
  
`;

const PhoneNumber = styled.TextInput`
  color: #828282;
`;
