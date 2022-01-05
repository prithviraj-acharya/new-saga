import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getSignin} from '../../redux/action/AuthAction';
import Loader from '../../utils/helpers/Loader';
import {AUTH} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import constants from '../../utils/helpers/constants';
import {getDeviceToken} from '../../utils/helpers/FirebaseToken';

export default function Login(props) {
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const AuthReducer = useSelector(state => state.AuthReducer);

  loadCrd = () => {
    setLoading(true);
    EncryptedStorage.getItem(constants.CREDENTIALS)
      .then(res => {
        if (res != null) {
          const rs = JSON.parse(res);
          setUserName(rs?.email)
          setPassword(rs?.password)
        }
        setLoading(false);
      })
      .catch(ex => {
        setLoading(false);
      });
  };

  const loginRequest = () => {
    let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNoCheck =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (!userName.trim()) {
      showErrorAlert(translate('Please enter email or phone number'));
    } else if (
      emailCheck.test(userName.trim()) == false &&
      phoneNoCheck.test(userName.trim()) == false
    ) {
      showErrorAlert(translate('Please enter a valid email or phone number'));
    } else if (!password) {
      showErrorAlert(translate('Please enter password'));
    } else if (password.length < 6) {
      showErrorAlert(translate('Wrong password'));
    } else {
      let obj = {
        email: userName.toLowerCase().trim(),
        password,
        device_token: '',
        device_type: new String(Platform.OS).toLowerCase().toString(),
      };
      isInternetConnected()
        .then(() => {
          setLoading(true);
          getDeviceToken()
            .then(token => {
              console.log(token);
              setLoading(false);
              obj.device_token = token;
              dispatch(getSignin(obj));
            })
            .catch(err => {
              setLoading(false);
              showErrorAlert(err);
              dispatch(getSignin(obj));
            });
        })
        .catch(err => {
          showErrorAlert(translate('Please Connect To Internet'));
          setLoading(false);
        });
    }
  };

  this.status(AuthReducer.status, [
    AUTH.LOGIN_REQUEST.type,
    () => {
      showErrorAlert(translate('Login Successfully Done!'));
    },
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    loadCrd();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header title={translate('Login')} back={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <TextInputItem
              value={userName}
              placeholder={translate('E_M')}
              onChangeText={text => setUserName(text)}
              marginTop={normalize(15)}
            />
            <TextInputItem
              value={password}
              placeholder={translate('Password')}
              onChangeText={text => setPassword(text)}
              marginTop={normalize(15)}
              isSecure={true}
            />
            <Button
              backgroundColor={Colors.lightBlack}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => loginRequest()}
              title={translate('Login')}></Button>
            <Button
              textColor={Colors.red}
              fontSize={normalize(12)}
              marginBottom={normalize(2)}
              onPress={() => {
                props.navigation.navigate('ForgotPassword');
              }}
              title={translate('Forget your password')}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          AuthReducer.status === AUTH.LOGIN_REQUEST.type || loading === true
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
