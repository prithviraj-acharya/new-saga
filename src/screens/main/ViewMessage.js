import React, {useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  PermissionsAndroid,
  Alert,
  Dimensions,
} from 'react-native';
import moment from 'moment';
//import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {sendMessage, getMessage} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import ImageLoader from '../../components/ImageLoader';

var RNFetchBlob = require('rn-fetch-blob').default;
let id = '';
let title = '';
const {width, height} = Dimensions.get('screen');
export default function ViewMessage(props) {
  id = props?.route?.params?.id;
  title = props?.route?.params?.title;

  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const userID = ProfileReducer?.profileDetails?.id;

  const [shortMessage, setShortMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [loading, setLoader] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [bigImage, setBigImage] = useState(null);

  const getMessageReq = () => {
    isInternetConnected()
      .then(() => {
        if (id) {
          dispatch(getMessage(id));
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(GeneralReducer.status, [
    GENERAL.GET_MESSAGE_REQUEST.type,
    () => {
      if (GeneralReducer?.messageDetails) {
        let lastMesageDate = '';
        let obj = {
          id: id,
          title: title,
          data: GeneralReducer?.messageDetails?.map(item => {
            const date = moment(item?.created_at).isValid()
              ? moment(item?.created_at)
              : moment();
            let printDate = false;
            if (lastMesageDate != date.format('DD.MM.YYYY')) {
              printDate = true;
              lastMesageDate = date.format('DD.MM.YYYY');
            }
            return {
              id: item?.id,
              files: item?.files,
              heading: item?.message_subject && item?.message_subject!=""?translate(item?.message_subject):item?.message_subject,
              details: item?.message,
              date: date,
              admin: item?.sender_id != userID,
              printDate,
            };
          }),
        };
        setMessageData(obj);
      }
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  const isThisImage = path => {
    let ism = false;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (allowedExtensions.exec(path.toLowerCase())) {
      ism = true;
    }
    return ism;
  };
  const downloadFile = async (path = '') => {
    const supported = await Linking.canOpenURL(path);
    if (supported) {
      //await Linking.openURL(Tattachment);
      try {
        if (Platform.OS == 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            androidDownload(path);
          } else {
            Alert.alert(
              translate('Permission Denied!'),
              translate('YND'),
            );
          }
        } else {
          iosDownload(path);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const androidDownload = (path = '') => {
    try {
      const filename = path?.replace(/^.*[\\\/]/, '');
      setLoader(true);
      const {dirs} = RNFetchBlob.fs;
      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: filename,
          path: `${dirs.DownloadDir}/${filename}`,
        },
      })
        .fetch('GET', path, {})
        .then(res => {
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
        });
    } catch (ex) {
      setLoader(false);
    }
  };
  const iosDownload = (path = '') => {
    try {
      const filename = path?.replace(/^.*[\\\/]/, '');
      setLoader(true);
      const {dirs} = RNFetchBlob.fs;
      const dirToSave =
        Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: filename,
        path: `${dirToSave}/${filename}`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: 'pdf',
        },
      });
      RNFetchBlob.config(configOptions)
        .fetch('GET', path, {})
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
        });
    } catch (Ex) {
      setLoader(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getMessageReq();
      return () => {};
    }, []),
  );
  const selectFile = async () => {
    try {
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
            let imageObj = {
              name: response?.assets[0]?.fileName,
              type: response?.assets[0]?.type,
              uri:
                Platform.OS === 'android'
                  ? response?.assets[0]?.uri
                  : response?.assets[0]?.uri.replace('file://', ''),
            };
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            if (allowedExtensions.exec(imageObj?.name?.toLowerCase())) {
              setIsImage(true);
            } else {
              setIsImage(false);
            }
            setSelectedFile(imageObj);
            //console.log(response);
          } else {
            showErrorAlert(translate("The image exceeds the maximum allowed size (25 MB)"));
          }
        }
      });

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
    } catch (err) {
      // if (DocumentPicker.isCancel(err)) {
      // } else {
      //   throw err;
      // }
    }
  };
  const sendMessageReq = () => {
    isInternetConnected()
      .then(() => {
        if (shortMessage?.trim() == '' && selectedFile == null) {
          showErrorAlert(translate('Please write your message!'));
        } else {
          var formData = new FormData();
          formData.append('message', shortMessage?.trim());
          formData.append('insurance_id', id);
          if (selectedFile != null) {
            formData.append('file[' + 0 + ']', selectedFile);
          }
          dispatch(sendMessage(formData));
        }
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(GeneralReducer.status, [
    GENERAL.SEND_MESSAGE_REQUEST.type,
    () => {
      setShortMessage('');
      setSelectedFile(null);
      getMessageReq();
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  const renderItem = useCallback(
    ({item, index}) => (
      <View style={{paddingHorizontal: normalize(20)}}>
        {item?.printDate ? (
          <View
            style={{
              backgroundColor: '#454545',
              alignSelf: 'center',
              borderRadius: normalize(6),
              paddingHorizontal: normalize(10),
              paddingVertical: normalize(2),
              marginBottom: normalize(15),
              marginTop: index != 0 ? normalize(10) : 0,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.Montserrat_SemiBold,
                fontSize: normalize(11.5),
                lineHeight: normalize(17),
                letterSpacing: normalize(0.2),
              }}>
              {translate(moment(item?.date).format('MMM'))+ " "+ moment(item?.date).format('DD, YYYY')}
            </Text>
          </View>
        ) : null}
        <View
          key={index}
          style={{
            backgroundColor: item?.admin == false ? '#ffe9ea' : '#f5f5f5',
            padding: normalize(10),
            paddingBottom: normalize(5),
            marginBottom: normalize(10),
            borderRadius: normalize(10),
            width: '80%',
            marginLeft: item?.admin == false ? 'auto' : 0,
            marginRight: item?.admin == true ? 'auto' : 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 2,
            position: 'relative',
          }}>
          {item?.files
            ? item?.files?.map((item2, ii) =>
                isThisImage(item2?.file) ? (
                  <>
                    <ImageLoader
                      key={ii}
                      source={{
                        uri: item2?.file,
                      }}
                      height={normalize(150)}
                      width="100%"
                      borderRadius={normalize(7)}
                      loaderColor={Colors.red}
                      loaderBorderColor={Colors.red}
                      loaderSize="small"
                      onPress={() => setBigImage(item2?.file)}
                    />
                    <TouchableOpacity
                      style={{
                        borderWidth: normalize(1),
                        borderColor:
                          item?.admin == false ? Colors.red : '#5d5d5d',
                        borderRadius: normalize(50),
                        marginTop: normalize(10),
                        padding: normalize(5),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: normalize(25),
                        height: normalize(25),
                        position: 'relative',
                        marginBottom: normalize(10),
                        zIndex: 1,
                      }}
                      onPress={() => {
                        downloadFile(item2?.file);
                      }}
                      activeOpacity={0.6}>
                      <Image
                        source={Icons.download}
                        style={{
                          height: normalize(12),
                          width: normalize(12),
                          tintColor:
                            item?.admin == false ? Colors.red : '#5d5d5d',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={{
                      borderWidth: normalize(1),
                      borderColor: Colors.white,
                      borderRadius: normalize(5),
                      marginTop: normalize(10),
                      padding: normalize(5),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      downloadFile(item2?.file);
                    }}
                    activeOpacity={0.6}>
                    <Image
                      source={Icons.document}
                      style={{
                        height: normalize(20),
                        width: normalize(20),
                        tintColor:
                          item?.admin == false ? Colors.red : '#5d5d5d',
                      }}
                      resizeMode="contain"
                    />

                    <Text
                      style={{
                        color: Colors.black,
                        fontFamily: Fonts.Montserrat_SemiBold,
                        fontSize: normalize(11.5),
                        lineHeight: normalize(17),
                        paddingHorizontal: normalize(10),
                        flex: 1,
                      }}
                      numberOfLines={1}>
                      {item2?.file?.replace(/^.*[\\\/]/, '')}
                    </Text>
                    <Image
                      source={Icons.download}
                      style={{
                        height: normalize(12),
                        width: normalize(12),
                        tintColor:
                          item?.admin == false ? Colors.red : '#5d5d5d',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ),
              )
            : null}
          {item?.heading && item?.heading != '' ? (
            <Text
              style={{
                color: Colors.black,
                fontFamily: Fonts.Montserrat_SemiBold,
                fontSize: normalize(12),
                lineHeight: normalize(12),
                paddingBottom: normalize(5),
              }}
              selectable={true}>
              {item?.heading}
            </Text>
          ) : null}
          {item?.details && item?.details != '' ? (
            <Text
              style={{
                color: Colors.black,
                fontFamily: Fonts.Montserrat_Regular,
                fontSize: normalize(11.5),
                lineHeight: normalize(14.5),
              }}
              selectable={true}>
              {item?.details}
            </Text>
          ) : null}
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.Montserrat_Regular,
              fontSize: normalize(10),
              lineHeight: normalize(10),
              textAlign: 'right',
              paddingTop: normalize(5),
            }}>
            {moment(item?.date).format('HH:mm')}
          </Text>
          <View
            style={[
              {
                height: normalize(10),
                width: normalize(10),
                backgroundColor: item?.admin == false ? '#ffe9ea' : '#f5f5f5',
                transform: [
                  {
                    rotate: '45deg',
                  },
                ],
                position: 'absolute',
                bottom: normalize(10),
              },
              item?.admin == false
                ? {right: -normalize(5)}
                : {left: -normalize(5)},
            ]}></View>
        </View>
      </View>
    ),
    [],
  );
  const keyExtractor = useCallback(item => item?.id?.toString(), []);
  const listRef = useRef();
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          back={true}
          title={messageData?.title}
          center={true}
          add={true}
          addPress={() => {
            props.navigation.navigate('NewMessage', {
              selectd: true,
              title: messageData?.title,
              insurance_id: messageData?.id,
            });
          }}
          {...props}
        />
        {bigImage && bigImage != '' ? (
          <View
            style={{
              height: height,
              width: '100%',
              backgroundColor: '#222222',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 99,
              justifyContent: 'flex-start',
            }}>
            <TouchableOpacity
              onPress={() => setBigImage(null)}
              style={{
                borderBottomColor: '#DADADA',
                borderBottomWidth: normalize(1),
                paddingVertical: normalize(10),
                backgroundColor: Colors.white,
                height: normalize(40),
              }}>
              <Image
                style={{height: normalize(15)}}
                source={Icons.close}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ImageLoader
                source={{
                  uri: bigImage,
                }}
                height={height - normalize(100)}
                width="100%"
                marginTop={-normalize(10)}
                loaderColor={Colors.white}
                loaderBorderColor="#222222"
                backgroundColor="#222222"
                resizeMode="contain"
                loaderSize="small"
              />
            </View>
          </View>
        ) : null}

        <View style={{flex: 1}}>
          {messageData?.data && (
            <FlatList
              ref={listRef}
              pagingEnabled={false}
              legacyImplementation={false}
              keyExtractor={keyExtractor}
              showsHorizontalScrollIndicator={false}
              data={messageData?.data}
              contentContainerStyle={{
                paddingVertical: normalize(20),
              }}
              maxToRenderPerBatch={10}
              onContentSizeChange={() => {
                if (
                  listRef &&
                  GeneralReducer.status !== GENERAL.GET_MESSAGE_REQUEST.type
                ) {
                  setTimeout(() => listRef.current.scrollToEnd(false), 100);
                }
              }}
              renderItem={renderItem}
            />
          )}
          {!messageData?.data || messageData?.data?.length == 0 ? (
            <View
              style={{
                padding: normalize(20),
              }}>
              <View
                style={{
                  borderWidth: normalize(1),
                  borderColor: '#DDDDDD',
                  borderRadius: normalize(10),
                  padding: normalize(10),
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(13.5),
                    lineHeight: normalize(13.5),
                    paddingVertical: normalize(15),
                    textAlign: 'center',
                  }}
                  numberOfLines={1}>
                  {translate("No Messages Found")}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View
          style={{
            borderTopColor: '#cccccc',
            borderTopWidth: normalize(1),
            paddingHorizontal: normalize(5),
            paddingTop: normalize(5),
            marginTop: normalize(5),
          }}>
          {selectedFile ? (
            <View
              style={{
                borderBottomWidth: normalize(1),
                borderBottomColor: '#DDDDDD',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: normalize(5),
                paddingBottom: normalize(5),
              }}>
              {isImage ? (
                <ImageLoader
                  source={{
                    uri: selectedFile?.uri,
                  }}
                  height={normalize(25)}
                  width={normalize(25)}
                  borderRadius={normalize(5)}
                  loaderColor={Colors.red}
                  loaderBorderColor={Colors.red}
                  loaderSize="small"
                />
              ) : (
                <Image
                  source={Icons.document}
                  style={{
                    height: normalize(20),
                    width: normalize(20),
                  }}
                  resizeMode="contain"
                />
              )}
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.Montserrat_SemiBold,
                  fontSize: normalize(11),
                  lineHeight: normalize(15),
                  paddingHorizontal: normalize(10),
                  flex: 1,
                }}
                numberOfLines={1}>
                {selectedFile?.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedFile(null);
                }}>
                <Image
                  source={Icons.close}
                  style={{
                    height: normalize(10),
                    width: normalize(10),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInputItem
              value={shortMessage}
              placeholder={translate("Type here")}
              onChangeText={text => setShortMessage(text)}
              borderRadius={normalize(5)}
              borderColor="#fff"
              height={normalize(40)}
              flex={1}
              marginLeft={normalize(0)}
              paddingRight={normalize(5)}
              paddingTop={normalize(5)}
              multiline={true}
              maxLength={1500}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: normalize(25),
                width: normalize(25),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={selectFile}>
              <Image
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  tintColor: '#949494',
                }}
                source={Icons.Attach}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: normalize(30),
                width: normalize(30),
                backgroundColor: Colors.red,
                borderRadius: normalize(6),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: normalize(5),
              }}
              onPress={sendMessageReq}>
              <Image
                style={{
                  height: normalize(18),
                  width: normalize(18),
                }}
                source={Icons.message}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_MESSAGE_REQUEST.type ||
          loading ||
          GeneralReducer.status === GENERAL.SEND_MESSAGE_REQUEST.type
        }
      />
    </KeyboardAvoidingView>
  );
}
