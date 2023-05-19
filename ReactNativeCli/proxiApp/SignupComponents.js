import React, {useEffect, useState} from 'react';
import {Animated, Text} from 'react-native';
import styled from 'styled-components/native';

// Skills: component that is used for showing skills and intersts. It animates its
// color based on whether it's selected or not
// TODO: these button are kinda messed up, need to get a check mark that can change color
// and need to animate the opacities of the '+' and check mark

export const Skill = ({skillName}) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [selected, setSelected] = useState(false);

  const AnimatedTouchable = Animated.createAnimatedComponent(
    styled.TouchableOpacity`
      justify-content: center;
      align-items: center;
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

  const handleAnimation = () => {
    if (selected) {
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

    setSelected(!selected);
  };

  return (
    <AnimatedTouchable
      onPress={handleAnimation}
      style={{backgroundColor: buttonColorInterpolation}}>
      <AnimatedText style={{color: textColorInterpolation}}>
        {selected ? '✔' : '+'} {skillName}
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
