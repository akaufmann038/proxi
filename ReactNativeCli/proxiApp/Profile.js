import {useEffect, useState, useContext} from 'react';
import styled from 'styled-components/native';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  Touchable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  makePostRequest,
  getUserProfileHttp,
  changeUserDataHttp,
  skills,
  interests,
  links,
} from './utils.js';
import {UserProfile} from './App.tsx';
import {BackButton, Skill, SquareButton} from './SignupComponents.js';
import {ViewAccount} from './ShowProfile.js';

export const Profile = ({route, navigation}) => {
  const phoneNumber = '(111) 111-1111';

  const {userProfileData, setUserProfile} = useContext(UserProfile);
  const [editModal, setEditModal] = useState(false);
  const [jobTitle, setJobTitle] = useState(null);
  const [company, setCompany] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [biography, setBiography] = useState(null);
  const [profileRequest, setProfileRequest] = useState(false);
  const [phoneRequest, setPhoneRequest] = useState(false);
  const [emailRequest, setEmailRequest] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [biographyEditable, setBiographyEditable] = useState(false);
  const [biographyRequest, setBiographyRequest] = useState(false);
  const [allSkills, setSkills] = useState(null);
  const [skillsModal, setSkillsModal] = useState(false);
  const [skillsRequest, setSkillsRequest] = useState(false);
  const [allInterests, setInterests] = useState(null);
  const [interestsModal, setInterestsModal] = useState(false);
  const [interestsRequest, setInterestsRequest] = useState(false);
  const [socialsModal, setSocialsModal] = useState(false);
  const [socialsRequest, setSocialsRequest] = useState(false);
  const [allSocials, setSocials] = useState(null);

  const generateReformatSkills = locSkills => {
    reformatSkills = {};
    skills.forEach(element => {
      reformatSkills[element.name] = {
        active: locSkills.includes(element.name),
        id: element.id,
      };
    });

    return reformatSkills;
  };

  const generateReformatInterests = locInterests => {
    reformatInterests = {};
    interests.forEach(element => {
      reformatInterests[element.name] = {
        active: locInterests.includes(element.name),
        id: element.id,
      };
    });

    return reformatInterests;
  };

  const generateReformatSocials = locSocials => {
    let reformatLinks = {};

    Object.keys(links).forEach(link => {
      reformatLinks[link] = locSocials[link];
    });

    return reformatLinks;
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await makePostRequest(getUserProfileHttp, {
          phoneNumber: phoneNumber,
        });

        const data = await res.json();

        return data;
      } catch (err) {
        console.log(err);
      }
    };

    if (userProfileData == null) {
      getUserProfile().then(res => {
        setUserProfile(res.userProfile);
        setJobTitle(res.userProfile['jobTitle']);
        setCompany(res.userProfile['company']);
        setPhone(res.userProfile['phoneNumber']);
        setEmail(res.userProfile['email']);
        setBiography(res.userProfile['biography']);
        setSkills(generateReformatSkills(res.userProfile['skills']));
        setInterests(generateReformatInterests(res.userProfile['interests']));
        setSocials(generateReformatSocials(res.userProfile));
      });
    } else {
      setJobTitle(userProfileData['jobTitle']);
      setCompany(userProfileData['company']);
      setPhone(userProfileData['phoneNumber']);
      setEmail(userProfileData['email']);
      setBiography(userProfileData['biography']);
      setSkills(generateReformatSkills(userProfileData['skills']));
      setInterests(generateReformatInterests(userProfileData['interests']));
      setSocials(generateReformatSocials(userProfileData));
    }

    // allSkills - [{skill: id, active}...]
    // render the active skills
    // clicking + renders all skills
    // use mirror object for selecting skills in the modal
  }, [userProfileData]);

  const handleSubmitPhoneChange = async () => {
    // TODO: make this have a longer process, should not be super easy
    // to change phone
  };

  const handleSubmitSocialsChange = async () => {
    setSocialsRequest(true);
    let toChange = {};

    Object.keys(links).forEach(link => {
      if (userProfileData[link] != allSocials[link]) {
        toChange[link] = allSocials[link];
      }
    });

    if (Object.keys(toChange).length > 0) {
      const res = await makePostRequest(changeUserDataHttp, {
        phoneNumber: phoneNumber,
        changingValues: toChange,
      });

      const data = await res.json();

      if (data.success) {
        Object.keys(toChange).forEach((element, index) => {
          if (element == 'linkResume') {
            setUserProfile(prevState => ({
              ...prevState,
              linkResume: data.modifiedFields[index],
            }));
          } else if (element == 'linkInstagram') {
            setUserProfile(prevState => ({
              ...prevState,
              linkInstagram: data.modifiedFields[index],
            }));
          } else if (element == 'linkLinkedin') {
            setUserProfile(prevState => ({
              ...prevState,
              linkLinkedin: data.modifiedFields[index],
            }));
          } else if (element == 'linkGithub') {
            setUserProfile(prevState => ({
              ...prevState,
              linkGithub: data.modifiedFields[index],
            }));
          } else if (element == 'linkDropbox') {
            setUserProfile(prevState => ({
              ...prevState,
              linkDropbox: data.modifiedFields[index],
            }));
          } else if (element == 'linkMedium') {
            setUserProfile(prevState => ({
              ...prevState,
              linkMedium: data.modifiedFields[index],
            }));
          } else if (element == 'linkFacebook') {
            setUserProfile(prevState => ({
              ...prevState,
              linkFacebook: data.modifiedFields[index],
            }));
          } else if (element == 'linkTiktok') {
            setUserProfile(prevState => ({
              ...prevState,
              linkTiktok: data.modifiedFields[index],
            }));
          }
        });
      }
    }
    setSocialsRequest(false);
    setSocialsModal(false);
  };

  const handleSubmitInterestsChange = async () => {
    setInterestsRequest(true);
    let isSame = true;

    // if any active that are not in list (user adding skill)
    userProfileData['interests'].split(',').forEach(skill => {
      if (!allInterests[skill].active) {
        isSame = false;
      }
    });

    // if any not active that are in the list (user removes skill)
    Object.keys(allInterests).forEach(skill => {
      if (
        allInterests[skill].active &&
        !userProfileData['interests'].includes(skill)
      ) {
        isSame = false;
      }
    });

    if (!isSame) {
      const res = await makePostRequest(changeUserDataHttp, {
        phoneNumber: phoneNumber,
        changingValues: {
          interests: Object.keys(allInterests)
            .filter(skill => allInterests[skill].active)
            .join(','),
        },
      });

      const data = await res.json();

      if (data.success) {
        setUserProfile(prevState => ({
          ...prevState,
          interests: data.modifiedFields[0],
        }));
      }
    }
    setInterestsRequest(false);
    setInterestsModal(false);
  };

  const handleSubmitSkillsChange = async () => {
    setSkillsRequest(true);
    let isSame = true;

    // if any active that are not in list (user adding skill)
    userProfileData['skills'].split(',').forEach(skill => {
      if (!allSkills[skill].active) {
        isSame = false;
      }
    });

    // if any not active that are in the list (user removes skill)
    Object.keys(allSkills).forEach(skill => {
      if (
        allSkills[skill].active &&
        !userProfileData['skills'].includes(skill)
      ) {
        isSame = false;
      }
    });

    if (!isSame) {
      const res = await makePostRequest(changeUserDataHttp, {
        phoneNumber: phoneNumber,
        changingValues: {
          skills: Object.keys(allSkills)
            .filter(skill => allSkills[skill].active)
            .join(','),
        },
      });

      const data = await res.json();

      if (data.success) {
        setUserProfile(prevState => ({
          ...prevState,
          skills: data.modifiedFields[0],
        }));
      }
    }
    setSkillsRequest(false);
    setSkillsModal(false);
  };

  const handleSubmitEmailChange = async () => {
    if (email != userProfileData['email']) {
      try {
        setEmailRequest(true);

        const res = await makePostRequest(changeUserDataHttp, {
          phoneNumber: phoneNumber,
          changingValues: {email: email},
        });

        const data = await res.json();
        console.log(data);

        if (data.success) {
          setUserProfile(prevState => ({
            ...prevState,
            email: data.modifiedFields[0],
          }));
          setEmail(data.modifiedFields[0]);
          setEmailModal(false);
          setEmailRequest(false);
        } else {
          setEmailModal(false);
          setEmailRequest(false);
        }
      } catch (err) {
        console.log(err);
        setEmailRequest(false);
      }
    } else {
      setEmailModal(false);
    }
  };

  const handleChangeSocials = (social, text) => {
    if (social == 'linkResume') {
      setSocials(prevState => ({
        ...prevState,
        linkResume: text,
      }));
    } else if (social == 'linkInstagram') {
      setSocials(prevState => ({
        ...prevState,
        linkInstagram: text,
      }));
    } else if (social == 'linkLinkedin') {
      setSocials(prevState => ({
        ...prevState,
        linkLinkedin: text,
      }));
    } else if (social == 'linkGithub') {
      setSocials(prevState => ({
        ...prevState,
        linkGithub: text,
      }));
    } else if (social == 'linkDropbox') {
      setSocials(prevState => ({
        ...prevState,
        linkDropbox: text,
      }));
    } else if (social == 'linkMedium') {
      setSocials(prevState => ({
        ...prevState,
        linkMedium: text,
      }));
    } else if (social == 'linkFacebook') {
      setSocials(prevState => ({
        ...prevState,
        linkFacebook: text,
      }));
    } else if (social == 'linkTiktok') {
      setSocials(prevState => ({
        ...prevState,
        linkTiktok: text,
      }));
    }
  };

  const handleChangeBiography = text => {
    setBiography(text);
  };

  const handleChangePhone = text => {
    setPhone(text);
  };

  const handleChangeEmail = text => {
    setEmail(text);
  };

  const handleEditJobTitle = text => {
    setJobTitle(text);
  };

  const handleEditCompany = text => {
    setCompany(text);
  };

  const handleChangeTitles = async () => {
    let changingFields = {};

    if (jobTitle != userProfileData['jobTitle']) {
      changingFields['jobTitle'] = jobTitle;
    }

    if (company != userProfileData['company']) {
      changingFields['company'] = company;
    }

    if (Object.keys(changingFields).length > 0) {
      try {
        setProfileRequest(true);
        const res = await makePostRequest(changeUserDataHttp, {
          phoneNumber: phoneNumber,
          changingValues: changingFields,
        });

        const data = await res.json();

        if (data.success) {
          Object.keys(changingFields).forEach((value, index) => {
            if (value == 'jobTitle') {
              setUserProfile(prevState => ({
                ...prevState,
                jobTitle: data.modifiedFields[index],
              }));
              setJobTitle(data.modifiedFields[index]);
            }
            if (value == 'company') {
              setUserProfile(prevState => ({
                ...prevState,
                company: data.modifiedFields[index],
              }));
              setCompany(data.modifiedFields[index]);
            }
          });
          setEditModal(false);
          setProfileRequest(false);
        } else {
          setProfileRequest(false);
        }
      } catch (err) {
        console.log(err);
        setProfileRequest(false);
      }
    } else {
      setEditModal(false);
    }
  };

  return (
    <SafeAreaView style={{backgroundColor:'#ffffff'}}>
    <MaxWidth
      style={{opacity: editModal || phoneModal || emailModal ? 0.3 : 1}}>
      {userProfileData != null &&
      jobTitle != null &&
      company != null &&
      phone != null &&
      email != null &&
      allSkills != null ? (
        <View style={{width: '100%', alignItems: 'center'}}>
        <MarginContainer>
          <Modal visible={phoneModal} transparent={true} animationType={'none'}>
            <PEModalView>
              <XOutContainer
                onPress={() => {
                  setPhoneModal(false);
                  setPhone(userProfileData['phoneNumber']);
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View
                style={{
                  borderWidth: 0.4,
                  borderColor: 'black',
                  borderRadius: 10,
                  alignItems: 'flex-start',
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TextInput
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                  }}
                  value={phone}
                  onChangeText={handleChangePhone}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleSubmitPhoneChange}>
                  {phoneRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </PEModalView>
          </Modal>
          <Modal visible={emailModal} transparent={true} animationType={'none'}>
            <PEModalView>
              <XOutContainer
                onPress={() => {
                  setEmailModal(false);
                  setEmail(userProfileData['email']);
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View
                style={{
                  borderWidth: 0.4,
                  borderColor: 'black',
                  borderRadius: 10,
                  alignItems: 'flex-start',
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TextInput
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                  }}
                  value={email}
                  onChangeText={handleChangeEmail}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleSubmitEmailChange}>
                  {emailRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </PEModalView>
          </Modal>
          <Modal visible={editModal} transparent={true} animationType={'none'}>
            <ModalView>
              <XOutContainer
                onPress={() => {
                  setEditModal(false);
                  setJobTitle(userProfileData['jobTitle']);
                  setCompany(userProfileData['company']);
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View
                style={{
                  borderWidth: 0.4,
                  borderColor: 'black',
                  borderRadius: 10,
                  alignItems: 'flex-start',
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TextInput
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                  }}
                  value={jobTitle}
                  onChangeText={handleEditJobTitle}
                />
              </View>
              <View
                style={{
                  borderWidth: 0.4,
                  borderColor: 'black',
                  borderRadius: 10,
                  alignItems: 'flex-start',
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TextInput
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                  }}
                  value={company}
                  onChangeText={handleEditCompany}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleChangeTitles}>
                  {profileRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </ModalView>
          </Modal>
          <Modal
            visible={skillsModal}
            transparent={true}
            animationType={'none'}>
            <SkillsModalView>
              <XOutContainer
                onPress={() => {
                  setSkillsModal(false);
                  setSkills(generateReformatSkills(userProfileData['skills']));
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
                {Object.keys(allSkills).map(element => (
                  <Skill
                    skillName={element}
                    skillData={allSkills}
                    setSkillData={setSkills}
                    key={allSkills[element].id}
                  />
                ))}
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleSubmitSkillsChange}>
                  {skillsRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </SkillsModalView>
          </Modal>
          <Modal
            visible={interestsModal}
            transparent={true}
            animationType={'none'}>
            <SkillsModalView>
              <XOutContainer
                onPress={() => {
                  setInterestsModal(false);
                  setInterests(
                    generateReformatInterests(userProfileData['interests']),
                  );
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
                {Object.keys(allInterests).map(element => (
                  <Skill
                    skillName={element}
                    skillData={allInterests}
                    setSkillData={setInterests}
                    key={allInterests[element].id}
                  />
                ))}
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleSubmitInterestsChange}>
                  {interestsRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </SkillsModalView>
          </Modal>
          <Modal
            visible={socialsModal}
            transparent={true}
            animationType={'none'}>
            <SocialsModalView>
              <XOutContainer
                onPress={() => {
                  setSocialsModal(false);
                  setSocials(generateReformatSocials(userProfileData));
                }}>
                <XOut source={require('./assets/x_out.png')} />
              </XOutContainer>
              <View style={{width: '80%', alignSelf: 'center'}}>
                {Object.keys(allSocials).map(social => (
                  <View style={{borderBottomWidth: 0.5}}>
                    <Text>{social}:</Text>
                    <TextInput
                      value={allSocials[social]}
                      onChangeText={text => handleChangeSocials(social, text)}
                    />
                  </View>
                ))}
              </View>
              <View style={{alignSelf: 'center', marginTop: 20}}>
                <RedTouchable onPress={handleSubmitSocialsChange}>
                  {socialsRequest ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <RedText>Confirm</RedText>
                  )}
                </RedTouchable>
              </View>
            </SocialsModalView>
          </Modal>
          <View
            style={{vflexDirection: 'row',vjustifyContent: 'space-between',}}>
            <BackButton label="back" onPress={() => navigation.goBack()} />
          </View>
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'}}>
            <ConnectionsHeader>Your Profile</ConnectionsHeader>
            <SquareWrapper onPress={() => setEditModal(true)}>
              <Image source={require('./assets/edit_icon.png')} style={{width: 20, height: 20}}/>
            </SquareWrapper>
          </View>
        </MarginContainer>
        <ScrollView style={{paddingLeft: '7%', paddingRight: '7%', alignSelf: 'center'}}>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 20,
            }}>
            <ProfileImageContainer>
              <Image
                source={{
                  uri: `data:image/png;base64,${userProfileData['photo']}`,
                }}
                style={{height: 90, width: 90}}
              />
            </ProfileImageContainer>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#828282', fontSize: 20, fontWeight: 600}}>
                {userProfileData['fullName']}
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Image source={require('./assets/jobTitle.png')} />
                <Text
                  style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                  {userProfileData['jobTitle']}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Image source={require('./assets/jobTitle.png')} />
                <Text
                  style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                  {userProfileData['company']}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <PhoneEmail onPress={() => setPhoneModal(true)}>
              <Image
                style={{width: 17, height: 17}}
                source={require('./assets/phone.png')}
              />
              <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                edit phone
              </Text>
            </PhoneEmail>
            <PhoneEmail onPress={() => setEmailModal(true)}>
              <Image
                style={{width: 17, height: 17}}
                source={require('./assets/phone.png')}
              />
              <Text style={{color: '#828282', fontSize: 15, fontWeight: 400}}>
                edit email
              </Text>
            </PhoneEmail>
          </View>
          <Text
            style={{
              marginTop: 15,
              color: '#828282',
              fontSize: 20,
              fontWeight: 700,
            }}>
            Biography
          </Text>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              height: 150,
              width: '100%',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{
                color: '#828282',
                fontSize: 12,
                fontWeight: '400',
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                marginBottom: 15,
              }}
              value={biography}
              onChangeText={handleChangeBiography}
              multiline={true}
              editable={biographyEditable}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={async () => {
                  if (biographyEditable) {
                    if (biography != userProfileData['biography']) {
                      setBiographyRequest(true);
                      const res = await makePostRequest(changeUserDataHttp, {
                        phoneNumber: phoneNumber,
                        changingValues: {biography: biography},
                      });

                      const data = await res.json();

                      if (data.success) {
                        setUserProfile(prevState => ({
                          ...prevState,
                          biography: data.modifiedFields[0],
                        }));
                      }
                      setBiographyRequest(false);
                    }
                    setBiographyEditable(false);
                  } else {
                    setBiographyEditable(true);
                  }
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {biographyRequest ? (
                  <ActivityIndicator color="#786cff" />
                ) : (
                  <Image
                    style={{height: 30, width: 30}}
                    source={
                      biographyEditable
                        ? require('./assets/check_mark.png')
                        : require('./assets/edit_icon.png')
                    }
                  />
                )}
              </TouchableOpacity>
              <Text>{biography.split(' ').length}/45</Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: 15,
              color: '#828282',
              fontSize: 20,
              fontWeight: 700,
            }}>
            Your Skills
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 10}}>
            {Object.keys(allSkills)
              .filter(element => allSkills[element].active)
              .map(element => (
                <Skill
                  skillName={element}
                  skillData={allSkills}
                  setSkillData={setSkills}
                  key={allSkills[element].id}
                  activated={false}
                />
            ))}
          </View>
          <TouchableOpacity
            style={{
              borderColor: '#786cff',
              borderWidth: 1,
              alignSelf: 'flex-start',
              marginTop: 10,
              borderRadius: 20,
              padding: 5,
              flexDirection: 'row',
            }}
            onPress={() => setSkillsModal(true)}>
            <Text style={{color: '#786cff'}}> edit skills </Text>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 15,
              color: '#828282',
              fontSize: 20,
              fontWeight: 700,
            }}>
            Your Interests
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 5,
              marginTop: 10,
            }}>
            {Object.keys(allInterests)
              .filter(element => allInterests[element].active)
              .map(element => (
                <Skill
                  skillName={element}
                  skillData={allInterests}
                  setSkillData={setInterests}
                  key={allInterests[element].id}
                  activated={false}
                />
              ))}
          </View>
          <TouchableOpacity
            style={{
              borderColor: '#786cff',
              borderWidth: 1,
              alignSelf: 'flex-start',
              marginTop: 10,
              borderRadius: 20,
              padding: 5,
              flexDirection: 'row',
            }}
            onPress={() => setSkillsModal(true)}>
            <Text style={{color: '#786cff'}}> edit interests </Text>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 15,
              color: '#828282',
              fontSize: 25,
              fontWeight: 700,
            }}>
            Your Socials
          </Text>
          <View style={{flexDirection: 'row', gap: 5, flexWrap: 'wrap'}}>
            {Object.keys(links).map(link => {
              if (userProfileData[link] == '') {
                return <></>;
              }

              return (
                <ViewAccount
                  color={links[link]['color']}
                  title={links[link]['title']}
                  iconSource={links[link]['iconSource']}
                  textColor={links[link]['textColor']}
                  link={userProfileData[link]}
                />
              );
            })}
          </View>
          <TouchableOpacity
            style={{
              borderColor: '#786cff',
              height: 40,
              width: 50,
              borderWidth: 1,
              alignItems: 'center',
              justifyCenter: 'center',
              marginTop: 10,
              borderRadius: 20,
            }}
            onPress={() => setSocialsModal(true)}>
            <Image
              source={require('./assets/plus.png')}
              style={{height: 30, width: 30, marginTop: 2.5}}
            />
          </TouchableOpacity>
          <View style={{marginTop: 200}}></View>
        </ScrollView>
      </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="#786cff" />
        </View>
      )}
    </MaxWidth>
    </SafeAreaView>
  );
};

