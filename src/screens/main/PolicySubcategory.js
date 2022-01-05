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
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getSubCategory} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

let companyId = null;
let insuranceId = null;
let insuranceCategoryId = null;
let insuranceName = null;
let insuranceCategoryName = null;
export default function PolicySubcategory(props) {
  const dispatch = useDispatch();
  const PolicyReducer = useSelector(state => state.PolicyReducer);

  insuranceId = PolicyReducer?.selectedPolicyList?.insuranceId;
  insuranceCategoryId = PolicyReducer?.selectedPolicyList?.insuranceCategoryId;
  companyId = PolicyReducer?.selectedPolicyList?.companyId;
  insuranceName = PolicyReducer?.selectedPolicyList?.insuranceName;
  insuranceCategoryName = PolicyReducer?.selectedPolicyList?.insuranceCategoryName;

  const [policyList, setPolicyList] = useState(null);

  const allPolicyCategory = () => {
    isInternetConnected()
      .then(() => {
        dispatch(
          getSubCategory({
            insuranceId: insuranceCategoryId || insuranceId,
            companyId,
          }),
        );
      })
      .catch(err => {
        console.log(err);
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(PolicyReducer.status, [
    POLICY.GET_POLICY_SUB_CATEGORY_REQUEST.type,
    () => {
      setPolicyList(PolicyReducer.policySubCategory.policies);
    },
    () => {
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    allPolicyCategory();
  }, []);

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={insuranceCategoryName==""?insuranceName:insuranceCategoryName} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                paddingTop: normalize(8),
              }}>
              {policyList &&
                policyList.map((item, i) => (
                  <TouchableOpacity
                    style={style.item}
                    key={i}
                    onPress={() =>
                      props.navigation.navigate('PolicyDetails', {
                        name: 'House Hold',
                        icon: Icons.HouseholdContents,
                        policyId: item.id,
                      })
                    }>
                    <View
                      style={{
                        height: normalize(70),
                        width: normalize(70),
                        borderColor: Colors.red,
                        borderWidth: normalize(1),
                        borderRadius: normalize(50),
                        justifyContent: 'center',
                        marginRight: normalize(5),
                      }}>
                      <Text
                        style={[
                          style.duration,
                          item.duration_month != null
                            ? {lineHeight: normalize(18)}
                            : null,
                        ]}>
                        {item.duration_year != null
                          ? item.duration_year + ' yrs'
                          : ''}
                        {item.duration_year != null &&
                        item.duration_month != null
                          ? '\n'
                          : ''}
                        {item.duration_month != null
                          ? item.duration_month + ' mths'
                          : ''}
                      </Text>
                    </View>
                    <View style={{flex: 1, paddingHorizontal: normalize(10)}}>
                      <Text style={style.itemTextDesc}>Total premium</Text>
                      <Text style={style.itemText}>CHF {item.price}</Text>
                    </View>
                    <Image
                      style={{
                        height: normalize(30),
                        width: normalize(20),
                      }}
                      source={Icons.right_arrow}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          PolicyReducer.status === POLICY.GET_POLICY_SUB_CATEGORY_REQUEST.type
        }
      />
    </>
  );
}

const style = StyleSheet.create({
  item: {
    width: '100%',
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.21)',
    borderRadius: normalize(10),
    marginBottom: normalize(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(15),
    paddingVertical: normalize(10),
  },
  itemText: {
    fontFamily: Fonts.Montserrat_Bold,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(14),
    lineHeight: normalize(14),
  },
  itemTextDesc: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(12),
    lineHeight: normalize(12),
    marginBottom: normalize(8),
  },
  duration: {
    fontFamily: Fonts.Montserrat_SemiBold,
    textAlign: 'center',
    color: Colors.red,
    fontSize: normalize(13),
    lineHeight: normalize(13),
  },
});
