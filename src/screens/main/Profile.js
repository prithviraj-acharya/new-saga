import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {
  logout,
  switchAccount,
  deleteAccount,
} from '../../redux/action/AuthAction';
import {getMemberComapnyList} from '../../redux/action/GeneralAction';
import {updateLanguage} from '../../redux/action/ProfileAction';
import {translate, setAppLanguage} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import Loader from '../../utils/helpers/Loader';
import {AUTH, GENERAL, PROFILE} from '../../redux/store/TypeConstants';

//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import constants from '../../utils/helpers/constants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';

import Nav_Link from '../../components/Nav_Link';
import MyStatusBar from '../../utils/MyStatusBar';
import Line from '../../components/Line';
import ImageLoader from '../../components/ImageLoader';
import Picker from '../../components/Picker';

export default function Profile(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const TokenReducer = useSelector(state => state.TokenReducer);

  const isCompanyProfile =
    ProfileReducer?.profileDetails?.role_name === 'COMPANY';
  const isMember = ProfileReducer?.profileDetails?.parent_id !== 0;

  const [profileDetails, setProfileDetails] = useState(null);

  const isEng = ProfileReducer?.profileDetails?.language;

  const [showPicker, setShowPicker] = useState(false);
  const language = isEng;
  const languageText = isEng == 2 ? 'English' : 'Français';
  const languageData = [
    {
      name: 'Français',
      value: 1,
    },
    {
      name: 'English',
      value: 2,
    },
  ];

  const [showPickerSubject, setShowPickerSubject] = useState(false);
  const [memberData, setMemberData] = useState();

  const getRating = rating => {
    let Rating = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        Rating.push(
          <Image
            key={i}
            style={{
              height: normalize(12),
              width: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star}
            resizeMode="contain"
          />,
        );
      } else {
        Rating.push(
          <Image
            key={i}
            style={{
              height: normalize(12),
              width: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star_line}
            resizeMode="contain"
          />,
        );
      }
    }
    if (rating != parseInt(rating)) {
      try {
        Rating[parseInt(rating)] = (
          <Image
            key={parseInt(rating) + 1}
            style={{
              height: normalize(12),
              width: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star_line}
            resizeMode="contain"
          />
        );
      } catch (Ex) {}
    }
    return Rating;
  };

  const logoutUser = () => {
    isInternetConnected()
      .then(() => {
        dispatch(logout());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(AuthReducer.status, [
    AUTH.LOGOUT_REQUEST.type,
    () => {},
    () => {
      showErrorAlert(translate('Something went wrong'));
    },
  ]);

  useEffect(() => {
    setProfileDetails(ProfileReducer?.profileDetails);
  }, [ProfileReducer?.profileDetails]);

  const getAllMemberComapnyList = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getMemberComapnyList());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type,
    () => {
      setMemberData(
        GeneralReducer?.memberCompanyList?.map((item, i) => {
          return {
            name: `${item?.full_name}`,
            value: item?.id,
          };
        }),
      );
    },
    () => {
      //showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  useFocusEffect(
    React.useCallback(() => {
      getAllMemberComapnyList();
      return () => {};
    }, []),
  );
  useEffect(() => {
    getAllMemberComapnyList();
  }, [TokenReducer?.token]);

  const switchAc = id => {
    isInternetConnected()
      .then(() => {
        dispatch(switchAccount(id));
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(AuthReducer.status, [
    AUTH.SWITCH_ACCOUNT_REQUEST.type,
    () => {},
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  const updateLanguageReq = v => {
    isInternetConnected()
      .then(() => {
        setAppLanguage(v == 2 ? 'en' : 'fr');
        dispatch(updateLanguage());
        EncryptedStorage.setItem(
          constants.LANGUAGE,
          JSON.stringify({
            value: v,
          }),
        )
          .then(() => {})
          .catch(ex => {});
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(ProfileReducer.status, [
    PROFILE.UPDATE_LANGUAGE_REQUEST.type,
    () => {},
    () => {
      showErrorAlert(ProfileReducer?.error?.message);
    },
  ]);

  const deleteAccountReq = () => {
    Alert.alert(translate('Confirm'), translate('You want to delete your account?'), [
      {
        text: translate('Confirm'),
        onPress: () => {
          isInternetConnected()
            .then(() => {
              dispatch(deleteAccount());
            })
            .catch(err => {
              showErrorAlert(translate('Please Connect To Internet'));
            });
        },
      },
      {
        text: translate('Cancel'),
        onPress: () => {},
      },
    ]);
  };
  this.status(AuthReducer.status, [
    AUTH.DELETE_ACCOUNT_REQUEST.type,
    () => {},
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          down={true}
          downPress={() => {
            if (memberData && memberData?.length > 0) {
              setShowPickerSubject(!showPickerSubject);
            } else {
              showErrorAlert(translate('No others member found!'));
            }
          }}
          title={profileDetails?.first_name + ' ' + profileDetails?.last_name}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_SemiBold,
                  color: Colors.black,
                  fontSize: normalize(16),
                  lineHeight: normalize(16),
                }}>
                {translate("Personal Details")}
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('EditProfile')}>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_Regular,
                    color: Colors.red,
                    fontSize: normalize(13),
                    lineHeight: normalize(13),
                  }}>
                  {translate("Change Profile")}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <ImageLoader
                source={{
                  uri:
                    profileDetails?.profile_photo_path == ''
                      ? profileDetails?.profile_photo_url
                      : profileDetails?.profile_photo_path,
                }}
                height={normalize(110)}
                width={normalize(95)}
                borderRadius={normalize(15)}
                loaderColor={Colors.red}
                loaderBorderColor={Colors.red}
                loaderSize="large"
              />
              <View
                style={{flex: 1, marginStart: 10, paddingLeft: normalize(7)}}>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_SemiBold,
                    color: Colors.black,
                    fontSize: normalize(15),
                    lineHeight: normalize(15),
                  }}
                  numberOfLine={1}>
                  {profileDetails?.full_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => props.navigation.navigate('InviteFriend')}
                    style={{
                      flexDirection: 'row',
                      marginBottom: normalize(10),
                      marginTop: normalize(2),
                      width: normalize(90),
                    }}>
                    {getRating(profileDetails?.user_rating)}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: normalize(20),
                      width: normalize(70),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      paddingLeft: normalize(10),
                      marginBottom: normalize(10),
                    }}
                    activeOpacity={0.6}
                    onPress={() => setShowPicker(true)}>
                    <Text
                      style={[
                        {
                          color: Colors.red,
                          fontFamily: Fonts.Montserrat_SemiBold,
                          fontSize: normalize(12),
                        },
                      ]}>
                      {languageText}
                    </Text>
                    <Image
                      source={Icons.down_arrow}
                      style={{
                        height: normalize(11),
                        width: normalize(11),
                        tintColor: Colors.red,
                        marginLeft: normalize(5),
                      }}
                      resizeMode="contain"></Image>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(10.5),
                    lineHeight: normalize(10.5),
                    color: '#716D6A',
                    marginBottom: normalize(5),
                  }}
                  numberOfLines={1}>
                  {profileDetails?.email}
                </Text>
                <Line color="rgba(245, 243, 243, 0.97)" />
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_Regular,
                    fontSize: normalize(10.5),
                    lineHeight: normalize(10.5),
                    color: '#716D6A',
                    marginTop: normalize(8),
                    marginBottom: normalize(8),
                  }}
                  numberOfLines={2}>
                  {profileDetails?.address}
                </Text>
                <Line color="rgba(245, 243, 243, 0.97)" />
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_Regular,
                    fontSize: normalize(10.5),
                    lineHeight: normalize(10.5),
                    color: '#716D6A',
                    marginTop: normalize(5),
                  }}
                  numberOfLines={1}>
                  {translate("Phone no:")} {profileDetails?.phone}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(10),
                marginBottom: normalize(10),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {isMember == false ? (
                <>
                  <Button
                    backgroundColor={Colors.backtransparent}
                    marginBottom={normalize(2)}
                    marginTop={normalize(10)}
                    borderWidth={1}
                    borderColor={Colors.red}
                    textColor={Colors.red}
                    fontSize={normalize(13)}
                    fontFamily={Fonts.Montserrat_Bold}
                    title={translate("Add Family Member")}
                    width={normalize(155)}
                    onPress={() => {
                      props.navigation.navigate('FamilyMemberList');
                    }}
                  />
                  <Button
                    backgroundColor={Colors.backtransparent}
                    marginBottom={normalize(2)}
                    marginTop={normalize(10)}
                    borderWidth={1}
                    borderColor={Colors.red}
                    textColor={Colors.red}
                    fontSize={normalize(13)}
                    fontFamily={Fonts.Montserrat_Bold}
                    title={translate("Add Company")}
                    width={normalize(115)}
                    onPress={() => {
                      props.navigation.navigate('CompanyList');
                    }}
                  />
                </>
              ) : null}
            </View>
            <Nav_Link
              onPress={() => props.navigation.navigate('InviteFriend')}
              title={translate("Invite Friends")}
              icon={Icons.InviteFriends}
            />
            <Nav_Link
              onPress={async () => {
                if (Platform.OS === 'ios') {
                  const supported = await Linking.canOpenURL(
                    'https://apps.apple.com/us/app/my-assurance-app/id1588925563',
                  );
                  if (supported) {
                    await Linking.openURL('https://apps.apple.com/us/app/my-assurance-app/id1588925563');
                  }
                } else {
                  const supported = await Linking.canOpenURL(
                    'https://play.google.com/store/apps/details?id=com.myassurance',
                  );
                  if (supported) {
                    await Linking.openURL('https://play.google.com/store/apps/details?id=com.myassurance');
                  }
                }
              }}
              title={translate("Rate My Assurance")}
              icon={Icons.rating}
            />
            <Nav_Link
              onPress={() => props.navigation.navigate('Broker')}
              title={translate("Broker Mandate")}
              icon={Icons.BrokerMandate}
            />
            <Nav_Link
              onPress={() => props.navigation.navigate('Help')}
              title={translate("Help")}
              icon={Icons.help}
            />
            <Nav_Link
              onPress={() => props.navigation.navigate('RateAdvisor')}
              title={translate("My Insurance Advisor")}
              icon={Icons.Advisor}
            />
            {/* <Nav_Link
              title="Choose Language"
              opacity={1}
              lang={true}
              isEng={isEng == 1 ? false : true}
              icon={Icons.text}
              onLanguageChange={v => updateLanguageReq(v)}
            /> */}
            <Nav_Link
              onPress={() => props.navigation.navigate('PrivacyPolicy')}
              title={translate("Privacy Policy")}
              icon={Icons.policy_privacy}
            />
            <Nav_Link
              onPress={deleteAccountReq}
              title={translate("Delete Account")}
              icon={Icons.delete_account}
            />
            <Nav_Link
              title={translate("Logout")}
              icon={Icons.logout}
              border={false}
              onPress={() => {
                logoutUser();
                // props.navigation.reset({
                //   index: 0,
                //   routes: [{name: 'Welcome'}],
                // });
              }}
            />
          </View>
        </ScrollView>
        <Picker
          backgroundColor={Colors.white}
          dataList={memberData}
          modalVisible={showPickerSubject}
          onBackdropPress={() => setShowPickerSubject(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setShowPickerSubject(false);
                  switchAc(item.value);
                }}
                style={style.dropDownItem}>
                <Text style={style.dropDownItemText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <Picker
          backgroundColor={Colors.white}
          dataList={languageData}
          modalVisible={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  updateLanguageReq(item.value);
                  setShowPicker(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    language == item.value ? {color: Colors.red} : null,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
      <Loader
        visible={
          AuthReducer.status === AUTH.LOGOUT_REQUEST.type ||
          AuthReducer.status === AUTH.SWITCH_ACCOUNT_REQUEST.type ||
          GeneralReducer.status ===
            GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type ||
          ProfileReducer.status === PROFILE.UPDATE_LANGUAGE_REQUEST.type ||
          ProfileReducer.status === PROFILE.GET_PROFILE_REQUEST.type ||
          AuthReducer.status === AUTH.DELETE_ACCOUNT_REQUEST.type
        }
      />
    </>
  );
}

const style = StyleSheet.create({
  dropDownItem: {
    paddingVertical: normalize(12),
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: normalize(1),
  },
  dropDownItemText: {
    fontSize: normalize(14),
    lineHeight: normalize(14),
    fontFamily: Fonts.Montserrat_Regular,
  },
});
