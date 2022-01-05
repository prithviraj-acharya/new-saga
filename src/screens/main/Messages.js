import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getMessagesList} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import Space from '../../components/Space';
import ImageLoader from '../../components/ImageLoader';
import MyStatusBar from '../../utils/MyStatusBar';

export default function Messages(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  const [search, setSearch] = useState('');
  const [mesageList, setmesageList] = useState(null);
  const [tempMesageList, setTempMesageList] = useState(null);

  const getAllMessages = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getMessagesList());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.MESSAGE_LIST_REQUEST.type,
    () => {
      const msgs = GeneralReducer?.messageList?.map((item, i) => {
        let title = item?.policy?.insurance?.name;
        let messageTitle = item?.policy?.insurance?.name;
        if (item?.policy?.title && item?.policy?.title != '') {
          title += ' - ' + item?.policy?.title;
          messageTitle += '\n' + item?.policy?.title;
        } else {
          title += ' - ' + item?.policy?.company?.company_name;
          messageTitle += '\n' + item?.policy?.company?.company_name;
        }
        return {
          title: title,
          messageTitle: messageTitle,
          text: item?.policy_last_message?.message==null?`${item?.policy_last_message.files?.length} files sent!`:item?.policy_last_message?.message,
          date: moment(item?.policy_last_message?.created_at).isValid()
            ? moment(item?.policy_last_message?.created_at).format('DD.MM.YYYY')
            : '',
          id: item?.policy?.id,
          count: item?.policy_unread_message_count,
          profileImage: item?.policy?.insurance?.icon,
        };
      });
      setmesageList(msgs);
      setTempMesageList(msgs);
    },
    () => {
      setmesageList([]);
      setTempMesageList([]);
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);
  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      setSearch('');
      getAllMessages();
      return () => {
        unsuscribe();
      };
    });
  }, []);

  const searchMessage = text => {
    if (Array.isArray(tempMesageList)) {
      if (text == '') {
        setmesageList(tempMesageList);
      } else {
        let tempData = tempMesageList.filter(item => {
          return (
            new String(item.title)
              .toLowerCase()
              .includes(text.toString().toLowerCase()) ||
            new String(item.text)
              .toLowerCase()
              .includes(text.toString().toLowerCase())
          );
        });
        setmesageList(tempData);
      }
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          title="Messages"
          {...props}
          add={true}
          addPress={() => props.navigation.navigate('NewMessage')}
        />
        <View style={{padding: normalize(20), flex: 1}}>
          <TextInputItem
            value={search}
            placeholder={translate("Search")}
            onChangeText={text => {
              setSearch(text);
              searchMessage(text);
            }}
            marginBottom={normalize(15)}
            borderRadius={normalize(15)}
            icon={Icons.search}
          />
          <Space size={normalize(15)} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {mesageList &&
              mesageList.map((item, inedx) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={inedx}
                  style={{
                    borderWidth: normalize(1),
                    borderColor: '#DDDDDD',
                    borderRadius: normalize(10),
                    marginBottom: normalize(15),
                    padding: normalize(10),
                    flexDirection: 'row',
                    display: 'flex',
                    position: 'relative',
                  }}
                  onPress={() =>
                    props.navigation.navigate('ViewMessage', {
                      id: item?.id,
                      title: item?.messageTitle,
                    })
                  }>
                  {item?.count > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        left: normalize(5),
                        top: normalize(5),
                        width: normalize(18),
                        height: normalize(18),
                        backgroundColor: '#222',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: normalize(50),
                        zIndex: 1,
                      }}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontFamily: Fonts.Montserrat_Bold,
                          fontSize: normalize(10.5),
                          lineHeight: normalize(10.5),
                        }}>
                        {item?.count}
                      </Text>
                    </View>
                  ) : null}

                  <ImageLoader
                    source={{uri: item?.profileImage}}
                    height={normalize(35)}
                    width={normalize(35)}
                    //borderRadius={normalize(50)}
                    loaderColor={Colors.red}
                    loaderBorderColor={Colors.red}
                    loaderSize="small"
                    resizeMode="contain"
                  />
                  {/* <View
                    style={{
                      height: normalize(47),
                      width: normalize(47),
                      borderRadius: normalize(50),
                      backgroundColor: Colors.red,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: Fonts.Montserrat_Regular,
                        fontSize: normalize(18),
                      }}>
                      M
                    </Text>
                  </View> */}
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: normalize(10),
                      paddingVertical: normalize(5),
                      paddingBottom: 0,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontFamily: Fonts.Montserrat_SemiBold,
                          fontSize: normalize(12),
                          lineHeight: normalize(12),
                          marginBottom: normalize(3),
                          flex: 1,
                        }}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: Colors.black,
                          fontFamily: Fonts.Montserrat_Regular,
                          fontSize: normalize(10.5),
                          lineHeight: normalize(10),
                          marginLeft: normalize(5),
                        }}>
                        {item.date}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: Colors.black,
                        fontFamily: Fonts.Montserrat_Regular,
                        fontSize: normalize(10.5),
                        lineHeight: normalize(14),
                      }}>
                      {item.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            {!mesageList || mesageList?.length == 0 ? (
              <View
                style={{
                  borderWidth: normalize(1),
                  borderColor: '#DDDDDD',
                  borderRadius: normalize(10),
                  marginBottom: normalize(15),
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
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
      <Loader
        visible={GeneralReducer.status === GENERAL.MESSAGE_LIST_REQUEST.type}
      />
    </>
  );
}

const style = StyleSheet.create({});
