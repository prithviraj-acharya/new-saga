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
import {Colors, Fonts, Icons} from '../../themes/Themes';
import {translate} from '../../utils/helpers/i18n';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import CheckBox from '../../components/CheckBox';
import Selector from '../../components/Selector';
import Picker from '../../components/Picker';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import showErrorAlert from '../../utils/helpers/Toast';

let allCity = [];
export default function Register1(props) {
  const [individualsCheck, setIndividualsCheck] = useState(true);
  const [companyCheck, setCompanyCheck] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const [cityData, setCityData] = useState([]);

  const validationCheck = () => {
    const nameCheck = /^[a-zA-Z ]*$/;
    var zipCodeCheck = /^[a-zA-Z0-9 ]{3,10}$/;
    if (individualsCheck == true) {
      if (!name.trim()) {
        showErrorAlert(translate('Please enter your name!'));
      } else if (!surname.trim()) {
        showErrorAlert(translate('Please enter a valid surname!'));
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
      } else {
        props.navigation.navigate('Register2', {
          check: individualsCheck,
          companyName: companyName.trim(),
          address: address.trim(),
          zipCode: zipCode.trim(),
          city: city,
          cityValue: cityValue,
          referralCode: referralCode.trim(),
          name: name.trim(),
          surname: surname.trim(),
        });
      }
    } else {
      if (!companyName.trim()) {
        showErrorAlert(translate('Please enter your company name!'));
      }
      if (companyName.trim().length < 2) {
        showErrorAlert(translate('Please enter a valid company name!'));
      } else if (address.trim().length < 2) {
        showErrorAlert(translate('Please enter a valid address!'));
      } else if (address.trim().length < 2) {
        showErrorAlert(translate('Please enter a valid address!'));
      } else if (!zipCode.trim()) {
        showErrorAlert(translate('Please enter a zip code!'));
      } else if (!zipCodeCheck.test(zipCode)) {
        showErrorAlert(translate('Please enter a valid zip code!'));
      } else if (!cityValue || cityValue == '') {
        showErrorAlert(translate('Please select a city'));
      } else {
        props.navigation.navigate('Register2', {
          check: individualsCheck,
          companyName: companyName.trim(),
          address: address.trim(),
          zipCode: zipCode.trim(),
          city: city,
          cityValue: cityValue,
          referralCode: referralCode.trim(),
          name: name.trim(),
          surname: surname.trim(),
        });
      }
    }
  };
  const setCityDDL = (code="") => {
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

  useEffect(() => {
    import('../../utils/swiss-city.json').then(dataJSON => {
      allCity = dataJSON.default;
    });
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
                  width: '30%',
                  height: normalize(6),
                }}></View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                active={individualsCheck}
                onChange={v => {
                  setIndividualsCheck(true);
                  setCompanyCheck(false);
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_Bold,
                  fontSize: normalize(12),
                  paddingHorizontal: normalize(10),
                  paddingRight: normalize(20),
                }}>
                {translate('Individuals')}
              </Text>
              <CheckBox
                active={companyCheck}
                onChange={v => {
                  setCompanyCheck(true);
                  setIndividualsCheck(false);
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_Bold,
                  fontSize: normalize(12),
                  paddingHorizontal: normalize(10),
                }}>
                {translate('Company')}
              </Text>
            </View>
            {individualsCheck == false ? (
              <TextInputItem
                value={companyName}
                placeholder={translate('Name of company')}
                onChangeText={text => setCompanyName(text)}
                marginTop={normalize(15)}
              />
            ) : (
              <>
                <TextInputItem
                  value={name}
                  placeholder={translate('Name')}
                  onChangeText={text => setName(text)}
                  marginTop={normalize(15)}
                  autoCapitalize="words"
                />
                <TextInputItem
                  value={surname}
                  placeholder={translate('Surname')}
                  onChangeText={text => setSurname(text)}
                  marginTop={normalize(15)}
                  autoCapitalize="words"
                />
              </>
            )}

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
            <TextInputItem
              value={referralCode}
              placeholder={translate('Referral code')}
              onChangeText={text => setReferralCode(text)}
              marginTop={normalize(15)}
            />
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => validationCheck()}
              title={translate('Nxt')}></Button>
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
      </SafeAreaView>
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
