import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getMemberComapnyList} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import moment from 'moment';

export default function AddFamilyList(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  const[allFamilyMember,setAllFamilyMember]=useState();

  const getAllMemberComapnyList = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getMemberComapnyList("member"));
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type,
    () => {
      setAllFamilyMember(
        GeneralReducer?.memberCompanyList?.map((item, i) => {
          return {
            name: `${item?.first_name} ${item?.last_name}`,
            phone: item?.phone,
            id: item?.id,
          };
        }),
      );
    },
    () => {
      setAllFamilyMember(null);
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      getAllMemberComapnyList();
      return () => {};
    }, [])
  );

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          back={true}
          title={translate("Family Members")}
          add={true}
          addPress={() => props.navigation.navigate('AddFamilyMember')}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                paddingTop: normalize(8),
              }}>
              {allFamilyMember &&
                allFamilyMember.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[style.itemBox, {flexDirection: 'row'}]}
                    onPress={() => {
                      props.navigation.navigate('AddFamilyMember', {id: item?.id,edit:true});
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={style.itemText} numberOfLines={1}>
                        {item?.name}
                      </Text>
                      <Text style={style.itemTextDesc}> {item?.phone}</Text>
                    </View>
                    <Image
                      style={{
                        height: normalize(25),
                        width: normalize(25),
                        marginLeft: normalize(15),
                      }}
                      source={Icons.edit}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              {!allFamilyMember || allFamilyMember?.length == 0 ? (
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
                    {translate("No Member Found")}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
        <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type
        }
      />
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
    fontSize: normalize(15),
    lineHeight: normalize(15),
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
