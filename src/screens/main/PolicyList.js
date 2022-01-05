import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getCompanyList, buyPolicy} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';

let insuranceId = null;
export default function PolicyList(props) {
  const dispatch = useDispatch();
  const PolicyReducer = useSelector(state => state.PolicyReducer);

  insuranceId = props?.route?.params?.id;

  const [search, setSearch] = useState('');

  const [companyList, setCompanyList] = useState(null);
  const [tempCompanyList, setTempCompanyList] = useState(null);

  const allCompanyReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getCompanyList(insuranceId));
      })
      .catch(err => {
        console.log(err);
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(PolicyReducer.status, [
    POLICY.GET_POLICY_COMPANIES_REQUEST.type,
    () => {
      setCompanyList(PolicyReducer.companyList);
      setTempCompanyList(PolicyReducer.companyList);
    },
    () => {
      setCompanyList(null);
      setTempCompanyList(null);
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);

  const buyPolicyReq = company_id => {
    isInternetConnected()
      .then(() => {
        dispatch(
          buyPolicy({
            insurance_id: insuranceId,
            company_id: company_id,
          }),
        );
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(PolicyReducer.status, [
    POLICY.BUY_POLICY_REQUEST.type,
    () => {
      props.navigation.replace('Policy', {screen: 'PolicyOverview'});
      Alert.alert('',translate('success_policy_buyed'));
    },
    () => {
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);
  useEffect(() => {
    allCompanyReq();
  }, []);

  const searchCompany = text => {
    if (Array.isArray(tempCompanyList)) {
      if (text == '') {
        setCompanyList(tempCompanyList);
      } else {
        let tempData = tempCompanyList.filter(item => {
          return new String(item.company_name)
            .toLowerCase()
            .includes(text.toString().toLowerCase());
        });
        setCompanyList(tempData);
      }
    }
  };
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} logo={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.Montserrat_SemiBold,
                color: Colors.black,
                fontSize: normalize(15),
              }}>
              {translate("Choose Your Company")}
            </Text>
            <TextInputItem
              value={search}
              placeholder={translate("Search")}
              onChangeText={text => {
                setSearch(text);
                searchCompany(text);
              }}
              marginTop={normalize(15)}
              marginBottom={normalize(15)}
              borderRadius={normalize(15)}
              icon={Icons.search}
            />
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
                    onPress={() => buyPolicyReq(item.id)}>
                    <Image
                      style={{
                        height: normalize(40),
                        width: normalize(72),
                        marginBottom: normalize(10),
                      }}
                      source={{uri: item?.logo}}
                      resizeMode="contain"
                    />
                    <Text style={style.itemText}>{item?.company_name}</Text>
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
                  {translate("No Company Found")}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          PolicyReducer.status === POLICY.GET_POLICY_COMPANIES_REQUEST.type ||
          PolicyReducer.status === POLICY.BUY_POLICY_REQUEST.type
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
