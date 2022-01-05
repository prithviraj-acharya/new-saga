import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, ScrollView} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getSecurityList} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';

import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

export default function Security(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  const [data, setData] = useState(null);

  const allHelpReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getSecurityList());
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_SECURITY_LIST_REQUEST.type,
    () => {
      setData(GeneralReducer?.securityList);
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    allHelpReq();
  }, []);

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title="Security" {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                width: '100%',
                borderRadius: normalize(15),
                overflow: 'hidden',
                padding: 6,
              }}>
              {data &&
                data.map((item, i) => (
                  <View
                    style={{
                      justifyContent: 'space-between',
                    }} key={i}>
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_SemiBold,
                        color: Colors.black,
                        fontSize: normalize(16),
                        lineHeight: normalize(16),
                        marginBottom: normalize(15),
                      }}>
                      {item?.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_Regular,
                        color: Colors.black,
                        fontSize: normalize(11),
                        lineHeight: normalize(16),
                        marginBottom: normalize(15),
                      }}>
                      {item?.content}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_SECURITY_LIST_REQUEST.type
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
