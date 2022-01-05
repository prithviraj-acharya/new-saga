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
import {signup} from '../../redux/action/AuthAction';
import {setUserForm} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {AUTH} from '../../redux/store/TypeConstants';

//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import constants from '../../utils/helpers/constants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Selector from '../../components/Selector';
import DateTimePicker from '../../components/DateTimePicker';
import TextInputItem from '../../components/TextInputItem';
import Picker from '../../components/Picker';
import MyStatusBar from '../../utils/MyStatusBar';

import moment from 'moment';

let individualsCheck = '';
let companyName = '';
let address = '';
let zipCode = '';
let cityValue = '';
let referralCode = '';
let name = '';
let surname = '';
let language = 1;
export default function Register2(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  individualsCheck = props.route?.params?.check;
  companyName = props.route?.params?.companyName;
  address = props.route?.params?.address;
  zipCode = props.route?.params?.zipCode;
  cityValue = props.route?.params?.cityValue;
  referralCode = props.route?.params?.referralCode;
  name = props.route?.params?.name;
  surname = props.route?.params?.surname;

  const [showPicker, setShowPicker] = useState(false);
  const [nationalityData, setNationalityData] = useState([]);

  const [phoneNumber, setPhoneNumber] = useState(
    GeneralReducer?.tempUserData?.phoneNumber ?? '',
  );
  const [country_code, setCountry_code] = useState(GeneralReducer?.tempUserData?.country_code??'+41');
  const [email, setEmail] = useState(GeneralReducer?.tempUserData?.email ?? '');
  const [dob, setDob] = useState(
    GeneralReducer?.tempUserData?.dob ?? new Date('2000/01/01'),
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateLang, setDateLang] = useState(1);
  const [nationality, setNationality] = useState(
    GeneralReducer?.tempUserData?.nationality ?? '',
  );

  const signupRequest = () => {
    const textCheck = /^[a-zA-Z ]*$/;
    let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNoCheck = /^[0-9]{8,15}$/;
    let countryCodeCheck = /^\+(\d{1}\-)?(\d{1,3})$/;
    if (individualsCheck == false) {
      if (!phoneNumber.trim()) {
        showErrorAlert(translate('Please enter phone number!'));
      } else if (!phoneNoCheck.test(phoneNumber.trim())) {
        showErrorAlert(translate('Please enter a valid phone number!'));
      } else if (!countryCodeCheck.test(country_code.trim())) {
        showErrorAlert(translate('Enter a valid country code'));
      } else if (!email.trim()) {
        showErrorAlert(translate('Please enter email!'));
      } else if (!emailCheck.test(email.trim())) {
        showErrorAlert(translate('Please enter a valid email!'));
      } else {
        isInternetConnected()
          .then(() => {
            dispatch(
              signup({
                type: 'company',
                first_name: companyName?.trim(),
                email: email?.toLocaleLowerCase()?.trim(),
                phone: phoneNumber?.trim(),
                country_code: country_code.trim(),
                address: address?.trim(),
                zip: zipCode?.trim(),
                city: cityValue,
                referral_code: referralCode?.trim(),
                language: language,
              }),
            );
          })
          .catch(err => {
            showErrorAlert(translate('Please Connect To Internet'));
          });
      }
    } else {
      if (!moment(dob).isValid() || dob == null) {
        showErrorAlert(translate('Please select a valid birth date!'));
      } else if (!nationality.trim()) {
        showErrorAlert(translate('Please enter your nationality!'));
      } else if (!phoneNumber.trim()) {
        showErrorAlert(translate('Please enter phone number!'));
      } else if (!phoneNoCheck.test(phoneNumber.trim())) {
        showErrorAlert(translate('Please enter a valid phone number!'));
      } else if (!countryCodeCheck.test(country_code.trim())) {
        showErrorAlert(translate('Enter a valid country code'));
      } else if (!email.trim()) {
        showErrorAlert(translate('Please enter email!'));
      } else if (!emailCheck.test(email.trim())) {
        showErrorAlert(translate('Please enter a valid email!'));
      } else {
        isInternetConnected()
          .then(() => {
            dispatch(
              signup({
                type: 'individuals',
                first_name: name?.trim(),
                last_name: surname?.trim(),
                email: email?.toLocaleLowerCase()?.trim(),
                phone: phoneNumber?.trim(),
                country_code: country_code.trim(),
                address: address?.trim(),
                zip: zipCode?.trim(),
                city: cityValue,
                dob: moment(dob).toISOString(),
                nationality: nationality?.trim(),
                referral_code: referralCode?.trim(),
                language: language,
              }),
            );
          })
          .catch(err => {
            showErrorAlert(translate('Please Connect To Internet'));
          });
      }
    }
  };

  this.status(AuthReducer.status, [
    AUTH.SIGNUP_REQUEST.type,
    () => {
      props.navigation.navigate('OTPVerification', {
        phone:phoneNumber?.trim(),
        countryCode:country_code?.trim()
      });
    },
    () => {
      showErrorAlert(AuthReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    EncryptedStorage.getItem(constants.LANGUAGE)
      .then(res => {
        if (res != null) {
          const rs = JSON.parse(res);
          language = rs.value ? rs.value : 1;
          setDateLang(language);
        } else {
          language = 1;
          setDateLang(language);
        }
      })
      .catch(ex => {
        language = 1;
        setDateLang(language);
      });
  }, []);
  useEffect(() => {
    setNationalityData([
      translate('Swiss'),
      translate('French'),
      translate('Italian'),
      translate('Portuguese'),
    ]);
  }, []);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header title={translate('Register')} back={true} {...props} />
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
                marginBottom: normalize(15),
                overflow: 'hidden',
              }}>
              <View
                style={{
                  backgroundColor: Colors.red,
                  width: '50%',
                  height: normalize(6),
                }}></View>
            </View>

            {individualsCheck == true ? (
              <>
                <Selector
                  text={dob ? moment(dob).format('DD.MM.YYYY') : ''}
                  placeholder={translate('Date of birth')}
                  marginTop={normalize(15)}
                  icon={Icons.calendar}
                  onPress={() => setDatePickerVisible(true)}
                />
                <Selector
                  text={nationality}
                  placeholder={translate('Nationality')}
                  marginTop={normalize(15)}
                  onPress={() => setShowPicker(true)}
                  icon={Icons.down_arrow}
                />
              </>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <TextInputItem
                value={country_code}
                onChangeText={text => {
                  setCountry_code(text);
                  dispatch(
                    setUserForm({
                      phoneNumber: phoneNumber,
                      email: email,
                      dob: dob,
                      nationality: nationality,
                      country_code:text
                    }),
                  );
                }}
                marginTop={normalize(15)}
                maxLength={5}
                flex={0.3}
                paddingLeft={0}
                paddingRight={0}
                marginRight={normalize(5)}
                placeholder="+00"
              />
              <TextInputItem
                value={phoneNumber}
                placeholder={translate('Phone number')}
                onChangeText={text => {
                  setPhoneNumber(text);
                  dispatch(
                    setUserForm({
                      phoneNumber: text,
                      email: email,
                      dob: dob,
                      nationality: nationality,
                      country_code:country_code
                    }),
                  );
                }}
                marginTop={normalize(15)}
                keyboardType="numeric"
                maxLength={15}
                flex={1}
              />
            </View>
            <TextInputItem
              value={email}
              placeholder={translate('Email')}
              onChangeText={text => {
                setEmail(text);
                dispatch(
                  setUserForm({
                    phoneNumber: phoneNumber,
                    email: text,
                    dob: dob,
                    nationality: nationality,
                    country_code:country_code
                  }),
                );
              }}
              marginTop={normalize(15)}
            />
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => signupRequest()}
              title={translate('Nxt')}></Button>
          </View>
        </ScrollView>
        <DateTimePicker
          value={dob == null ? new Date(moment().toISOString()) : dob}
          maxDate={new Date(moment().toISOString())}
          minDate={null}
          dateTimePickerVisible={datePickerVisible}
          onDateChange={val => {
            setDob(val);
            dispatch(
              setUserForm({
                phoneNumber: phoneNumber,
                email: email,
                dob: val,
                nationality: nationality,
              }),
            );
          }}
          onBackdropPress={() => setDatePickerVisible(false)}
          onPressDone={() => setDatePickerVisible(false)}
          lang={dateLang == 2 ? 'en' : 'fr'}
        />
        <Picker
          backgroundColor={Colors.white}
          dataList={nationalityData}
          modalVisible={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setNationality(item);
                  setShowPicker(false);
                  dispatch(
                    setUserForm({
                      phoneNumber: phoneNumber,
                      email: email,
                      dob: dob,
                      nationality: item,
                    }),
                  );
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    nationality == item ? {color: Colors.red} : null,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
      <Loader visible={AuthReducer.status === AUTH.SIGNUP_REQUEST.type} />
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
