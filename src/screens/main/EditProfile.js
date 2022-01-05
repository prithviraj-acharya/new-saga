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
import {launchImageLibrary} from 'react-native-image-picker';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {updateProfile} from '../../redux/action/ProfileAction';
import Loader from '../../utils/helpers/Loader';
import {PROFILE} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import Selector from '../../components/Selector';
import ImageLoader from '../../components/ImageLoader';
import Picker from '../../components/Picker';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import DateTimePicker from '../../components/DateTimePicker';
import Button from '../../components/Button';
import moment from 'moment';

let allCity = [];

export default function EditProfile(props) {
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const isCompanyProfile =
    ProfileReducer?.profileDetails?.role_name === 'COMPANY';
  const isEng = ProfileReducer?.profileDetails?.language;
  const [cityList, setCityList] = useState([]);

  const [userImage, setUserImage] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [userPin, setUserPin] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dob, setDob] = useState(new Date('2000/01/01'));
  const [IBAN, setIBAN] = useState('');

  const [userCity, setUserCity] = useState('');
  const [userNationality, setUserNationality] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [country_code, setCountry_code] = useState('+41');
  const [userEmail, setUserEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [address, setAddress] = useState('');
  const [cityValue, setCityValue] = useState('');

  const [nationalityData, setNationalityData] = useState([]);
  const [showPicker2, setShowPicker2] = useState(false);

  const updateProfileReq = () => {
    isInternetConnected()
      .then(() => {
        const textCheck = /^[a-zA-Z ]*$/;
        var zipCodeCheck = /^[a-zA-Z0-9 ]{3,10}$/;
        let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let phoneNoCheck =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (isCompanyProfile == true) {
          if (!userFirstName.trim()) {
            showErrorAlert(translate('Please enter your company name!'));
          }
          if (userFirstName.trim().length < 2) {
            showErrorAlert(translate('Please enter a valid company name!'));
          } else if (address.trim().length < 2) {
            showErrorAlert(translate('Please enter a valid address!'));
          } else if (!userPin.trim()) {
            showErrorAlert(translate('Please enter a zip code!'));
          } else if (!zipCodeCheck.test(userPin.trim())) {
            showErrorAlert(translate('Please enter a valid zip code!'));
          } else if (!cityValue || cityValue == '') {
            showErrorAlert(translate('Please select a city'));
          } else {
            var formData = new FormData();
            formData.append('first_name', userFirstName?.trim());
            formData.append('zip', userPin?.trim());
            formData.append('city', cityValue?.trim());
            formData.append('address', address?.trim());
            formData.append('bank_account', IBAN?.trim());
            if (userImageFile != null) {
              formData.append('profile_photo', userImageFile);
            }

            dispatch(updateProfile(formData, true));
          }
        } else {
          if (!userFirstName.trim()) {
            showErrorAlert(translate('Please enter your name!'));
          } else if (!userLastName.trim()) {
            showErrorAlert(translate('Please enter your surname!'));
          } else if (address.trim().length < 2) {
            showErrorAlert(translate('Please enter a valid address!'));
          } else if (!userPin.trim()) {
            showErrorAlert(translate('Please enter a zip code!'));
          } else if (!zipCodeCheck.test(userPin.trim())) {
            showErrorAlert(translate('Please enter a valid zip code!'));
          } else if (!cityValue || cityValue == '') {
            showErrorAlert(translate('Please select a city'));
          } else if (!moment(dob).isValid() || dob == null) {
            showErrorAlert(translate('Please select a valid birth date!'));
          } else if (!userNationality.trim()) {
            showErrorAlert(translate('Please enter your nationality!'));
          } else {
            var formData = new FormData();
            formData.append('first_name', userFirstName?.trim());
            formData.append('last_name', userLastName?.trim());
            formData.append('zip', userPin?.trim());
            formData.append('city', cityValue?.trim());
            formData.append('address', address?.trim());
            formData.append('dob', moment(dob).toISOString());
            formData.append('nationality', userNationality?.trim());
            formData.append('bank_account', IBAN?.trim());
            if (userImageFile != null) {
              formData.append('profile_photo', userImageFile);
            }

            dispatch(updateProfile(formData, true));
          }
        }
      })
      .catch(err => {
        console.log(err);
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  const setCityDDL = (code = '') => {
    if (code == '') {
      setCityList([]);
      setUserCity('');
      setCityValue('');
    } else {
      const DATA = allCity[code.trim()];
      if (Array.isArray(DATA)) {
        setCityList(DATA.map(item => ({name: item})));
        if (DATA.length >= 1) {
          setUserCity(DATA[0]);
          setCityValue(DATA[0]);
        }
      } else {
        setUserCity('');
        setCityValue('');
        setCityList([]);
      }
    }
  };
  const loadData = () => {
    const userDate = ProfileReducer?.profileDetails;
    setUserImage(
      userDate?.profile_photo_path == ''
        ? userDate?.profile_photo_url
        : userDate?.profile_photo_path,
    );
    setUserFirstName(userDate?.first_name ?? '');
    setUserLastName(userDate?.last_name ?? '');
    setUserPin(userDate?.zip ?? '');
    if (userDate?.dob && userDate?.dob != '') {
      userDate.dob = userDate.dob.split('.').reverse().join('.');
    }
    setDob(
      moment(userDate?.dob).isValid() == true
        ? moment(userDate?.dob)
        : new Date('2000/01/01'),
    );
    setUserCity(userDate?.city ?? '');
    setCityValue(userDate?.city ?? '');
    setCountry_code(userDate?.country_code ?? '+41');
    setUserNationality(userDate?.nationality ?? '');
    setUserPhone(userDate?.phone ?? '');
    setUserEmail(userDate?.email ?? '');
    setAddress(userDate?.address ?? '');
    setIBAN(userDate?.bank_account ?? '');
    if (userDate?.zip && userDate?.zip != '') {
      setCityDDL(userDate?.zip ?? '');
    }
  };
  useEffect(() => {
    import('../../utils/swiss-city.json')
      .then(dataJSON => {
        allCity = dataJSON.default;
        loadData();
      })
      .catch(ex => {
        loadData();
      });
    setNationalityData([
      translate('Swiss'),
      translate('French'),
      translate('Italian'),
      translate('Portuguese'),
    ]);
  }, []);

  const openCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        //path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
        showErrorAlert(translate('ImagePicker Error'));
      } else {
        if (response?.assets[0]?.fileSize <= 26214400) {
          setUserImage(response?.assets[0]?.uri);
          let imageObj = {
            name: response?.assets[0]?.fileName,
            type: response?.assets[0]?.type,
            uri:
              Platform.OS === 'android'
                ? response?.assets[0]?.uri
                : response?.assets[0]?.uri.replace('file://', ''),
          };
          setUserImageFile(imageObj);
          //console.log(response);
        } else {
          showErrorAlert(
            translate('The image exceeds the maximum allowed size (25 MB)'),
          );
        }
      }
    });
  };

  this.status(ProfileReducer.status, [
    PROFILE.UPDATE_PROFILE_REQUEST.type,
    () => {
      props.navigation.navigate('Profile');
      showErrorAlert(translate('Profile Updated Successfully'));
    },
    () => {
      showErrorAlert(ProfileReducer?.error?.message);
    },
  ]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={translate('Edit Profile')} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                width: '100%',
                borderRadius: normalize(15),
                overflow: 'hidden',
                padding: 6,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: normalize(130),
                    height: normalize(130),
                    borderRadius: normalize(130),
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                  <ImageLoader
                    source={{uri: userImage}}
                    height={normalize(130)}
                    width={normalize(130)}
                    borderRadius={normalize(130)}
                    loaderColor={Colors.red}
                    loaderBorderColor={Colors.red}
                    loaderSize="large"
                  />
                  {/* <View
                    style={{
                      width: normalize(130),
                      height: normalize(130),
                      borderRadius: normalize(130),
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{uri: userImage}}
                      style={{width: normalize(130), height: normalize(130)}}
                      resizeMode="cover"
                    />
                  </View> */}
                  <TouchableOpacity
                    style={{
                      width: normalize(40),
                      height: normalize(40),
                      borderRadius: normalize(60),
                      backgroundColor: '#C4C4C4',
                      alignSelf: 'flex-end',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: normalize(5),
                      bottom: 0,
                    }}
                    activeOpacity={0.8}
                    onPress={openCamera}>
                    <Image
                      source={Icons.camera}
                      style={{
                        width: normalize(25),
                        height: normalize(25),
                        alignSelf: 'center',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{marginTop: normalize(15)}}>
                <TextInputItem
                  value={userFirstName}
                  placeholder={
                    isCompanyProfile == true
                      ? translate('Name of company')
                      : translate('First Name')
                  }
                  onChangeText={text => setUserFirstName(text)}
                  marginTop={normalize(15)}
                  autoCapitalize="words"
                />
                {isCompanyProfile == false ? (
                  <TextInputItem
                    value={userLastName}
                    placeholder={translate('Surname')}
                    onChangeText={text => setUserLastName(text)}
                    marginTop={normalize(15)}
                    autoCapitalize="words"
                  />
                ) : null}

                {/* <TextInputItem
                  value={userName}
                  placeholder="Username"
                  onChangeText={text => setUserName(text)}
                  marginTop={normalize(15)}
                /> */}
                <TextInputItem
                  value={address}
                  placeholder={translate('Address')}
                  onChangeText={text => setAddress(text)}
                  marginTop={normalize(15)}
                  autoCapitalize="words"
                />

                <TextInputItem
                  value={userPin}
                  placeholder={translate('Zip code')}
                  onChangeText={text => {
                    setUserPin(text);
                    setCityDDL(text);
                  }}
                  marginTop={normalize(15)}
                  keyboardType="number-pad"
                />

                <Selector
                  text={userCity}
                  placeholder={translate('City')}
                  marginTop={normalize(15)}
                  onPress={() => {
                    if (!cityList || cityList.length == 0) {
                      showErrorAlert(
                        translate('No city found with your zip code!'),
                      );
                    } else {
                      setShowPicker(true);
                    }
                  }}
                  icon={Icons.down_arrow}
                />
                {isCompanyProfile == false ? (
                  <>
                    <Selector
                      text={dob ? moment(dob).format('DD.MM.YYYY') : ''}
                      placeholder={translate('Date of birth')}
                      marginTop={normalize(15)}
                      icon={Icons.calendar}
                      onPress={() => setDatePickerVisible(true)}
                    />

                    <Selector
                      text={userNationality}
                      placeholder={translate('Nationality')}
                      marginTop={normalize(15)}
                      onPress={() => setShowPicker2(true)}
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
                    onChangeText={text => setCountry_code(text)}
                    marginTop={normalize(15)}
                    maxLength={5}
                    flex={0.3}
                    paddingLeft={0}
                    paddingRight={0}
                    marginRight={normalize(5)}
                    editable={false}
                    placeholder="+00"
                  />
                  <TextInputItem
                    value={userPhone}
                    placeholder={translate('Mobile Number')}
                    onChangeText={text => setUserPhone(text)}
                    marginTop={normalize(15)}
                    keyboardType="number-pad"
                    editable={false}
                    flex={1}
                  />
                </View>

                <TextInputItem
                  value={userEmail}
                  placeholder={translate('Email')}
                  onChangeText={text => setUserEmail(text)}
                  marginTop={normalize(15)}
                  editable={false}
                />
                <TextInputItem
                  value={IBAN}
                  placeholder="IBAN- CHXX XXXX XXXX XXXX XXXX X"
                  onChangeText={text => setIBAN(text)}
                  marginTop={normalize(15)}
                />
                <Button
                  backgroundColor={Colors.red}
                  marginBottom={normalize(2)}
                  marginTop={normalize(25)}
                  title={translate('Save')}
                  onPress={updateProfileReq}></Button>
              </View>
            </View>
          </View>
        </ScrollView>
        <Picker
          backgroundColor={Colors.white}
          dataList={cityList}
          modalVisible={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setCityValue(item.name);
                  setUserCity(item.name);
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
                  setUserNationality(item);
                  setShowPicker2(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    userNationality == item ? {color: Colors.red} : null,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <DateTimePicker
          value={
            dob == null
              ? new Date(moment().toISOString())
              : new Date(moment(dob).toISOString())
          }
          maxDate={new Date(moment().toISOString())}
          minDate={null}
          dateTimePickerVisible={datePickerVisible}
          onDateChange={val => setDob(val)}
          onBackdropPress={() => setDatePickerVisible(false)}
          onPressDone={() => setDatePickerVisible(false)}
          lang={isEng == 2 ? 'en' : 'fr'}
        />
      </SafeAreaView>
      <Loader
        visible={ProfileReducer.status === PROFILE.UPDATE_PROFILE_REQUEST.type}
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
