import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {translate, setAppLanguage} from '../../utils/helpers/i18n';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import Slider from '../../components/Slider';
import MyStatusBar from '../../utils/MyStatusBar';
import constants from '../../utils/helpers/constants';

import {setUserForm} from '../../redux/action/GeneralAction';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('screen');

export default function Welcome(props) {
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [language, setLanguage] = useState(1);
  const [languageText, setLanguageText] = useState('Français');
  const languageData = [
    {
      name: 'Français',
      value: 1,
    },
    {
      name: 'English',
      value: 2,
    },
  ];
  const sliderData = [
    {
      image: language == 1 ? Images.slide_fr_1 : Images.slide1,
      text: language == 1 ?'Facile':'Easy',
    },
    {
      image: language == 1 ? Images.slide_fr_2 : Images.slide2,
      text: language == 1 ?'Transparent':'Transparent',
    },
    {
      image: language == 1 ? Images.slide_fr_3 : Images.slide3,
      text: language == 1 ?'Personnel':'Personal',
    },
  ];
  const setLanguageSQ = async v => {
    setAppLanguage(v == 1 ? 'fr' : 'en');
    await EncryptedStorage.setItem(
      constants.LANGUAGE,
      JSON.stringify({
        value: v,
      }),
    );
  };
  useEffect(() => {
    EncryptedStorage.getItem(constants.LANGUAGE)
      .then(res => {
        if (res != null) {
          const rs = JSON.parse(res);
          let lValue = rs.value ? rs.value : 1;
          setLanguage(lValue);
          if (lValue == 2) {
            setLanguageText('English');
          } else {
            setLanguageText('Français');
          }
        } else {
          setLanguage(1);
          setLanguageText('Français');
        }
      })
      .catch(ex => {
        setLanguage(1);
        setLanguageText('Français');
      });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setUserForm(null));
      return () => {};
    }, []),
  );
  return (
    <>
      <MyStatusBar backgroundColor={Colors.red} barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <ScrollView bounces={false} contentContainerStyle={{flex: 1}}>
          <View
            style={{
              backgroundColor: Colors.red,
            }}>
            <TouchableOpacity
              style={{
                height: normalize(20),
                width: normalize(130),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                paddingLeft: normalize(10),
                marginBottom: normalize(10),
              }}
              activeOpacity={0.6}
              onPress={() => setShowPicker(true)}>
              <Text
                style={[
                  {
                    color: Colors.white,
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(12),
                  },
                ]}>
                {languageText}
              </Text>
              <Image
                source={Icons.down_arrow}
                style={{
                  height: normalize(12),
                  width: normalize(12),
                  tintColor: Colors.white,
                  marginLeft: normalize(10),
                }}
                resizeMode="contain"></Image>
            </TouchableOpacity>
            <Slider
              data={sliderData}
              scroll={90}
              pagination={true}
              paginationShow={true}
              paginationStyle={style.paginationStyle}
              renderItem={data => {
                return (
                  <View
                    style={{
                      width: width,
                      height: normalize(375),
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_ExtraBold,
                        fontSize: normalize(25),
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        marginTop: normalize(5),
                        marginBottom: -normalize(10),
                        color: Colors.white,
                      }}>
                      {data.text}
                    </Text>
                    <Image
                      source={data.image}
                      style={{width: normalize(310), height: normalize(350)}}
                      resizeMode="stretch"
                    />
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              flex: 1,
              justifyContent: 'center',
              paddingTop: normalize(10),
            }}>
            <View
              style={{
                width: normalize(240),
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: Colors.white,
                justifyContent: 'center',
              }}>
              <Button
                backgroundColor={Colors.red}
                marginBottom={normalize(0)}
                marginTop={normalize(15)}
                onPress={() => props.navigation.navigate('Register1')}
                title={translate('Register')}></Button>
              <Button
                backgroundColor={Colors.lightBlack}
                marginBottom={normalize(30)}
                marginTop={normalize(15)}
                onPress={() => props.navigation.navigate('Login')}
                title={translate('Login')}></Button>
            </View>
          </View>
        </ScrollView>
        <Picker
          backgroundColor={Colors.white}
          dataList={languageData}
          modalVisible={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          renderData={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setLanguageSQ(item.value);
                  setLanguage(item.value);
                  setLanguageText(item.name);
                  setShowPicker(false);
                }}
                style={style.dropDownItem}>
                <Text
                  style={[
                    style.dropDownItemText,
                    language == item.value ? {color: Colors.red} : null,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  item: {
    width: normalize(73),
    height: normalize(83),
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.21)',
    borderRadius: normalize(15),
    marginBottom: normalize(10),
    paddingTop: normalize(3),
  },
  itemText: {
    fontFamily: Fonts.Montserrat_SemiBold,
    textAlign: 'center',
    color: Colors.black,
    fontSize: normalize(11),
  },
  paginationStyle: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
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
