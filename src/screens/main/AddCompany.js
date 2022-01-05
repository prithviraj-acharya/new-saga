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
  getMemberComapny,
  updateMemberComapny,
} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Selector from '../../components/Selector';
import Picker from '../../components/Picker';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';

let allCity = [];

export default function AddCompany(props) {
  const id = props?.route?.params?.id;
  const isUpdate = props?.route?.params?.edit;
  const dispatch = useDispatch();

  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const PolicyReducer = useSelector(state => state.PolicyReducer);

  const [showPicker, setShowPicker] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country_code, setCountry_code] = useState('+41');
  const [cityData, setCityData] = useState([]);

  const validationCheck = () => {
    var zipCodeCheck = /^[a-zA-Z0-9 ]{3,10}$/;
    let phoneNoCheck = /^[0-9]{8,15}$/;
    let countryCodeCheck = /^\+(\d{1}\-)?(\d{1,3})$/;
    let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!companyName.trim()) {
      showErrorAlert(translate('Please enter your company name!'));
    } else if (companyName.trim().length < 2) {
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
                first_name: companyName?.trim(),
                phone: phoneNumber?.trim(),
                country_code: country_code.trim(),
                address: address?.trim(),
                zip: zipCode?.trim(),
                city: cityValue,
                email: email?.trim(),
                user_type:"company"
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
          isCompany: true,
          data: {
            first_name: companyName?.trim(),
            phone: phoneNumber?.trim(),
            country_code: country_code.trim(),
            address: address?.trim(),
            zip: zipCode?.trim(),
            city: cityValue,
            email: email?.trim(),
            user_type:"company"
          },
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
        setCompanyName(GeneralReducer?.memberCompany?.full_name);
        setEmail(GeneralReducer?.memberCompany?.email);
        setAddress(GeneralReducer?.memberCompany?.address);
        setZipCode(GeneralReducer?.memberCompany?.zip);
        setCity(GeneralReducer?.memberCompany?.city);
        setCityValue(GeneralReducer?.memberCompany?.city);
        setPhoneNumber(GeneralReducer?.memberCompany?.phone);
        setCountry_code(GeneralReducer?.memberCompany?.country_code);
        
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
        }
      })
      .catch(ex => {
        if (isUpdate == true) {
          getDetails();
        }
      });
  }, []);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          title={translate(isUpdate == true ? 'Update Company' : 'Add Company')}
          back={true}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <TextInputItem
              value={companyName}
              placeholder={translate("Name of company")}
              onChangeText={text => setCompanyName(text)}
              autoCapitalize="words"
            />

            <TextInputItem
              value={address}
              placeholder={translate("Address")}
              onChangeText={text => setAddress(text)}
              marginTop={normalize(15)}
              autoCapitalize="words"
            />
            <TextInputItem
              value={zipCode}
              placeholder={translate("Zip code")}
              onChangeText={text => {
                setZipCode(text);
                setCityDDL(text);
              }}
              marginTop={normalize(15)}
            />
            <Selector
              text={city}
              placeholder={translate("City")}
              marginTop={normalize(15)}
              onPress={() => {
                if(!cityData || cityData.length==0){
                  showErrorAlert(translate('No city found with your zip code!'));
                }
                else{
                  setShowPicker(true)
                }
              }}
              icon={Icons.down_arrow}
            />
            <View style={{
              flexDirection:'row',
              flex:1
            }}>
              <TextInputItem
              value={country_code}
              onChangeText={text => setCountry_code(text)}
              marginTop={normalize(15)}
              maxLength={5}
              flex={.3}
              paddingLeft={0}
              paddingRight={0}
              marginRight={normalize(5)}
              placeholder="+00"
            />
            <TextInputItem
              value={phoneNumber}
              placeholder={translate("Phone number")}
              onChangeText={text => setPhoneNumber(text)}
              marginTop={normalize(15)}
              keyboardType="numeric"
              maxLength={15}
              flex={1}
            />
            </View>
            <TextInputItem
              value={email}
              placeholder={translate("Email")}
              onChangeText={text => setEmail(text)}
              marginTop={normalize(15)}
            />            
            <Button
              backgroundColor={Colors.red}
              marginBottom={normalize(2)}
              marginTop={normalize(30)}
              onPress={() => validationCheck()}
              title={translate("Submit")}></Button>
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
      <Loader
        visible={          
          GeneralReducer.status === GENERAL.GET_MEMBER_COMPANY_REQUEST.type ||
          GeneralReducer.status === GENERAL.UPDATE_MEMBER_COMPANY_REQUEST.type
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
