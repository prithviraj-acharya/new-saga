import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import {translate} from '../../utils/helpers/i18n';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import moment from 'moment';

let allDocuments = null;
let date = null;
export default function Documents(props) {
  allDocuments = props.route?.params?.documents;
  date = props.route?.params?.date;

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header close={true} title="Documents" {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                paddingTop: normalize(8),
              }}>
              {allDocuments &&
                allDocuments.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[style.itemBox, {flexDirection: 'row'}]}
                    onPress={async () => {
                      const supported = await Linking.canOpenURL(
                        item?.doc_name,
                      );
                      if (supported) {
                        props.navigation.navigate('PDFViewer', {
                          uri: item?.doc_name,
                        });
                      }
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={style.itemText}>{item?.name}</Text>
                      <Text style={style.itemTextDesc}>
                        Added:{' '}
                        {moment(date).isValid()
                          ? moment(date).format('DD.MM.YYYY')
                          : ''}
                      </Text>
                    </View>
                    <Image
                      style={{
                        height: normalize(25),
                        width: normalize(25),
                      }}
                      source={Icons.view}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              {!allDocuments || allDocuments?.length == 0 ? (
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
                    {translate("No Document Found")}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  itemBox: {
    width: '100%',
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.21)',
    borderRadius: normalize(10),
    marginBottom: normalize(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(15),
  },
  itemText: {
    fontFamily: Fonts.Montserrat_Bold,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(16),
    lineHeight: normalize(16),
    marginBottom: normalize(4),
  },
  itemTextDesc: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(12),
    lineHeight: normalize(12),
  },
});
