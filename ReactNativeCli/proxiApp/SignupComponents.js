import React, {useEffect, useState} from 'react';
import {Animated, Text, Modal, View} from 'react-native';
import styled from 'styled-components/native';

// SIModal: pop up modal for choosing skills and interests.
export const SIModal = ({
  data,
  setData,
  header,
  subheader,
  isVisible,
  setIsVisible,
  recommendedElements,
}) => {
  const SkillsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
  `;
  const ModalView = styled.View`
    width: 80%;
    height: 70%;
    margin-top: 30%;
    flex-direction: column;
    align-items: flex-start;
    align-self: center;
    background-color: white;
  `;

  const XOutContainer = styled.TouchableOpacity`
    align-self: flex-end;
  `;
  const XOut = styled.Image`
    width: 27px;
    height: 27px;
  `;
  const SkillsLabel = styled.Text`
    color: #786cff;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
  `;
  const SkillsSubheader = styled.Text`
    font-size: 12px;
    width: 50%;
    color: #828282;
    margin-bottom: 30px;
  `;
  return (
    <Modal visible={isVisible} transparent={true} animationType={'fade'}>
      <ModalView>
        <XOutContainer onPress={() => setIsVisible(false)}>
          <XOut source={require('./assets/x_out.png')} />
        </XOutContainer>
        <SkillsLabel>{header}</SkillsLabel>
        <SkillsSubheader>{subheader}</SkillsSubheader>
        <SkillsContainer>
          {data ? (
            Object.keys(data)
              .filter(
                element => !recommendedElements.includes(data[element].id),
              )
              .map(element => (
                <Skill
                  skillName={element}
                  skillData={data}
                  setSkillData={setData}
                  key={data[element].id}
                />
              ))
          ) : (
            <></>
          )}
        </SkillsContainer>
        <View
          style={{
            alignSelf: 'center',
            marginTop: '30%',
          }}>
          <RedButton label="Confirm" onPress={() => setIsVisible(false)} />
        </View>
      </ModalView>
    </Modal>
  );
};

// Skills: component that is used for showing skills and intersts. It animates its
// color based on whether it's selected or not
// TODO: these button are kinda messed up, need to get a check mark that can change color
// and need to animate the opacities of the '+' and check mark

export const Skill = ({skillName, skillData, setSkillData}) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [active, setActive] = useState(skillData[skillName].active);

  const AnimatedTouchable = Animated.createAnimatedComponent(
    styled.TouchableOpacity`
      justify-content: center;
      align-items: flex-start;
      border-width: 1px;
      border-radius: 15px;
      border-style: solid;
      border-color: #786cff;
    `,
  );

  const AnimatedText = Animated.createAnimatedComponent(
    styled.Text`
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: #786cff;
      font-size: 16px;
    `,
  );

  const buttonColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#786cff'],
  });

  const textColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#786cff', '#ffffff'],
  });

  // on mount, if active, do animation
  useEffect(() => {
    if (skillData[skillName].active) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  const handleAnimation = () => {
    if (skillData[skillName].active) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    let skills = skillData;
    skills[skillName].active = !skillData[skillName].active;

    setActive(skills[skillName].active);
    setSkillData(skills);
  };

  return (
    <AnimatedTouchable
      onPress={handleAnimation}
      style={{backgroundColor: buttonColorInterpolation}}>
      <AnimatedText style={{color: textColorInterpolation}}>
        {active ? '✔' : '+'} {skillName}
      </AnimatedText>
    </AnimatedTouchable>
  );
};

// AnimatedButton: Button component that animates its color based on 'active' prop.
// Props:
// - onPress: Function to handle button press.
// - active: Boolean to control color animation.
// - label: String to display on the button.

export const AnimatedButton = ({onPress, active, label}) => {
  const [buttonAnim] = useState(new Animated.Value(0)); // Here we use useState again

  const AnimatedTouchable = Animated.createAnimatedComponent(
    styled.TouchableOpacity`
      width: 190px;
      justify-content: center;
      align-items: center;
      padding: 16px 61px;
      border-radius: 8px;
    `,
  );

  const AnimatedText = Animated.createAnimatedComponent(
    styled.Text`
      font-weight: 600;
    `,
  );

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: active ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const buttonColorInterpolation = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e6e6e6', '#ff5a5f'],
  });

  const textColorInterpolation = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['grey', '#ffffff'],
  });

  return (
    <AnimatedTouchable
      style={{backgroundColor: buttonColorInterpolation}}
      onPress={onPress}>
      <AnimatedText style={{color: textColorInterpolation}}>
        {label}
      </AnimatedText>
    </AnimatedTouchable>
  );
};

// RedButton: Button component with red color scheme.
// Props:
// - onPress: Function to handle button press.
// - label: String to display on the button.

const RedTouchable = styled.TouchableOpacity`
  width: 190px;
  justify-content: center;
  align-items: center;
  padding: 16px 61px;
  border-radius: 8px;
  background-color: #ff5a5f;
`;

const RedText = styled.Text`
  color: #ffffff;
  font-weight: 600;
`;

export const RedButton = ({onPress, label}) => {
  return (
    <RedTouchable onPress={onPress}>
      <RedText>{label}</RedText>
    </RedTouchable>
  );
};

// BackButton: Button component for navigating back.
// Props:
// - onPress: Function to handle button press.
// - label: String to display on the button.
// - icon: String specifying the path to the image asset to be used as an icon.

export const BackButton = ({onPress, label}) => (
  <BackButtonWrapper onPress={onPress}>
    <LineImage source={require('./assets/backLine.png')} />
    <ChangeButtonText>{label}</ChangeButtonText>
  </BackButtonWrapper>
);

const BackButtonWrapper = styled.TouchableOpacity`
  width: 120px;
  height: 40px;
  flex-direction: row;
  align-items: center;
`;

const ChangeButtonText = styled.Text`
  color: #bdbdbd;
  font-size: 12px;
  font-weight: 600;
  line-height: 12px;
`;

const LineImage = styled.Image`
  width: 27px;
  height: 40px;
  object-fit: fill;
`;
