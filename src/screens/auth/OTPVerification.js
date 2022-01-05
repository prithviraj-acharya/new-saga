import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  signupOTPSend,
  signupOTPVerify,
  forgotPassword,
} from '../../redux/action/AuthAction';
import Loader from '../../utils/helpers/Loader';
import {AUTH} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

import OTPInputView from '@twotalltotems/react-native-otp-input';

export default function OTPVerification(props) {
  const phone = props.route?.params?.phone;
  const countryCode = props.route?.params?.countryCode;
  const email = props.route?.params?.email;
  const isFromForgot = props.route?.params?.isForgot;
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [otp, setOTP] = useState('');

  const verifyOTP = () => {
    isInternetConnected()
      .then(() => {
        if (!phone) {
          showErrorAlert(translate('Your phone no is not valid'));
        } else if (otp.length < 4) {
          showErrorAlert(translate('Enter a valid OTP'));
        } else {
          if (isFromForgot == true) {
            dispatch(
              signupOTPVerify({
                phone: phone?.trim(),
                otp: otp,
                isFromForgot: isFromForgot,
              }),
            );
          } else {
            dispatch(
              signupOTPVerify({
                phone: phone?.trim(),
                verification_code: otp,
                isFromForgot: isFromForgot,
              }),
            );
          }
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  const resendOTP = () => {
    isInternetConnected()
      .then(() => {
        if (!phone) {
          showErrorAlert(translate('Your phone no is not valid'));
        } else {
          if (isFromForgot == true) {
            dispatch(
              forgotPassword({
                email: email,
              }),
            );
          } else {
            dispatch(
              signupOTPSend({
                phone: phone,
              }),
            );
          }
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(AuthReducer.status, [
    AUTH.SIGNUP_OTP_SEND_REQUEST.type,
    () => {
      showErrorAlert(translate('OTP sent on your phone'));
    },
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);

  this.status(AuthReducer.status, [
    AUTH.FORGOT_PASSWORD_REQUEST.type,
    () => {
      showErrorAlert(translate('OTP sent on your phone'));
    },
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);


  this.status(AuthReducer.status, [
    AUTH.SIGNUP_OTP_VERIFY_REQUEST.type,
    () => {
      props.navigation.replace('SetPassword', {
        token: AuthReducer?.signUpOTPVerifyResponse,
        isForgot: isFromForgot,
      });
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
        <Header title={translate("confirmation")} back={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.Montserrat_SemiBold,
                color: Colors.black,
                fontSize: normalize(15),
              }}>
              {translate("Enter the code send to")} {'\n'}
              {countryCode+phone}
            </Text>
            <OTPInputView
              style={{
                height: normalize(45),
                width: '100%',
                marginTop: normalize(20),
                marginBottom: normalize(25),
              }}
              selectionColor="#006c60"
              pinCount={4}
              autoFocusOnLoad={true}
              codeInputFieldStyle={{
                borderRadius: normalize(10),
                width: normalize(60),
                height: normalize(50),
                borderColor: '#DDDDDD',
                color: Colors.black,
                fontSize: normalize(20),
                fontFamily: Fonts.Montserrat_Bold,
              }}
              onCodeChanged={code => {
                setOTP(code);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
                flexWrap:'wrap'
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_SemiBold,
                  color: Colors.black,
                  textAlign: 'center',
                  fontSize: normalize(13),
                  lineHeight: normalize(13),
                }}>
                {translate("Didnt receive the code")}{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  alignSelf: 'flex-start',
                }}
                onPress={() => {
                  resendOTP();
                }}>
                <Text
                  style={{
                    color: Colors.red,
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(13),
                    lineHeight: normalize(13),
                  }}>
                  {translate("Resend Code")}
                </Text>
              </TouchableOpacity>
            </View>
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(25)}
              onPress={() => verifyOTP()}
              title={translate("Verifyproceed")}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          AuthReducer.status === AUTH.SIGNUP_OTP_SEND_REQUEST.type ||
          AuthReducer.status === AUTH.SIGNUP_OTP_VERIFY_REQUEST.type ||
          AuthReducer.status === AUTH.FORGOT_PASSWORD_REQUEST.type
        }
      />
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({});
