import styled from 'styled-components/native';
import {useState, useRef, useEffect} from 'react';
import {verifyCodeHttp, makePostRequest, getCodeHttp} from './utils.js';
import {Alert} from 'react-native';
import {AnimatedButton, BackButton} from './SignupComponents';

export const ConfirmNumber = ({route, navigation}) => {
  const [cooldown, setCooldown] = useState(30);
  const {phoneNumber} = route.params;
  const [code, setCode] = useState('');
  const inputRef = useRef();

  const onPressGroup2 = () => {
    inputRef.current.focus();
  };

  const onPressConfirm = async () => {
    if (code.length == 4) {
      // REACTIVATE FOR TEXTS
      /*
      // send request to verify code with phone number
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
      */
      navigation.navigate('LetsGetStarted', {
        phoneNumber: phoneNumber,
      });
    }
  };

  // require client to wait 30 seconds time in between sending these
  // don't want client to be able to spam it
  const onPressResendCode = async () => {
    if (cooldown === 0) {
      setCooldown(30);
      await makePostRequest(getCodeHttp, {
        phoneNumber: phoneNumber,
      });
    }
  };

  useEffect(() => {
    const timer =
      cooldown > 0 && setInterval(() => setCooldown(cooldown - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <ContainerRoot>
      <ConfirmPhoneDiv>
        <MaxWidth>
          <BackButton label="Change #" onPress={() => navigation.goBack()} />
          <Group>
            <ConfirmTitle>Confirm</ConfirmTitle>
            <PhoneVerificationMessage>
              To ensure the security of your account, we need to verify your
              phone number: + 1 {phoneNumber}
            </PhoneVerificationMessage>
          </Group>
          <Group1>
            <Group2 onPress={onPressGroup2}>
              <SplitBoxes>
                <SplitBoxText>{code[0] || ''}</SplitBoxText>
              </SplitBoxes>
              <SplitBoxes>
                <SplitBoxText>{code[1] || ''}</SplitBoxText>
              </SplitBoxes>
              <SplitBoxes>
                <SplitBoxText>{code[2] || ''}</SplitBoxText>
              </SplitBoxes>
              <SplitBoxes>
                <SplitBoxText>{code[3] || ''}</SplitBoxText>
              </SplitBoxes>
            </Group2>
            <Group3>
              <FirstRectangle hasText={code.length > 0} />
              <FirstRectangle hasText={code.length > 1} />
              <FirstRectangle hasText={code.length > 2} />
              <FirstRectangle hasText={code.length > 3} />
            </Group3>
          </Group1>
          <TextInputHidden
            value={code}
            onChangeText={setCode}
            maxLength={4}
            ref={inputRef}
            keyboardType="numeric"
          />
          <Group4>
            <ResendButton onPress={onPressResendCode}>
              <ResendCodeButtonText>
                {cooldown > 0 ? `${cooldown} secs` : 'Resend Code'}
              </ResendCodeButtonText>
            </ResendButton>
            <AnimatedButton
              onPress={onPressConfirm}
              active={code.length > 3}
              label="Confirm"
            />
          </Group4>
        </MaxWidth>
      </ConfirmPhoneDiv>
    </ContainerRoot>
  );
};

const ContainerRoot = styled.View`
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 60px;
  background-color: #786cff;
  overflow: hidden;
`;
const ConfirmPhoneDiv = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  background-color: #ffffff;
  overflow: hidden;
`;

const MaxWidth = styled.View`
  width: 100%;
  max-width: 390px;
  height: 100%;
  gap: 30px;
  flex-direction: column;
  padding: 15px 30px 0px 30px;
`;

const Group1 = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const Group = styled.View`
  width: 330px;
  gap: 20px;
  flex-direction: column;
  margin-bottom: 30px;
`;
const ConfirmTitle = styled.Text`
  color: #786cff;
  font-size: 32px;
  font-weight: 700;
  line-height: 35px;
`;
const PhoneVerificationMessage = styled.Text`
  width: 244px;
  font-size: 12px;
  line-height: 17px;
`;
const Group2 = styled.Pressable`
  width: 270px;
  gap: 46px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
const SplitBoxes = styled.View`
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-width: 2px;
  border-radius: 5px;
`;
const SplitBoxText = styled.Text`
  font-size: 32px;
  font-weight: 500;
  text-align: center;
`;
const Group3 = styled.View`
  width: 270px;
  gap: 46px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
  margin-top: 10px;
`;
const FirstRectangle = styled.View`
  width: 50px;
  height: 5px;
  border-radius: 4px;
  background-color: ${props => (props.hasText ? '#786cff' : '#d9d9d9')};
`;
const TextInputHidden = styled.TextInput`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;
const Group4 = styled.View`
  width: 330px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ResendCodeButton = styled.Button`
  font-size: 11px;
  line-height: 11px;
  text-align: center;
`;
const MediumButton = styled.TouchableOpacity`
  justify-content: center;
  padding: 16px 61px;
  border-radius: 8px;
  background-color: #ff5a5f;
  cursor: pointer;
  background-color: ${({active}) => (active ? '#ff5a5f' : '#e6e6e6')};
`;

const ResendButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  padding-top: 16px;
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
  border-radius: 8px;
`;
const ConfirmCodeButtonText = styled.Text`
  color: #ffffff;
  font-weight: 600;
  line-height: 20px;
`;

const ResendCodeButtonText = styled.Text`
  color: #c4c4c4;
  font-weight: 600;
  line-height: 20px;
`;
