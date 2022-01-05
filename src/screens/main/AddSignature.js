import React, {useEffect, useState, createRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
//import Modal from 'react-native-modal';
import {StackActions} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {updateSignature} from '../../redux/action/ProfileAction';
import {addMemberComapny} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {PROFILE, GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import CheckBox from '../../components/CheckBox';
import MyStatusBar from '../../utils/MyStatusBar';
import SignatureCapture from 'react-native-signature-capture';
import moment from 'moment';

//var RNFetchBlob = require('rn-fetch-blob').default;

let isTouch = false;
export default function AddSignature(props) {
  const isAdd = props?.route?.params?.isAdd;
  const data = props?.route?.params?.data;
  const isCompany = props?.route?.params?.isCompany;

  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  const [check, setCheck] = useState(false);
  const sign = createRef();

  const checkSignature = () => {
    if (check == false) {
      showErrorAlert(translate('Please accept the agreement before send!'));
    } else if (isTouch == false) {
      showErrorAlert(translate('Please do your signature!'));
    } else {
      sign.current.saveImage();
    }
  };

  const saveOnlySignature = (pathName, encoded) => {
    //'data:image/png;base64,' + encoded,
    isInternetConnected()
      .then(async () => {        
        let imageObj = {
          name: 'signature.png',
          type: 'image/png',
          uri:
            Platform.OS === 'android'
              ? pathName
              : pathName.replace('file://', ''),
        };
        var formData = new FormData();
        if (Platform.OS == 'android') {
          formData.append('file', encoded);
          formData.append('signature_type', false);
        }
        else{
          formData.append('file', imageObj);
        }         
        dispatch(updateSignature(formData));
      })
      .catch(err => {
        console.log(err);
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  const registerWithSignature = (pathName, encoded) => {
    //'data:image/png;base64,' + encoded,
    isInternetConnected()
      .then(async () => {
        var formData = new FormData();
        let imageObj = {
          name: 'signature.png',
          type: 'image/png',
          uri:
            Platform.OS === 'android'
              ? pathName
              : pathName.replace('file://', ''),
        };

        if (Platform.OS == 'android') {
          formData.append('signature', encoded);
          formData.append('signature_type', false);
        }
        else{
          formData.append('signature', imageObj);
        }                
        if (isCompany == true) {
          formData.append('first_name', data?.first_name);
          formData.append('phone', data?.phone);
          formData.append('country_code', data?.country_code);
          formData.append('address', data?.address);
          formData.append('zip', data?.zip);
          formData.append('city', data?.city);
          formData.append('email', data?.email);
          formData.append('user_type', data?.user_type);
        } else {
          formData.append('first_name', data?.first_name);
          formData.append('last_name', data?.last_name);
          formData.append('phone', data?.phone);
          formData.append('country_code', data?.country_code);
          formData.append('address', data?.address);
          formData.append('zip', data?.zip);
          formData.append('city', data?.city);
          formData.append('dob', data?.dob);
          formData.append('nationality', data?.nationality);
          formData.append('email', data?.email);
          formData.append('user_type', data?.user_type);
        }
       dispatch(addMemberComapny(formData));
      })
      .catch(err => {
        console.log(err);
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  const _onSaveEvent = ({pathName, encoded}) => {
    if (isAdd == true) {
      //console.log(registerWithSignature);
      registerWithSignature(pathName, encoded);
    } else {
      saveOnlySignature(pathName, encoded);
    }
  };

  this.status(ProfileReducer.status, [
    PROFILE.UPDATE_SIGNATURE_REQUEST.type,
    () => {
      isTouch = false;
    },
    () => {
      showErrorAlert(ProfileReducer?.error?.message);
    },
  ]);

  this.status(GeneralReducer.status, [
    GENERAL.ADD_MEMBER_COMPANY_REQUEST.type,
    () => {
      const popAction = StackActions.pop(2);
      props.navigation.dispatch(popAction);
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    isTouch = false;
  }, []);

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={isAdd == true} title={translate('Add Signature')} {...props} />
        <ScrollView bounces={false}>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                borderColor: '#dddddd',
                borderWidth: 1,
                width: '100%',
                borderRadius: normalize(15),
                height: normalize(280),
                overflow: 'hidden',
              }}>
              <SignatureCapture
                style={{height: normalize(230)}}
                ref={sign}
                showNativeButtons={false}
                saveImageFileInExtStorage={false}
                backgroundColor={Colors.white}
                strokeColor={Colors.black}
                onSaveEvent={_onSaveEvent}
                onDragEvent={() => (isTouch = true)}
                minStrokeWidth={4}
                maxStrokeWidth={4}
                viewMode={'portrait'}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: normalize(10),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_SemiBold,
                    color: Colors.red,
                    fontSize: normalize(15),
                  }}>
                  {translate('Write your signature')}
                </Text>
                <TouchableOpacity
                  style={{
                    height: normalize(25),
                    width: normalize(25),
                    backgroundColor: Colors.red,
                    marginLeft: normalize(10),
                    borderRadius: normalize(50),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    sign?.current?.resetImage();
                    isTouch = false;
                  }}>
                  <Image
                    source={Icons.reset}
                    style={{
                      height: normalize(18),
                      width: normalize(18),
                      tintColor: Colors.white,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PDFViewer', {
                  uri: isCompany?"https://myassuranceapp.ch/uploads/Mandatent_reprise_My_Assurance_2021.pdf":"https://myassuranceapp.ch/uploads/Mandat%20particulier%20My%20Assurance%202021%20-%20Personal%20(1).pdf",
                });
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                marginTop: normalize(20),
              }}>
              <Image
                style={{
                  height: normalize(30),
                  width: normalize(30),
                  marginRight: normalize(8),
                }}
                source={Icons.write}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_Bold,
                  color: Colors.black,
                  fontSize: normalize(15),
                }}>
                {translate('PDF broker mandate')}
              </Text>
              <Image
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  position: 'absolute',
                  right: 0,
                }}
                source={Icons.right_arrow}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: normalize(20),
              }}>
              <CheckBox
                style={{position: 'relative', top: normalize(-5)}}
                active={check}
                onChange={v => setCheck(v)}
              />
              <View
                style={{
                  position: 'relative',
                  top: -normalize(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_Regular,
                    fontSize: normalize(13),
                    lineHeight: normalize(15),
                    paddingHorizontal: normalize(10),
                    paddingRight: normalize(25),
                  }}>
                  {translate('CTx')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(20),
                width: '100%',
                marginLeft: 'auto',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_Regular,
                  fontSize: normalize(13),
                  lineHeight: normalize(15),
                }}>
                {translate('CTx2')}
              </Text>
              <Button
                backgroundColor={Colors.red}
                marginBottom={normalize(2)}
                marginTop={normalize(30)}
                onPress={() => checkSignature()}
                title={translate('Send')}></Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          ProfileReducer.status === PROFILE.UPDATE_SIGNATURE_REQUEST.type ||
          ProfileReducer.status === PROFILE.GET_PROFILE_REQUEST.type ||
          GeneralReducer.status === GENERAL.ADD_MEMBER_COMPANY_REQUEST.type
        }
      />
    </>
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
