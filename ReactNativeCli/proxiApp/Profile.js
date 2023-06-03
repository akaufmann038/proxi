import {useEffect, useState, useContext} from 'react';
import styled from 'styled-components/native';
import {
  View,
  Image,
  Animated,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getFeedHttp, makePostRequest, dates} from './utils.js';
import {EventContext, RegisteredContext} from './App.tsx';

export const Profile = ({route, navigation}) => {
  return <MaxWidth></MaxWidth>;
};
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  background-color: #ffffff;
`;
