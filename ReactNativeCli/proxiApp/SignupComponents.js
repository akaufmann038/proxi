import React, {useEffect, useState} from 'react';
import {
  Animated,
  Text,
  Modal,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import styled from 'styled-components/native';

export const TabBar = ({state, descriptors, navigation}) => {
  const onPressProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={{backgroundColor:'#ffffff', }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          alignItems: 'center'
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 15,
              }}
              key={index}>
              {label == 'Home' ? (
                <View style={{alignItems: 'center', gap: 5}}>
                  <View
                    style={{
                      backgroundColor: isFocused ? '#786cff' : 'white',
                      width: 30,
                      height: 30,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={
                        isFocused
                          ? require('./assets/light_home.png')
                          : require('./assets/dark_home.png')
                      }
                    />
                  </View>
                  <Text style={{color: isFocused ? 'white' : '#786cff', fontSize: 12}}>
                    {label}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {label == 'Connections' ? (
                <View style={{alignItems: 'center', gap: 5}}>
                  <View
                    style={{
                      backgroundColor: isFocused ? '#786cff' : 'white',
                      width: 30,
                      height: 30,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={
                        isFocused
                          ? require('./assets/light_connections.png')
                          : require('./assets/dark_connections.png')
                      }
                    />
                  </View>
                  <Text style={{color: isFocused ? 'white' : '#786cff', fontSize: 12}}>
                    {label}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {label == 'Events' ? (
                <View style={{alignItems: 'center', gap: 5}}>
                  <View
                    style={{
                      backgroundColor: isFocused ? '#786cff' : 'white',
                      width: 30,
                      height: 30,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={
                        isFocused
                          ? require('./assets/light_events.png')
                          : require('./assets/dark_events.png')
                      }
                    />
                  </View>
                  <Text style={{color: isFocused ? 'white' : '#786cff', fontSize: 12}}>
                    {label}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressProfile}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center', gap: 5}}>
            <View
              style={{
                backgroundColor: 'white',
                width: 30,
                height: 30,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={require('./assets/light_profile.png')} />
            </View>
            <Text style={{color: '#786cff', fontSize: 12}}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
  );
};

// AddAccount: button that allows you to add the link of an external
// acount using pop up modal
export const AddAccount = ({
  color,
  title,
  iconSource,
  textColor,
  links,
  setLinks,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let currentLink = '';

  const Container = styled.TouchableOpacity`
    width: 110px;
    height: 50px;
    border-radius: 10px;
    background-color: grey;
    justify-content: center;
    align-items: center;
  `;
  const ModalView = styled.View`
    width: 80%;
    height: 22%;
    margin-top: 70%;
    background-color: white;
    align-self: center;
    border-radius: 10px;
    elevation: 5;
    shadow-radius: 10px;
    shadow-opacity: 0.5;
  `;
  const AccountText = styled.Text``;
  const Icon = styled.Image``;
  const XOutContainer = styled.TouchableOpacity`
    align-self: flex-end;
  `;
  const XOut = styled.Image`
    width: 27px;
    height: 27px;
  `;
  const InstructionText = styled.Text`
    align-self: center;
    margin-bottom: 20px;
  `;
  const InputBoxes = styled.View`
    width: 80%;
    height: 50px;
    flex-direction: column;
    justify-content: center;
    padding: 14px;
    border-width: 1px;
    border-radius: 5px;
    border-style: solid;
    border-color: #000000;
    background-color: #ffffff;
    margin-bottom: 20px;
    align-self: center;
  `;

  const pressConfirm = () => {
    if (currentLink.length > 0) {
      let newLinks = links;
      newLinks[title] = currentLink;
      setLinks(newLinks);
      setIsVisible(false);
    } else {
      setIsVisible(false);
    }
  };

  const handleChangeText = text => {
    currentLink = text;
  };

  return (
    <Container
      style={{backgroundColor: color}}
      onPress={() => setIsVisible(true)}>
      <Modal visible={isVisible} transparent={true} animationType={'fade'}>
        <ModalView>
          <XOutContainer onPress={() => setIsVisible(false)}>
            <XOut source={require('./assets/x_out.png')} />
          </XOutContainer>
          {links[title].length == 0 ? (
            <InstructionText>
              You have not set this link yet. Enter it below and press confirm
              to set it.
            </InstructionText>
          ) : (
            <InstructionText>Current link: {links[title]}</InstructionText>
          )}
          <InputBoxes>
            <TextInput
              placeholder="https://mylink.com"
              onChangeText={handleChangeText}
            />
          </InputBoxes>
          <View style={{alignSelf: 'center'}}>
            <RedButton label="Confirm" onPress={pressConfirm} />
          </View>
        </ModalView>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          gap: 10,
        }}>
        <Icon source={iconSource} />
        <AccountText style={{color: textColor}}>{title}</AccountText>
      </View>
    </Container>
  );
};

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

  const ModalContainer = styled.View`
    width: 100%;
    height: 100%;
    padding: 60px 30px 30px 30px;
    background-color: rgba(0, 0, 0, 0.2);
  `;
  const ModalView = styled.View`
    width: 100%;
    padding: 30px;
    flex-direction: column;
    align-items: flex-start;
    align-self: center;
    background-color: white;
    border-radius: 15px;
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
    color: #828282;
    margin-bottom: 30px;
  `;
  return (
    <Modal visible={isVisible} transparent={true} animationType={'fade'}>
      <ModalContainer>
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
      </ModalContainer>
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

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const AnimatedText = Animated.createAnimatedComponent(
    styled.Text`
      padding-left: 3px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: #786cff;
      font-size: 14px;
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AnimatedImage
          source={active ? require('./assets/checkmark.png') : require('./assets/plus.png')}
          style={{width: 20, height: 20, marginLeft: 5}}
        />
        <AnimatedText style={{color: textColorInterpolation}}>
          {skillName}
        </AnimatedText>
      </View>
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
