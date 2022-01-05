import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  ImageBackground,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getRef, getRefFriends} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import ImageLoader from '../../components/ImageLoader';
import Button from '../../components/Button';

export default function InviteFriends(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const [refCode, setRefCode] = useState('');
  const [total, setTotal] = useState('0');
  const [pending, setPending] = useState('0');
  const [userList, setUserList] = useState();

  const getMyRef = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getRef());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  const getRefFriendsReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getRefFriends());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(GeneralReducer.status, [
    GENERAL.GET_REF_CODE_REQUEST.type,
    () => {
      const referral_id = GeneralReducer?.refResponse?.referral_id;
      const total_earn = GeneralReducer?.refResponse?.total_earn;
      const pending_earn = GeneralReducer?.refResponse?.pending_earn;
      setRefCode(referral_id);
      setTotal(total_earn);
      setPending(pending_earn);
      getRefFriendsReq();
    },
    () => {
      getRefFriendsReq();
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  this.status(GeneralReducer.status, [
    GENERAL.GET_REF_FRIENDS_REQUEST.type,
    () => {
      const validUser = GeneralReducer?.refFriends?.refer_users;
      setUserList(
        validUser && Array.isArray(validUser)
          ? validUser.map(item => ({
              name: item?.full_name,
              image:
                item?.profile_photo_path == ''
                  ? item?.profile_photo_url
                  : item?.profile_photo_path,
            }))
          : null,
      );
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      getMyRef();
      return () => {
        unsuscribe();
      };
    });
  }, []);
  const applink =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/us/app/my-assurance-app/id1588925563'
      : 'https://play.google.com/store/apps/details?id=com.myassurance';

  const getText = (text, last) => {
    return (
      <View
        style={{
          position: 'relative',
          marginBottom: last != true ? normalize(12) : 0,
        }}>
        <Text
          style={{
            fontFamily: Fonts.Montserrat_Light,
            color: Colors.black,
            fontSize: normalize(13),
            paddingLeft: normalize(20),
          }}>
          {text}
        </Text>
        <View
          style={{
            position: 'absolute',
            top: -normalize(0),
            left: -normalize(10),
            height: normalize(25),
            width: normalize(25),
          }}>
          <Image
            source={Icons.EllipseBorder}
            style={{
              height: normalize(20),
              width: normalize(20),
            }}
            resizeMode="contain"
          />
          <View
            style={{
              position: 'absolute',
              left: normalize(5),
              top: normalize(5),
              height: normalize(10),
              width: normalize(10),
              borderRadius: normalize(50),
              backgroundColor: Colors.red,
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={translate("Invite Friends")} {...props} />
        <ScrollView bounces={false}>
          <ImageBackground
            source={Images.fun}
            resizeMode="cover"
            style={{
              height: normalize(200),
              backgroundColor: '#EEEBEB',
              paddingTop: normalize(20),
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.Montserrat_ExtraBold,
                color: Colors.white,
                paddingTop: normalize(10),
                fontSize: normalize(15),
                textTransform: 'uppercase',
              }}>
              {translate("Get")} 25.-CHF {translate("for each friends")}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'flex-start',
                backgroundColor: Colors.white,
                borderRadius: normalize(6),
                alignSelf: 'center',
                padding: normalize(8),
                marginTop: normalize(15),
                marginBottom: normalize(20),
                paddingHorizontal: normalize(12),
              }}
              onPress={async () => {
                await Share.share({
                  message: `${translate("Share1")} ${"\n"}${applink} ${"\n"}${translate("Referral Code")}: ${refCode}`,
                  title: translate('My Assurance App Share'),
                  dialogTitle: translate('My Assurance App Share'),
                });
              }}
              activeOpacity={0.8}>
              <Image
                style={{
                  height: normalize(12),
                  width: normalize(12),
                  alignSelf: 'center',
                  tintColor: Colors.red,
                  marginRight: normalize(5),
                }}
                source={Icons.link}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_SemiBold,
                  color: Colors.red,
                  fontSize: normalize(12),
                }}>
                {translate("Share the link")}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
          <View style={{padding: normalize(20)}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.Montserrat_SemiBold,
                color: Colors.black,
                fontSize: normalize(15),
                marginTop: normalize(5),
              }}>
              {translate("What need to do your friends")}
            </Text>
            <View
              style={{
                borderLeftColor: '#C4C4C4',
                borderLeftWidth: normalize(1),
                width: '98%',
                marginLeft: 'auto',
                marginTop: normalize(20),
                marginBottom: normalize(10),
                position: 'relative',
              }}>
              {getText(translate('SHPoint1'))}
              {getText(translate('SHPoint2'))}
              {getText(translate('SHPoint3'))}
              {getText(translate('SHPoint4'))}
              {getText(translate('SHPoint5'),true)}
              <View
                style={{
                  height: normalize(20),
                  width: normalize(5),
                  backgroundColor: Colors.white,
                  position: 'absolute',
                  bottom: -normalize(7),
                  left: -normalize(2),
                }}></View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('InviteFriends')}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.Montserrat_SemiBold,
                    color: Colors.black,
                    fontSize: normalize(11.5),
                    marginTop: normalize(15),
                    marginBottom: normalize(25),
                  }}>
                  {translate("Invitations")}- {total} CHF {translate("won")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('InviteFriends', {isPending: true})
                }>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.Montserrat_SemiBold,
                    color: Colors.red,
                    fontSize: normalize(11.5),
                    marginTop: normalize(15),
                    marginBottom: normalize(25),
                  }}>
                  {pending} CHF {translate("pending")}
                </Text>
              </TouchableOpacity>
            </View>
            {userList && userList?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  borderTopWidth: normalize(1),
                  borderTopColor: '#DDDDDD',
                  borderBottomWidth: normalize(1),
                  borderBottomColor: '#DDDDDD',
                  marginBottom: normalize(15),
                  padding: normalize(10),
                }}>
                {userList &&
                  userList?.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: normalize(15),
                      }}>
                      <ImageLoader
                        source={{uri: item?.image}}
                        height={normalize(50)}
                        width={normalize(50)}
                        borderRadius={normalize(50)}
                        marginLeft="auto"
                        marginRight="auto"
                        marginBottom={normalize(5)}
                        loaderColor={Colors.red}
                        loaderBorderColor={Colors.red}
                        loaderSize="small"
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          color: Colors.black,
                          fontFamily: Fonts.Montserrat_Regular,
                          fontSize: normalize(10.5),
                          lineHeight: normalize(14),
                          maxWidth: normalize(80),
                          textAlign: 'center',
                        }}>
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginTop: normalize(15),
              }}
              onPress={() => props.navigation.navigate('TermsAndConditions')}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: Fonts.Montserrat_SemiBold,
                  color: Colors.red,
                  fontSize: normalize(15),
                }}>
                {translate("Terms and Conditions")}
              </Text>
            </TouchableOpacity>
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(15)}
              onPress={async () => {
                await Share.share({
                  message: `${translate("Share1")} ${"\n"}${applink} ${"\n"}${translate("Referral Code")}: ${refCode}`,
                  title: translate('My Assurance App Share'),
                  dialogTitle: translate('My Assurance App Share'),
                });
              }}
              title={translate("Invite Friends")}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_REF_CODE_REQUEST.type ||
          GeneralReducer.status === GENERAL.GET_REF_FRIENDS_REQUEST.type
        }
      />
    </>
  );
}

const style = StyleSheet.create({});
