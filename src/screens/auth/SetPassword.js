import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {passwordSetup} from '../../redux/action/AuthAction';
import Loader from '../../utils/helpers/Loader';
import {AUTH} from '../../redux/store/TypeConstants';

import {Colors, Fonts} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import {getDeviceToken} from '../../utils/helpers/FirebaseToken';
import Icons from '../../themes/Icons';

export default function SetPassword(props) {
  const token = props.route?.params?.token;
  const isFromForgot = props.route?.params?.isForgot;
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const setPassoword = () => {
    isInternetConnected()
      .then(() => {
        let pwCheck =
          /^(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (password == '') {
          showErrorAlert(translate('Enter your password'));
        } else if (!pwCheck.test(password)) {
          showErrorAlert(translate('passwordValidation'));
        } else if (password != confirmPassword) {
          showErrorAlert(translate('Password and confirm password not match!'));
        } else {
          if (isFromForgot == true) {
            dispatch(
              passwordSetup({
                token: token,
                password: password,
                isFromForgot: isFromForgot
              }),
            );
          } else {
            if (token && token != '') {
              setLoading(true);
              getDeviceToken()
                .then(dvToken => {
                  console.log(dvToken);
                  setLoading(false);
                  dispatch(
                    passwordSetup({
                      token: token,
                      password: password,
                      device_token: dvToken,
                      isFromForgot: false,
                      device_type: new String(Platform.OS)
                        .toLowerCase()
                        .toString(),
                    }),
                  );
                })
                .catch(err => {
                  setLoading(false);
                  showErrorAlert(err);
                  dispatch(
                    passwordSetup({
                      token: token,
                      password: password,
                      device_token: '',
                      isFromForgot: false,
                      device_type: new String(Platform.OS)
                        .toLowerCase()
                        .toString(),
                    }),
                  );
                });
            } else {
              showErrorAlert(translate('Your token is not valid!'));
            }
          }
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
        setLoading(false);
      });
  };

  this.status(AuthReducer.status, [
    AUTH.PASSWORD_SETUP_REQUEST.type,
    () => {
      if (isFromForgot == true) {
        showErrorAlert(translate('Password reset successfully!'));
        props.navigation.navigate('Login');
      }
    },
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header title={translate("set password")} back={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderColor: '#DDDDDD',
                borderWidth: normalize(1),
                borderRadius: normalize(3),
                height: normalize(6),
                width: '100%',
                borderRadius: normalize(10),
                marginBottom: normalize(10),
                overflow: 'hidden',
              }}>
              <View
                style={{
                  backgroundColor: Colors.red,
                  width: '80%',
                  height: normalize(6),
                }}></View>
            </View>
            <TextInputItem
              value={password}
              placeholder={translate("Choose password")}
              onChangeText={text => setPassword(text)}
              marginTop={normalize(15)}
              isSecure={!visiblePassword}
            />
            <TouchableOpacity style={{
                height:normalize(30),
                width:normalize(30),
                backgroundColor: '#FDFCFC',
                marginLeft:'auto',
                marginTop:-normalize(30),
                position:'relative',
                right:normalize(2),
                top:-normalize(6),
                alignItems:'center',
                justifyContent:'center'
              }} onPress={()=>setVisiblePassword(!visiblePassword)}>
              <Image source={visiblePassword?Icons.eye:Icons.eyeClose} style={{
                height:normalize(20),
                width:normalize(20),
              }} resizeMode="contain"/>
            </TouchableOpacity>
            <TextInputItem
              value={confirmPassword}
              placeholder={translate("Confirm password")}
              onChangeText={text => setConfirmPassword(text)}
              marginTop={normalize(15)}
              isSecure={!visibleConfirmPassword}
            />
            <TouchableOpacity style={{
                height:normalize(30),
                width:normalize(30),
                backgroundColor: '#FDFCFC',
                marginLeft:'auto',
                marginTop:-normalize(30),
                position:'relative',
                right:normalize(2),
                top:-normalize(6),
                alignItems:'center',
                justifyContent:'center'
              }} onPress={()=>setVisibleConfirmPassword(!visibleConfirmPassword)}>
              <Image source={visibleConfirmPassword?Icons.eye:Icons.eyeClose} style={{
                height:normalize(20),
                width:normalize(20),
              }} resizeMode="contain"/>
            </TouchableOpacity>
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => setPassoword()}
              title={translate("Register")}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          AuthReducer.status === AUTH.PASSWORD_SETUP_REQUEST.type ||
          loading === true
        }
      />
    </KeyboardAvoidingView>
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
