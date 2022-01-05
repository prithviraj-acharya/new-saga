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
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
//import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {sendMessage} from '../../redux/action/GeneralAction';
import {getBuyedPolicyList} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL, POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import Selector from '../../components/Selector';
import Picker from '../../components/Picker';
import MyStatusBar from '../../utils/MyStatusBar';
import TextInputItem from '../../components/TextInputItem';
import ImageLoader from '../../components/ImageLoader';

export default function NewMessage(props) {
  const id = props?.route?.params?.id;
  const insurance_id = props?.route?.params?.insurance_id;
  const view = props?.route?.params?.view;
  const selectd = props?.route?.params?.selectd;
  const title = props?.route?.params?.title;

  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const PolicyReducer = useSelector(state => state.PolicyReducer);

  const [showPickerSubject, setShowPickerSubject] = useState(false);
  const [showPickerInsurance, setShowPickerInsurance] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [details, setDetails] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [subjectValue, setSubjectValue] = useState('');
  const [subjectData, setSubjectData] = useState([
    {
      name: translate('New insurance'),
      value: 'New insurance',
    },
    {
      name: translate('General question'),
      value: 'General question',
    },
    {
      name: translate('Report a claim'),
      value: 'Report a claim',
    },
    {
      name: translate('Request an quotation'),
      value: 'Request an quotation',
    },
    {
      name: translate('Request comparative offers'),
      value: 'Request comparative offers',
    },
    {
      name: translate('Change existing insurance'),
      value: 'Change existing insurance',
    },
    {
      name: translate('Cancel insurance'),
      value: 'Cancel insurance',
    },
    {
      name: translate('Change address'),
      value: 'Change address',
    },
    {
      name: translate('Modify payment'),
      value: 'Modify payment',
    },
  ]);

  const [insurance, setInsurance] = useState('');
  const [insuranceValue, setInsuranceValue] = useState(insurance_id ?? '');
  const [insuranceData, setInsuranceData] = useState(null);

  const chekIsImage = path => {
    const i = /(\.jpg|\.jpeg|\.png|\.gif)$/i.exec(path?.toLowerCase());
    return i;
  };
  const allPolicyReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getBuyedPolicyList());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(PolicyReducer.status, [
    POLICY.GET_BUYED_POLICY_REQUEST.type,
    () => {
      setInsuranceData(
        PolicyReducer?.buyedPolicyList?.map((item, i) => {
          if (insurance_id && insurance_id != '' && item?.id == insurance_id) {
            setInsurance(
              item?.title != null && item?.title != ''
                ? item?.insurance?.name + ' - ' + item?.title
                : item?.insurance?.name + ' - ' + item?.company?.company_name,
            );
          }
          return {
            name:
              item?.title != null && item?.title != ''
                ? item?.insurance?.name + ' - ' + item?.title
                : item?.insurance?.name + ' - ' + item?.company?.company_name,
            value: item?.id,
          };
        }),
      );
      if (view == true) {
        //getMessageReq();
      }
    },
    () => {
      if (view == true) {
        //getMessageReq();
      }
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);

  const sendMessageReq = () => {
    isInternetConnected()
      .then(() => {
        if (!subjectValue || subjectValue == '') {
          showErrorAlert(translate('Please select a subject!'));
        } else if (!insuranceValue || insuranceValue == '') {
          showErrorAlert(translate('Please select an insurance!'));
        } else if (details?.trim() == '') {
          showErrorAlert(translate('Please write your message!'));
        } else {
          var formData = new FormData();
          formData.append('message', details?.trim());
          formData.append('message_subject', subjectValue);
          formData.append('insurance_id', insuranceValue);
          if (selectedFile != null && selectedFile?.length > 0) {
            selectedFile?.map((item, i) => {
              formData.append('file[' + i + ']', item);
            });
          }
          dispatch(sendMessage(formData));
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(
    GeneralReducer.status,
    [
      GENERAL.SEND_MESSAGE_REQUEST.type,
      () => {
        showErrorAlert(translate('The message has been sent successfully!'));
        props.navigation.goBack();
      },
      () => {
        showErrorAlert(GeneralReducer?.error?.message);
      },
    ],
    // [
    //   GENERAL.GET_MESSAGE_REQUEST.type,
    //   () => {
    //     const dtls = GeneralReducer?.messageDetails;
    //     if (GeneralReducer?.messageDetails) {
    //       setInsuranceValue(dtls?.insurance_id);
    //       setSubject(dtls?.message_subject);
    //       setDetails(dtls?.message);
    //       setTattachment(dtls?.file == '' ? null : dtls?.file);
    //       insuranceData?.map(item => {
    //         if (item?.value == dtls?.insurance_id) {
    //           setInsurance(item?.name);
    //         }
    //       });
    //     }
    //   },
    //   () => {
    //     showErrorAlert(GeneralReducer?.error?.message);
    //   },
    // ],
  );
  const openMyCamera = () => {
    launchCamera(
      {
        cameraType: 'back',
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response?.errorCode) {
          showErrorAlert(response?.errorCode, true);
        } else {
          if (response.didCancel) {
            setModalVisible(false);
          } else if (response?.error) {
            showErrorAlert(translate('Camera Error'));
          } else {
            if (response?.assets[0]?.fileSize <= 26214400) {
              let imageObj = {
                name: response?.assets[0]?.fileName,
                type: response?.assets[0]?.type,
                uri:
                  Platform.OS === 'android'
                    ? response?.assets[0]?.uri
                    : response?.assets[0]?.uri.replace('file://', ''),
              };
              const temp = selectedFile ? [...selectedFile] : [];
              temp.push(imageObj);
              setSelectedFile(temp);
              setModalVisible(false);
            } else {
              showErrorAlert(
                translate('The image exceeds the maximum allowed size (25 MB)'),
              );
            }
          }
        }
      },
    );
  };
  const selectFile = async (isCamera = false) => {
    try {
      if (isCamera == true) {
        if (Platform.OS == 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: translate('Camera permission'),
              message: translate('Camera permission need to take picture'),
              buttonNegative: translate('Cancel'),
              buttonPositive: translate('OK'),
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            openMyCamera();
          } else {
            showErrorAlert(translate('Camera permission denied'));
            return;
          }
        } else {
          openMyCamera();
        }
      } else {
        let options = {
          storageOptions: {
            skipBackup: true,
            //path: 'images',
          },
        };
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            setModalVisible(false);
          } else if (response.error) {
            showErrorAlert(translate('ImagePicker Error'));
          } else {
            if (response?.assets[0]?.fileSize <= 26214400) {
              let imageObj = {
                name: response?.assets[0]?.fileName,
                type: response?.assets[0]?.type,
                uri:
                  Platform.OS === 'android'
                    ? response?.assets[0]?.uri
                    : response?.assets[0]?.uri.replace('file://', ''),
              };
              const temp = selectedFile ? [...selectedFile] : [];
              temp.push(imageObj);
              setSelectedFile(temp);
              setModalVisible(false);
            } else {
              showErrorAlert(
                translate('The image exceeds the maximum allowed size (25 MB)'),
              );
            }
          }
        });
      }

      // const res = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      // });
      // if (res.size <= 26214400) {
      //   var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      //   if (allowedExtensions.exec(res.name?.toLowerCase())) {
      //     setIsImage(true);
      //   } else {
      //     setIsImage(false);
      //   }

      //   setSelectedFile({
      //     name: res.name,
      //     type: res.type,
      //     uri:
      //       Platform.OS === 'android'
      //         ? res.uri
      //         : res.uri.replace('file://', ''),
      //   });
      // } else {
      //   showErrorAlert(
      //     'The attachment exceeds the maximum allowed size (25 MB)',
      //   );
      // }
    } catch (err) {}
  };
  useEffect(() => {
    allPolicyReq();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          close={true}
          title={selectd == true ? title : translate('Messages Us')}
          center={selectd == true}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <Selector
              text={subject}
              placeholder={translate('Select Subject')}
              onPress={() => setShowPickerSubject(true)}
              icon={view == true ? null : Icons.down_arrow}
              disabled={view == true}
            />
            {selectd == true ? null : (
              <Selector
                text={insurance}
                placeholder={translate('Choose Insurance')}
                marginTop={normalize(15)}
                onPress={() => {
                  if (insuranceData && insuranceData?.length > 0) {
                    setShowPickerInsurance(true);
                  } else {
                    showErrorAlert(translate('No Insurance Found'));
                  }
                }}
                icon={view == true ? null : Icons.down_arrow}
                disabled={view == true}
              />
            )}
            <TextInputItem
              value={details}
              placeholder={translate('Hello')}
              onChangeText={text => setDetails(text)}
              marginTop={normalize(15)}
              marginBottom={normalize(15)}
              borderRadius={normalize(10)}
              height={normalize(150)}
              paddingVertical={normalize(50)}
              multiline={true}
              maxLength={1500}
            />

            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: normalize(40),
                  width: normalize(view == true ? 140 : 110),
                  borderWidth: normalize(1),
                  borderRadius: normalize(6),
                  borderColor: '#DDDDDD',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingHorizontal: normalize(10),
                  paddingVertical: normalize(5),
                }}
                onPress={() => setModalVisible(true)}>
                <Image
                  style={{
                    height: normalize(20),
                    width: normalize(20),
                    marginRight: normalize(3),
                  }}
                  source={Icons.Attach}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(12),
                    color: Colors.black,
                  }}>
                  {translate('Attach file')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: normalize(40),
                  width: normalize(50),
                  backgroundColor: Colors.red,
                  borderRadius: normalize(6),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={sendMessageReq}>
                <Image
                  style={{
                    height: normalize(25),
                    width: normalize(25),
                  }}
                  source={Icons.message}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {selectedFile && selectedFile?.length > 0
              ? selectedFile?.map((item, i) => (
                  <View
                    key={i}
                    style={{
                      borderWidth: normalize(1),
                      borderColor: '#DDDDDD',
                      borderRadius: normalize(10),
                      marginTop: normalize(15),
                      padding: normalize(10),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {chekIsImage(item?.uri) ? (
                      <ImageLoader
                        source={{
                          uri: item?.uri,
                        }}
                        height={normalize(40)}
                        width={normalize(40)}
                        borderRadius={normalize(5)}
                        loaderColor={Colors.red}
                        loaderBorderColor={Colors.red}
                        loaderSize="small"
                      />
                    ) : (
                      <Image
                        source={Icons.document}
                        style={{
                          height: normalize(35),
                          width: normalize(35),
                        }}
                        resizeMode="contain"
                      />
                    )}
                    <Text
                      style={{
                        color: Colors.black,
                        fontFamily: Fonts.Montserrat_SemiBold,
                        fontSize: normalize(13.5),
                        lineHeight: normalize(17),
                        paddingHorizontal: normalize(15),
                        flex: 1,
                      }}
                      numberOfLines={1}>
                      {item?.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const temp = [...selectedFile];
                        temp.splice(i, 1);
                        setSelectedFile(temp);
                      }}>
                      <Image
                        source={Icons.close}
                        style={{
                          height: normalize(14),
                          width: normalize(14),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              : null}
          </View>
        </ScrollView>
        <Picker
          backgroundColor={Colors.white}
          dataList={subjectData}
          modalVisible={showPickerSubject}
          onBackdropPress={() => setShowPickerSubject(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSubject(item.name);
                  setSubjectValue(item.value);
                  setShowPickerSubject(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    subjectValue == item.name ? {color: Colors.red} : null,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <Picker
          backgroundColor={Colors.white}
          dataList={insuranceData}
          modalVisible={showPickerInsurance}
          onBackdropPress={() => setShowPickerInsurance(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setInsurance(item.name);
                  setInsuranceValue(item.value);
                  setShowPickerInsurance(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    insuranceValue == item.value ? {color: Colors.red} : null,
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
          PolicyReducer.status === POLICY.GET_BUYED_POLICY_REQUEST.type ||
          GeneralReducer.status === GENERAL.SEND_MESSAGE_REQUEST.type
        }
      />
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={modalVisible}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={200}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: Colors.white,
              borderTopEndRadius: normalize(15),
              borderTopStartRadius: normalize(15),
              maxHeight: props.height,
              padding: normalize(25),
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                padding: normalize(20),
                borderColor: Colors.black,
                borderWidth: normalize(1),
                marginHorizontal: normalize(10),
                borderRadius: normalize(10),
                borderStyle: 'dashed',
              }}
              onPress={() => {
                //setModalVisible(false);
                selectFile(true);
              }}>
              <Image
                source={Icons.camera2}
                style={{height: normalize(35), width: normalize(35)}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: normalize(20),
                borderColor: Colors.black,
                borderWidth: normalize(1),
                marginHorizontal: normalize(10),
                borderRadius: normalize(10),
                borderStyle: 'dashed',
              }}
              onPress={() => {
                //setModalVisible(false);
                selectFile(false);
              }}>
              <Image
                source={Icons.gallery}
                style={{height: normalize(35), width: normalize(35)}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
