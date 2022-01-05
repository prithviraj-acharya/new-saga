import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {forgotPassword} from '../../redux/action/AuthAction';
import Loader from '../../utils/helpers/Loader';
import {AUTH} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';

export default function ForgotPassword(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [email, setEmail] = useState('');
  let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const forgotPasswordReq = () => {
    isInternetConnected()
      .then(() => {
        if (!email.trim()) {
          showErrorAlert(translate('Please enter email!'));
        } else if (!emailCheck.test(email.trim())) {
          showErrorAlert(translate('Please enter a valid email!'));
        } else {
          dispatch(
            forgotPassword({
              email: email.trim(),
            }),
          );
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(AuthReducer.status, [
    AUTH.FORGOT_PASSWORD_REQUEST.type,
    () => {
      const tempEmail = email;
      setEmail('');
      props.navigation.navigate('OTPVerification', {
        phone: AuthReducer?.forgotPassword?.phone ?? '',
        isForgot: true,
        countryCode: AuthReducer?.forgotPassword?.country_code ?? '',
        email: tempEmail,
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
        <Header title={translate('Forget Password')} back={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <TextInputItem
              value={email}
              placeholder={translate('Enter your email address')}
              onChangeText={text => setEmail(text)}
            />
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={forgotPasswordReq}
              title={translate('Recover Password')}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={AuthReducer.status === AUTH.FORGOT_PASSWORD_REQUEST.type}
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
