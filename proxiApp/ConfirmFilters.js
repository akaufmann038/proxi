import {useEffect, useState, useContext} from 'react';
import {
  View,
  Image,
  Animated,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
import {BackButton, Filter} from './SignupComponents.js';
import {LocationComponent, DateComponent} from './Home.js';
import {
  dates,
  makePostRequest,
  getAllFiltersHttp,
  makeGetRequest,
} from './utils.js';
import {RedButton} from './SignupComponents.js';
import {EventContext, RegisteredContext} from './App.tsx';
import {NativeModules} from 'react-native';
import {SHA256} from 'crypto-js';

export const ConfirmFilters = ({route, navigation}) => {
  const {eventId, phoneNumber, filters} = route.params;
  const [userFilters, setFilters] = useState();

  const hash = word => {
    const hash = SHA256(word).toString();
    const integerValue = parseInt(hash, 16);

    return integerValue;
  };

  const reformatFilters = (allFilters, selectedFilters) => {
    // convert allFilters and selectedFilters =>
    // { FilterType: { filter1: { active: bool, id: int } } }
    const result = {};

    // first go through allFilters and create the object
    // then go through selectedFilters and activate the ones that are in there
    Object.keys(allFilters).forEach(filter => {
      result[filter] = {};

      allFilters[filter].forEach(fil => {
        result[filter][fil] = {active: false, id: hash(fil)};
      });
    });

    Object.keys(selectedFilters).forEach(filter => {
      selectedFilters[filter].forEach(fil => {
        result[filter][fil]['active'] = true;
      });
    });

    return result;
  };

  useEffect(() => {
    const getAllFilters = async () => {
      // gets all the filters for all filter types
      // from db
      // returns object with filters { FilterType: [filter1, filter2...]... }
      try {
        const res = await makeGetRequest(getAllFiltersHttp);

        const data = await res.json();

        return data['result'];
      } catch (err) {
        console.log(err);
      }
    };

    getAllFilters().then(result => {
      // set userFilters state as object with all the filters
      // like so...
      // { FilterType: [ { filter1: { active: bool, id: int } } ] }
      setFilters(reformatFilters(result, filtersFromString()));
      console.log(filtersFromString());
      // LEFT OFF HERE: dealing with a bug
    });
  }, []);

  // takes in the string format of filters stored in user.filters in db
  // turn it into an object: { FilterType1: [filter1, filter2...],... }
  const filtersFromString = () => {
    const reformatFilters = {};

    filters.split('|').forEach(element => {
      const element2 = element.split(':');

      // filter user data must not having any lagging commans
      if (element2[1].length > 0) {
        reformatFilters[element2[0]] = element2[1].split(',');
      } else {
        reformatFilters[element2[0]] = [];
      }
    });

    return reformatFilters;
  };

  const handleSubmitFilters = async () => {};

  return (
    <MaxWidth>
      <MarginContainer>
        <View style={{flexDirection: 'column', marginTop: 70}}>
          <BackButton label="Profile" onPress={() => navigation.goBack()} />
          <ConnectionsHeader>Confirm Filters</ConnectionsHeader>
          <ScrollView>
            <Text
              style={{
                marginTop: 15,
                color: '#828282',
                fontSize: 20,
                fontWeight: 700,
              }}>
              Who do you want to meet?
            </Text>
            <Text style={{color: '#737373', marginTop: 5}}>
              Check off the characteristics that fits the profile of people you
              are trying to meet. We have provided recommendations below
            </Text>
            {userFilters ? (
              Object.keys(userFilters).map(filter => (
                <FilterHeader headerName={filter} key={hash(filter)}>
                  {Object.keys(userFilters[filter])
                    .filter(element => userFilters[filter][element]['active'])
                    .map(element => (
                      <Filter
                        filterName={filter}
                        skillName={element}
                        skillData={userFilters}
                        setSkillData={setFilters}
                        key={userFilters[filter][element].id}
                        activated={false}
                      />
                    ))}
                </FilterHeader>
              ))
            ) : (
              <></>
            )}
            {/*<Skill
                      skillName={element}
                      skillData={allInterests}
                      setSkillData={setInterests}
                      key={allInterests[element].id}
                      activated={false}
            />*/}
          </ScrollView>
        </View>
      </MarginContainer>
    </MaxWidth>
  );
};

const FilterHeader = ({headerName}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          marginTop: 15,
          color: '#828282',
          fontSize: 20,
          fontWeight: 700,
        }}>
        {headerName}
      </Text>
      <SearchImage
        source={require('./assets/search.png')}
        style={{width: 20, height: 20}}
      />
    </View>
  );
};

const SearchImage = styled.Image`
  width: 25px;
  height: 25px;
  margin: 10px 10px 10px 10px;
`;
const SquareWrapper = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 7px;
  shadow-radius: 12px;
  shadow-opacity: 0.1;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
`;
const MarginContainer = styled.View`
  width: 85%;
  height: 100%;
  position: relative;
`;
const ConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: bold;
  font-size: 35px;
`;
