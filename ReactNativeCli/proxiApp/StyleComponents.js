// General UI components to use across entire app

import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Animated, Text, Modal, View, TextInput, Image, TouchableOpacity, SafeAreaView } from 'react-native';

// App colors
export const colors = {
    primary: '#786CFF',
    primaryAccent: '#A59DFF',
    secondary: '#FF5A5F',
    secondaryAccent: '#FF9497',
    white: '#FFFFFF',
    black: '#000000',

    // Other colors
    grey: '282828'
};

// Typography hierarchy
// TitleText: 20px, 600
// SubtitleText: 16px, 600
// BodyText: 14px, 400
// InputText: 11px

// TitleText: Text component for displaying titles.
export const TitleText = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: ${({ color }) => color || colors.black};
`;

// SubtitleText: Text component for displaying subtitles.
export const SubtitleText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: ${({ color }) => color || colors.black};
`;

// BodyText: Text component for displaying body text.
export const BodyText = styled.Text`
    font-size: 14px;
    font-weight: 400;
    color: ${({ color }) => color || colors.black};
`;

// ButtonText: Text component for displaying text on buttons.
export const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ color }) => color || colors.black};
`;


// Button: Button component for buttons.
// Props:
// - onPress: Function to handle button press.
// - label: String to display on the button.
// - color: String to set the background color.
// - textcolor: String to set the text color.
// - variant: String to determine whether to render a solid or outline button.
//   - 'solid' = solid button
//   - 'outline' = outline button
// - size: String to set the size of the button.
//   - 'large' = 190px
//   - 'medium' = 140px
//   - 'small' = 120px

export const Button = ({ onPress, label, variant, textcolor, color = colors.primary, size='large'}) => {
    const Wrapper = variant === 'outline' ? ButtonWrapperOutline : ButtonWrapperSolid;
    const buttonSize = size === 'large' ? 190 : size === 'medium' ? 140 : 120;
    return (
      <Wrapper onPress={onPress} backgroundColor={color} size={buttonSize}>
        <ButtonText color={textcolor}>{label}</ButtonText>
      </Wrapper>
    );
  };
  
const ButtonWrapperSolid = styled.TouchableOpacity`
    width: ${({ size }) => size}px;
    height: 50px;
    background-color: ${({ color }) => color};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

const ButtonWrapperOutline = styled.TouchableOpacity`
    width: ${({ size }) => size}px;
    height: 50px;
    border-width: 1px;
    border-radius: 5px;
    border-style: solid;
    border-color: ${({ color }) => color};
    justify-content: center;
    align-items: center;
`;

// IconButton: Button component for buttons with icons and text.
// Props:
// - onPress: Function to handle button press.
// - label: String to display on the button.
// - icon: String specifying the path to the image asset to be used as an icon.
// - color: String to set the background color.
// - textcolor: String to set the text color.
// - variant: String to determine whether to render a solid or outline button.
//   - 'solid' = solid button
//   - 'outline' = outline button
// - size: String to set the size of the button.
//   - 'large' = 190px
//   - 'medium' = 140px
//   - 'small' = 120px

export const IconButton = ({ onPress, label, icon, variant, textcolor, color = colors.primary, size='large'}) => {
    const Wrapper = variant === 'outline' ? IconButtonWrapperOutline : IconButtonWrapperSolid;
    const buttonSize = size === 'large' ? 190 : size === 'medium' ? 140 : 120;
    return (
        <Wrapper onPress={onPress} backgroundColor={color} size={buttonSize}>
            <IconImage source={icon} />
            <ButtonText color={textcolor}>{label}</ButtonText>
        </Wrapper>
    );
};

const IconButtonWrapperSolid = styled.TouchableOpacity`
    width: ${({ size }) => size}px;
    height: 50px;
    background-color: ${({ color }) => color};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    padding: 0 20px;
`;

const IconButtonWrapperOutline = styled.TouchableOpacity`
    width: ${({ size }) => size}px;
    height: 50px;
    border-width: 1px;
    border-radius: 5px;
    border-style: solid;
    border-color: ${({ color }) => color};
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const IconImage = styled.Image`
    width: 20px;
    height: 20px;
`;

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


// Input: Input component for text input fields.
// Props:
// - placeholder: String to display as placeholder text.
// - value: String to set the value of the input field.
// - onChangeText: Function to handle text input.
// - secureTextEntry: Boolean to determine whether to hide the text input.
// - keyboardType: String to determine the type of keyboard to display.
//   - 'default' = default keyboard
//   - 'numeric' = numeric keyboard
//   - 'email-address' = email keyboard

export const Input = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
    <InputWrapper>
        <InputField
            placeholder={placeholder}
            placeholderTextColor={colors.gray}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />  
    </InputWrapper>
);

const InputWrapper = styled.View`
    width: 100%;
    height: 50px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    border-color: ${colors.gray};
    justify-content: center;
    padding: 0 20px;
`;

const InputField = styled.TextInput`
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: ${colors.black};
`;