const SocialsModalView = styled.View`
  width: 80%;
  height: 60%;
  margin-top: 30%;
  background-color: white;
  align-self: center;
  border-radius: 10px;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
`;
const SkillsModalView = styled.View`
  width: 80%;
  height: 40%;
  margin-top: 70%;
  background-color: white;
  align-self: center;
  border-radius: 10px;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
`;
const PEModalView = styled.View`
  width: 80%;
  height: 30%;
  margin-top: 70%;
  background-color: white;
  align-self: center;
  border-radius: 10px;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
`;
const PhoneEmail = styled.TouchableOpacity`
  border-radius: 10px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
  flex-direction: row;
  gap: 20px;
`;
const ProfileImageContainer = styled.View`
  border-radius: 999px;
  overflow: hidden;
`;
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
const XOutContainer = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: 15px;
  margin-right: 15px;
`;
const XOut = styled.Image`
  width: 27px;
  height: 27px;
`;
const ModalView = styled.View`
  width: 80%;
  height: 40%;
  margin-top: 70%;
  background-color: white;
  align-self: center;
  border-radius: 10px;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
`;
const EditContainer = styled.TouchableOpacity`
  border-radius: 5px;
  shadow-radius: 10px;
  shadow-opacity: 0.1;
  background-color: white;
  width: 45px;
  height: 45px;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
`;
const ConnectionsHeader = styled.Text`
  color: #786cff;
  font-weight: bold;
  font-size: 35px;
`;
const MarginContainer = styled.View`
  width: 85%;
`;
const MaxWidth = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  background-color: #ffffff;
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