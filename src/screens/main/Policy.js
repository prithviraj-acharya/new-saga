import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getAllPolicy} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

export default function Policy(props) {
  const dispatch = useDispatch();
  const PolicyReducer = useSelector(state => state.PolicyReducer);
  const [companyList, setCompanyList] = useState(null);

  const allPolicyReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getAllPolicy());
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(PolicyReducer.status, [
    POLICY.GET_POLICY_REQUEST.type,
    () => {
      setCompanyList(PolicyReducer.policyList);
    },
    () => {
      setCompanyList(null);
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      allPolicyReq();
      return () => {
        unsuscribe();
      };
    });
  }, []);
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={false} logo={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.Montserrat_SemiBold,
                color: Colors.black,
                fontSize: normalize(15),
              }}>
              {translate("What insurance do you have?")}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: normalize(8),
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              {companyList &&
                companyList?.map((item, i) => (
                  <TouchableOpacity
                    style={[
                      style.item,
                      (i + 1) % 3 != 0 ? {marginRight: normalize(8)} : null,
                    ]}
                    key={i}
                    onPress={() => {                      
                      props.navigation.navigate('PolicyList',{id:item.id});
                    }}>
                    <Image
                      style={{
                        height: normalize(40),
                        width: normalize(40),
                        marginBottom: normalize(10),
                      }}
                      source={{uri: item.icon}}
                      resizeMode="contain"
                    />
                    <Text style={style.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}                
            </View>
            {!companyList || companyList?.length == 0 ? (
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
                    {translate("No Policy Found")}
                  </Text>
                </View>
              ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          PolicyReducer.status === POLICY.GET_POLICY_REQUEST.type
        }
      />
    </>
  );
}

const style = StyleSheet.create({
  item: {
    width: '31%',
    height: normalize(100),
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.21)',
    borderRadius: normalize(15),
    marginBottom: normalize(10),
    paddingTop: normalize(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '',
    backgroundColor: '#FDFCFC',
    paddingHorizontal: normalize(3),
  },
  itemText: {
    fontFamily: Fonts.Montserrat_SemiBold,
    textAlign: 'center',
    color: Colors.black,
    fontSize: normalize(11),
  },
});
