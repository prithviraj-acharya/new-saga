import React, {useEffect, useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  getBuyedPolicyList,
  getMySelectedAdvisor,
  setOrderPolicy
} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ImageLoader from '../../components/ImageLoader';
import MyStatusBar from '../../utils/MyStatusBar';

import DraggableFlatList from 'react-native-draggable-flatlist';

let isNotificationAvaliable = false;
export default function PolicyOverview(props) {
  const dispatch = useDispatch();
  const PolicyReducer = useSelector(state => state.PolicyReducer);
  const GeneralReducer = useSelector(state => state.GeneralReducer);

  isNotificationAvaliable =
    GeneralReducer?.notifications?.data?.notify_type == 'PD';

  const [policyList, setPolicyList] = useState(null);
  const [advisorDetails, setAdvisorDetails] = useState(null);

  const getStatus = status => {
    if (status == 1) {
      return 'Waiting from insurance';
    } else if (status == 2) {
      return 'Digitalized';
    } else if (status == 3) {
      return 'Cancelled';
    } else if (status == 4) {
      return 'Expire';
    } else if (status == 5) {
      return 'Waiting new policy';
    } else if (status == 6) {
      return 'Not found';
    } else if (status == 7) {
      return 'Waiting offer validation';
    } else {
      return 'No status found';
    }
  };

  const allPolicy = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getBuyedPolicyList());
      })
      .catch(err => {
        console.log(err);
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(
    PolicyReducer.status,
    [
      POLICY.GET_BUYED_POLICY_REQUEST.type,
      () => {
        setPolicyList(
          PolicyReducer?.buyedPolicyList?.map((item, i) => {
            return {
              name: item?.insurance?.name,
              value: item?.insurance?.id,
              icon: item?.insurance?.icon,
              des:
                item?.status_name == ''
                  ? translate('No status found')
                  : item?.status_name,
              status: item?.status,
              id: item?.id,
              title: item?.title,
              companyName: item?.company?.company_name,
              original_price: item?.original_price,
            };
          }),
        );
      },
      () => {
        setPolicyList(null);
        showErrorAlert(PolicyReducer?.error?.message);
      },
    ],
    [
      POLICY.GET_MY_SELECTED_ADVISOR_REQUEST.type,
      () => {
        const advisor = PolicyReducer?.mySelectedAdvisor;
        setAdvisorDetails({
          id: advisor?.id,
          fullName: advisor?.full_name,
          role: advisor?.role_name,
          rating: advisor?.advisor_review_avg_rating,
          email: advisor?.email,
          phone: advisor?.phone,
          image:
            advisor?.profile_photo_path == ''
              ? advisor?.profile_photo_url
              : advisor?.profile_photo_path,
        });
      },
      () => {
        setAdvisorDetails(null);
        showErrorAlert(PolicyReducer?.error?.message);
      },
    ],
    [
      POLICY.SET_SELECTED_POLICY_REQUEST.type,
      () => {
        
      },
      () => {
        showErrorAlert(PolicyReducer?.error?.message);
      },
    ],
  );

  useFocusEffect(
    React.useCallback(() => {
      allPolicy();
      if (isNotificationAvaliable) {
        props.navigation.navigate('PolicyDetails', {
          policyId: GeneralReducer?.notifications?.data?._,
          direct: true,
        });
      }
      dispatch(getMySelectedAdvisor());
      return () => {};
    }, []),
  );

  const renderItem = useCallback(({item, index, drag, isActive}) => {
    return (
      <TouchableOpacity
        style={[style.item, isActive ? {backgroundColor: '#f5f5f5'} : null]}
        onPress={() => {
          if (item.status == 2) {
            props.navigation.navigate('PolicyDetails', {
              policyId: item.id,
              direct: false,
            });
          } else {
            showErrorAlert(item.des);
          }
        }}
        onLongPress={drag}>
        <ImageLoader
          source={{uri: item?.icon}}
          height={normalize(30)}
          width={normalize(30)}
          loaderColor={Colors.red}
          loaderBorderColor={Colors.red}
          loaderSize="small"
          resizeMode="contain"
        />
        <View style={{flex: 1, paddingHorizontal: normalize(10)}}>
          <Text style={style.itemText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={style.itemTextDesc} numberOfLines={1}>
            {item?.status == 2
              ? `${item?.companyName} - ${item?.title ?? ''} ${
                  item?.original_price ? '- CHF ' + item?.original_price : ''
                }`
              : item.des}
          </Text>
        </View>
        {item.status == 2 ? (
          <Image
            style={{
              height: normalize(20),
              width: normalize(15),
            }}
            source={Icons.right_arrow}
            resizeMode="contain"
          />
        ) : null}
      </TouchableOpacity>
    );
  }, []);

  const getRating = rating => {
    let Rating = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        Rating.push(
          <Image
            key={i}
            style={{
              width: normalize(12),
              height: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star}
            resizeMode="contain"
          />,
        );
      } else {
        Rating.push(
          <Image
            key={i}
            style={{
              width: normalize(12),
              height: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star_line}
            resizeMode="contain"
          />,
        );
      }
    }
    if (rating != parseInt(rating)) {
      try {
        Rating[parseInt(rating)] = (
          <Image
            key={parseInt(rating) + 1}
            style={{
              width: normalize(12),
              height: normalize(12),
              marginRight: normalize(5),
            }}
            source={Icons.star_line}
            resizeMode="contain"
          />
        );
      } catch (Ex) {}
    }
    return Rating;
  };

  const setOrderList=(dataList)=>{
    const orderId=dataList?.map(item=>item.id);    
    dispatch(setOrderPolicy({policy_ids:orderId}))
  }
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          back={false}
          logo={true}
          add={true}
          addPress={() => props.navigation.navigate('Policy')}
          {...props}
        />
        <View style={{padding: normalize(10), flex: 1,paddingBottom:normalize(5),paddingTop:normalize(10)}}>
          {isNotificationAvaliable == true ? null : (
            <>
              {policyList && policyList?.length > 0 ? (
                <DraggableFlatList
                  showsVerticalScrollIndicator={false}
                  data={policyList}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `draggable-item-${index}`}
                  onDragEnd={({data}) =>{
                    setPolicyList(data);
                    setOrderList(data)
                  }}
                />
              ) : null}

              {!policyList || policyList?.length == 0 ? (
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
                    {translate('No Policy Found')}
                  </Text>
                </View>
              ) : null}

              
            </>
          )}
        </View>
        {advisorDetails ? (
                <View
                  style={{
                    width: '100%',
                    borderTopWidth: normalize(1),
                    borderTopColor: 'rgba(0, 0, 0, 0.21)',
                    padding: normalize(5),
                    paddingHorizontal:normalize(10),
                    marginTop:normalize(5)
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    <ImageLoader
                      source={{uri: advisorDetails?.image}}
                      height={normalize(75)}
                      width={normalize(75)}
                      borderRadius={normalize(100)}
                      loaderColor={Colors.red}
                      loaderBorderColor={Colors.red}
                      loaderSize="small"
                      marginRight={normalize(10)}
                    />
                    <View>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_SemiBold,
                          color: Colors.black,
                          fontSize: normalize(12.5),
                        }}
                        numberOfLines={1}>
                        {advisorDetails?.fullName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_Regular,
                          color: Colors.black,
                          fontSize: normalize(12.5),
                        }}
                        numberOfLines={1}>
                        {translate('ADVISOR')}
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: normalize(2),
                        }}>
                        {getRating(advisorDetails?.rating)}
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: normalize(5),
                        }}>
                        <TouchableOpacity
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: normalize(15),
                          }}
                          onPress={() => {
                            const eml = `mailto:${
                              advisorDetails?.email ? advisorDetails?.email : ''
                            }`;
                            Linking.canOpenURL(eml)
                              .then(supported => {
                                if (!supported) {
                                  showErrorAlert('Email is not available');
                                } else {
                                  return Linking.openURL(eml);
                                }
                              })
                              .catch(err => console.log(err));
                          }}>
                          <Image
                            style={{
                              height: normalize(20),
                              width: normalize(20),
                              marginRight: normalize(5),
                            }}
                            source={Icons.mail}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              fontFamily: Fonts.Montserrat_Regular,
                              color: Colors.black,
                              fontSize: normalize(12.5),
                            }}>
                            Mail
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            let phoneNumber = '';
                            if (Platform.OS !== 'android') {
                              phoneNumber = `telprompt:${advisorDetails?.phone}`;
                            } else {
                              phoneNumber = `tel:${advisorDetails?.phone}`;
                            }
                            Linking.canOpenURL(phoneNumber)
                              .then(supported => {
                                if (!supported) {
                                  showErrorAlert(
                                    'Phone number is not available',
                                  );
                                } else {
                                  return Linking.openURL(phoneNumber);
                                }
                              })
                              .catch(err => console.log(err));
                          }}>
                          <Image
                            style={{
                              height: normalize(18),
                              width: normalize(18),
                              marginRight: normalize(5),
                            }}
                            source={Icons.call}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              fontFamily: Fonts.Montserrat_Regular,
                              color: Colors.black,
                              fontSize: normalize(12.5),
                            }}>
                            {translate('Call')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      marginBottom: normalize(5),
                      paddingLeft: normalize(85),
                    }}>
                    <Button
                      title={translate('Rate Advisor')}
                      borderColor={Colors.red}
                      textColor={Colors.red}
                      borderWidth={normalize(1)}
                      width={normalize(140)}
                      height={normalize(25)}
                      backgroundColor={Colors.white}
                      onPress={() => {
                        props.navigation.navigate('RateAdvisor', {
                          id: advisorDetails?.id,
                          image: advisorDetails?.image,
                          name: advisorDetails?.fullName,
                        });
                      }}
                    />
                  </View>
                </View>
              ) : null}
      </SafeAreaView>
      <Loader
        visible={PolicyReducer.status === POLICY.GET_BUYED_POLICY_REQUEST.type}
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
  },
  itemText: {
    fontFamily: Fonts.Montserrat_SemiBold,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(13),
    lineHeight: normalize(13),
    marginBottom: normalize(6),
    letterSpacing: normalize(0.3),
  },
  itemTextDesc: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(11),
    lineHeight: normalize(11),
  },
});
