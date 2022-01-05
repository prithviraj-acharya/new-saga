import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import {useSelector} from 'react-redux';

import {Colors, Fonts, Images} from '../../themes/Themes';
import {translate} from '../../utils/helpers/i18n';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import ImageLoader from '../../components/ImageLoader';
import Button from '../../components/Button';

export default function InviteFriend(props) {
  const isPending = props?.route?.params?.isPending;
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const [userList, setUserList] = useState();
  const [isValidate, setIsValidate] = useState(isPending!=true);
  useEffect(() => {
    setUserData();
  }, []);
  const setUserData = (type = isValidate) => {
    if (type == true) {
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
    } else {
      const pendingUser = GeneralReducer?.refFriends?.pendding_refer_users;
      setUserList(
        pendingUser && Array.isArray(pendingUser)
          ? pendingUser.map(item => ({
              name: item?.full_name,
              image:
                item?.profile_photo_path == ''
                  ? item?.profile_photo_url
                  : item?.profile_photo_path,
            }))
          : null,
      );
    }
  };
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={translate("Invite Friends")} {...props} />
        <View style={{padding: normalize(20), flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: normalize(15),
            }}>
            <Button
              {...(isValidate == true
                ? {backgroundColor: Colors.red, width: '48%'}
                : {
                    textColor: Colors.red,
                    borderColor: Colors.red,
                    borderWidth: normalize(1),
                    width: '48%',
                  })}
              height={normalize(35)}
              onPress={() => {
                setIsValidate(true);
                setUserData(true);
              }}
              title={translate("Validated")}></Button>
            <Button
              onPress={() => {
                setIsValidate(false);
                setUserData(false);
              }}
              {...(isValidate == false
                ? {backgroundColor: Colors.red, width: '48%'}
                : {
                    textColor: Colors.red,
                    borderColor: Colors.red,
                    borderWidth: normalize(1),
                    width: '48%',
                  })}
              height={normalize(35)}
              title={translate("Pending")}></Button>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flex: 1,
            }}>
            {userList &&
              userList?.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  style={{
                    alignItems: 'center',
                    paddingVertical: normalize(10),
                    flexDirection: 'row',
                    borderTopWidth: normalize(1),
                    borderTopColor: i == 0 ? '#ffffff' : '#DDDDDD',
                  }}>
                  <ImageLoader
                    source={{uri: item?.image}}
                    height={normalize(35)}
                    width={normalize(35)}
                    borderRadius={normalize(50)}
                    loaderColor={Colors.red}
                    loaderBorderColor={Colors.red}
                    loaderSize="small"
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.black,
                      fontFamily: Fonts.Montserrat_Regular,
                      fontSize: normalize(12),
                      lineHeight: normalize(14),
                      paddingLeft: normalize(10),
                      flex: 1,
                    }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            {!userList || userList?.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.share_app}
                  style={{
                    height: normalize(170),
                    width: normalize(280),
                    marginBottom: normalize(20),
                  }}
                  resizeMode="contain"></Image>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.Montserrat_Bold,
                    fontSize: normalize(14),
                    lineHeight: normalize(14),
                    textAlign: 'center',
                    paddingBottom: normalize(10),
                  }}>
                  {translate("Your invitations will appear here")}
                </Text>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.Montserrat_Regular,
                    fontSize: normalize(12),
                    lineHeight: normalize(14),
                    textAlign: 'center',
                  }}>
                  {translate("Check back later t")}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  btnOutline: {},
});
