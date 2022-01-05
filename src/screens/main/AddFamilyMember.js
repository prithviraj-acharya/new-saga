import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
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
  getMemberComapny,
  updateMemberComapny,
} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import DateTimePicker from '../../components/DateTimePicker';
import Selector from '../../components/Selector';
import Picker from '../../components/Picker';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';

import moment from 'moment';

let allCity = [];

export default function AddFamilyMember(props) {
  const id = props?.route?.params?.id;
  const isUpdate = props?.route?.params?.edit;

  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const PolicyReducer = useSelector(state => state.PolicyReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const isEng = ProfileReducer?.profileDetails?.language;

  const [showPicker, setShowPicker] = useState(false);
  const [address, setAddress] = useState(
    ProfileReducer?.profileDetails?.address ?? '',
  );
  const [zipCode, setZipCode] = useState(
    ProfileReducer?.profileDetails?.zip ?? '',
  );
  const [city, setCity] = useState(ProfileReducer?.profileDetails?.city ?? '');
  const [cityValue, setCityValue] = useState(
    ProfileReducer?.profileDetails?.city ?? '',
  );
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country_code, setCountry_code] = useState('+41');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date('2000/01/01'));
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [nationality, setNationality] = useState(
    ProfileReducer?.profileDetails?.nationality ?? '',
  );
  const [cityData, setCityData] = useState([]);

  const [nationalityData, setNationalityData] = useState([]);
  const [showPicker2, setShowPicker2] = useState(false);

  const validationCheck = () => {
    const textCheck = /^[a-zA-Z ]*$/;
    var zipCodeCheck = /^[a-zA-Z0-9 ]{3,10}$/;
    let phoneNoCheck = /^[0-9]{8,15}$/;
    let countryCodeCheck = /^\+(\d{1}\-)?(\d{1,3})$/;
    let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!name.trim()) {
      showErrorAlert(translate('Please enter your name!'));
    } else if (!surname.trim()) {
      showErrorAlert(translate('Please enter your surname!'));
    } else if (address.trim().length < 2) {
      showErrorAlert(translate('Please enter a valid address!'));
    } else if (!zipCode.trim()) {
      showErrorAlert(translate('Please enter a zip code!'));
    } else if (!zipCodeCheck.test(zipCode.trim())) {
      showErrorAlert(translate('Please enter a valid zip code!'));
    } else if (!cityValue || cityValue == '') {
      showErrorAlert(translate('Please select a city'));
    } else if (!moment(dob).isValid() || dob == null) {
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
      if (isUpdate == true) {
        isInternetConnected()
          .then(() => {
            dispatch(
              updateMemberComapny({
                user_id: id,
                first_name: name?.trim(),
                last_name: surname?.trim(),
                phone: phoneNumber?.trim(),
                country_code: country_code.trim(),
                address: address?.trim(),
                zip: zipCode?.trim(),
                city: cityValue,
                dob: moment(dob).toISOString(),
                nationality: nationality?.trim(),
                email: email?.trim(),
                user_type: 'member',
              }),
            );
          })
          .catch(err => {
            console.log(err);
            showErrorAlert(translate('Please Connect To Internet'));
          });
      } else {
        props.navigation.navigate('AddSignature', {
          isAdd: true,
          isCompany: false,
          data: {
            first_name: name?.trim(),
            last_name: surname?.trim(),
            phone: phoneNumber?.trim(),
            country_code: country_code.trim(),
            address: address?.trim(),
            zip: zipCode?.trim(),
            city: cityValue,
            dob: moment(dob).toISOString(),
            nationality: nationality?.trim(),
            email: email?.trim(),
            user_type: 'member',
          },
        });
      }
    }
  };

  const setCityDDL = (code = '') => {
    if (code == '') {
      setCityData([]);
      setCity('');
      setCityValue('');
    } else {
      const DATA = allCity[code.trim()];
      if (Array.isArray(DATA)) {
        setCityData(DATA.map(item => ({name: item})));
        if (DATA.length >= 1) {
          setCity(DATA[0]);
          setCityValue(DATA[0]);
        }
      } else {
        setCity('');
        setCityValue('');
        setCityData([]);
      }
    }
  };

  this.status(
    GeneralReducer.status,
    [
      GENERAL.UPDATE_MEMBER_COMPANY_REQUEST.type,
      () => {
        props.navigation.goBack();
      },
      () => {
        showErrorAlert(GeneralReducer?.error?.message);
      },
    ],
    [
      GENERAL.GET_MEMBER_COMPANY_REQUEST.type,
      () => {
        setEmail(GeneralReducer?.memberCompany?.email);
        setAddress(GeneralReducer?.memberCompany?.address);
        setZipCode(GeneralReducer?.memberCompany?.zip);
        setCity(GeneralReducer?.memberCompany?.city);
        setCityValue(GeneralReducer?.memberCompany?.city);
        setPhoneNumber(GeneralReducer?.memberCompany?.phone);
        setCountry_code(GeneralReducer?.memberCompany?.country_code);

        setName(GeneralReducer?.memberCompany?.first_name);
        setSurname(GeneralReducer?.memberCompany?.last_name);
        let dobCh = GeneralReducer?.memberCompany?.dob;
        if (dobCh && dobCh != '') {
          dobCh = dobCh.split('.').reverse().join('.');
        }
        setDob(moment(dobCh).isValid() == true ? new Date(dobCh) : null);
        setNationality(GeneralReducer?.memberCompany?.nationality);
        if (
          GeneralReducer?.memberCompany?.zip &&
          GeneralReducer?.memberCompany?.zip != ''
        ) {
          setCityDDL(GeneralReducer?.memberCompany?.zip ?? '');
        }
      },
      () => {
        showErrorAlert(GeneralReducer?.error?.message);
      },
    ],
  );

  const getDetails = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getMemberComapny(id));
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  useEffect(() => {
    import('../../utils/swiss-city.json')
      .then(dataJSON => {
        allCity = dataJSON.default;
        if (isUpdate == true) {
          getDetails();
        } else {
          setCityDDL(zipCode);
        }
      })
      .catch(ex => {
        if (isUpdate == true) {
          getDetails();
        }
      });
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
        <Header
          title={translate(
            isUpdate == true ? 'Update Family Member' : 'Add Family Member',
          )}
          back={true}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <TextInputItem
              value={name}
              placeholder={translate('Name')}
              onChangeText={text => setName(text)}
              autoCapitalize="words"
            />
            <TextInputItem
              value={surname}
              placeholder={translate('Surname')}
              onChangeText={text => setSurname(text)}
              marginTop={normalize(15)}
              autoCapitalize="words"
            />

            <TextInputItem
              value={address}
              placeholder={translate('Address')}
              onChangeText={text => setAddress(text)}
              marginTop={normalize(15)}
              autoCapitalize="words"
            />
            <TextInputItem
              value={zipCode}
              placeholder={translate('Zip code')}
              onChangeText={text => {
                setZipCode(text);
                setCityDDL(text);
              }}
              marginTop={normalize(15)}
            />
            <Selector
              text={city}
              placeholder={translate('City')}
              marginTop={normalize(15)}
              onPress={() => {
                if (!cityData || cityData.length == 0) {
                  showErrorAlert(
                    translate('No city found with your zip code!'),
                  );
                } else {
                  setShowPicker(true);
                }
              }}
              icon={Icons.down_arrow}
            />
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
              onPress={() => setShowPicker2(true)}
              icon={Icons.down_arrow}
            />
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <TextInputItem
                value={country_code}
                onChangeText={text => setCountry_code(text)}
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
                onChangeText={text => setPhoneNumber(text)}
                marginTop={normalize(15)}
                keyboardType="numeric"
                maxLength={15}
                flex={1}
              />
            </View>

            <TextInputItem
              value={email}
              placeholder={translate('Email')}
              onChangeText={text => setEmail(text)}
              marginTop={normalize(15)}
            />
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => validationCheck()}
              title={translate('Submit')}></Button>
          </View>
        </ScrollView>
        <Picker
          backgroundColor={Colors.white}
          dataList={cityData}
          modalVisible={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setCity(item.name);
                  setCityValue(item.name);
                  setShowPicker(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    cityValue == item.name ? {color: Colors.red} : null,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <Picker
          backgroundColor={Colors.white}
          dataList={nationalityData}
          modalVisible={showPicker2}
          onBackdropPress={() => setShowPicker2(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setNationality(item);
                  setShowPicker2(false);
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
      <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_MEMBER_COMPANY_REQUEST.type ||
          GeneralReducer.status === GENERAL.UPDATE_MEMBER_COMPANY_REQUEST.type
        }
      />
      <DateTimePicker
        value={dob == null ? new Date(moment().toISOString()) : dob}
        maxDate={new Date(moment().toISOString())}
        minDate={null}
        dateTimePickerVisible={datePickerVisible}
        onDateChange={val => setDob(val)}
        onBackdropPress={() => setDatePickerVisible(false)}
        onPressDone={() => setDatePickerVisible(false)}
        lang={isEng == 2 ? 'en' : 'fr'}
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
