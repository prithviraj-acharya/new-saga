import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getHelpList} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';

import MyStatusBar from '../../utils/MyStatusBar';

export default function Help(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  const [data, setData] = useState(null);

  const allHelpReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getHelpList());
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_HELP_REQUEST.type,
    () => {
      if (GeneralReducer?.helpList && Array.isArray(GeneralReducer?.helpList)) {
        setData(
          GeneralReducer?.helpList.map(item => {
            return {
              heading: item.question,
              description: item.answer,
              active: false,
            };
          }),
        );
      }
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
        <Header back={true} title={translate("Help")} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            {data &&
              data.map((item, i) => (
                <View
                  key={i}
                  style={{
                    width: '100%',
                    borderWidth: normalize(1),
                    borderColor: 'rgba(0, 0, 0, 0.21)',
                    borderRadius: normalize(10),
                    marginBottom: normalize(10),
                    display: 'flex',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      const tempData = [...data];
                      tempData[i].active = !tempData[i].active;
                      setData(tempData);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      padding: normalize(15),
                    }}
                    activeOpacity={0.8}>
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_SemiBold,
                        color: Colors.black,
                        fontSize: normalize(12),
                        lineHeight: normalize(13),
                        paddingRight:normalize(10),
                        flex:1
                      }}>
                      {item?.heading}
                    </Text>
                    <Image
                      source={
                        item.active == false ? Icons.down_arrow : Icons.up_arrow
                      }
                      style={{
                        height: normalize(20),
                        width: normalize(20),
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {item.active ? (
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_Regular,
                        color: Colors.black,
                        fontSize: normalize(11),
                        lineHeight: normalize(16),
                        paddingHorizontal: normalize(15),
                        marginBottom: normalize(15),
                      }}>
                      {item?.description}
                    </Text>
                  ) : null}
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={GeneralReducer.status === GENERAL.GET_HELP_REQUEST.type}
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
