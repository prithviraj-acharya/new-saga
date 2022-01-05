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
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getPolicyDetails} from '../../redux/action/PolicyAction';
import Loader from '../../utils/helpers/Loader';
import {POLICY, GENERAL} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Button from '../../components/Button';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import moment from 'moment';
import ImageLoader from '../../components/ImageLoader';

let policyId = null;
let direct = false;
export default function PolicyDetails(props) {
  policyId = props.route?.params?.policyId;
  direct = direct == false ? props.route?.params?.direct : false;
  const dispatch = useDispatch();
  const PolicyReducer = useSelector(state => state.PolicyReducer);

  const [policyDetails, setPolicyDetails] = useState(null);
  const [advisorDetails, setAdvisorDetails] = useState(null);
  const [hasError, setHasError] = useState(false);

  const policyDetailsReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getPolicyDetails(policyId));
      })
      .catch(err => {
        console.log(err);
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };
  this.status(PolicyReducer.status, [
    POLICY.GET_POLICY_DETAILS_REQUEST.type,
    () => {
      setHasError(false);
      setPolicyDetails(PolicyReducer?.policyDetails?.policy);
      if (PolicyReducer?.policyDetails?.advisor) {
        const advisor = PolicyReducer?.policyDetails?.advisor;
        setAdvisorDetails({
          id: advisor?.advisor_id,
          fullName: advisor?.advisor?.full_name,
          role: advisor?.advisor?.role_name,
          rating: advisor?.advisor_review_avg_rating,
          email: advisor?.advisor?.email,
          phone: advisor?.advisor?.phone,
          image:
            advisor?.advisor?.profile_photo_path == ''
              ? advisor?.advisor?.profile_photo_url
              : advisor?.advisor?.profile_photo_path,
        });
      }
    },
    () => {
      setHasError(true);
      showErrorAlert(PolicyReducer?.error?.message);
    },
  ]);
  if (direct == true) {
    dispatch({
      type: GENERAL.SET_NOTIFICATION_SUCCESS.type,
      data: {
        [GENERAL.SET_NOTIFICATION_SUCCESS.value]: null,
      },
    });
  }
  useFocusEffect(
    React.useCallback(() => {
      policyDetailsReq();
      return () => {};
    }, []),
  );

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

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} logo={true} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            <View
              style={{
                //paddingTop: normalize(8),
              }}>
              {hasError == true ? (
                <>
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
                     {translate("serverError")}
                    </Text>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: Colors.red,
                        paddingVertical: normalize(10),
                        paddingHorizontal: normalize(10),
                        borderRadius: normalize(8),
                        width: normalize(135),
                      }}
                      onPress={policyDetailsReq}>
                      <Image
                        source={Icons.reset}
                        style={{
                          tintColor: Colors.white,
                          height: normalize(20),
                          width: normalize(20),
                          marginBottom: normalize(10),
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: Colors.white,
                          fontFamily: Fonts.Montserrat_SemiBold,
                          fontSize: normalize(12),
                          lineHeight: normalize(12),
                          textAlign: 'center',
                        }}>
                       {translate("Reload Now")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={style.itemBox}>
                    <Image
                      style={{
                        height: normalize(50),
                        width: normalize(50),
                        marginBottom: normalize(15),
                      }}
                      source={{uri: policyDetails?.insurance?.icon}}
                      resizeMode="contain"
                    />
                    <View
                      style={{
                        paddingHorizontal: normalize(10),
                        marginBottom: normalize(5),
                      }}>
                      <Text style={style.itemText}>
                        {policyDetails?.insurance?.name}{policyDetails?.title && policyDetails?.title!=""?" - "+policyDetails?.title:""}
                      </Text>
                      <Text style={style.itemTextDesc}>
                        {translate("Policy Number")} {policyDetails?.policy_number}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: normalize(10),
                        marginBottom: normalize(5),
                      }}>
                      <Button
                        title={translate("Polic")}
                        borderColor="#A5A5A5"
                        textColor="#A5A5A5"
                        borderWidth={normalize(1)}
                        width={normalize(100)}
                        marginHorizontal={normalize(5)}
                        backgroundColor={Colors.white}
                        onPress={async () => {
                          if (!policyDetails.policy_doc) {
                            showErrorAlert(translate('No document uploaded'));
                          } else {
                            const supported = await Linking.canOpenURL(
                              policyDetails?.policy_doc,
                            );
                            if (supported) {
                              props.navigation.navigate('PDFViewer', {
                                uri: policyDetails?.policy_doc,
                              });
                              //await Linking.openURL(policyDetails?.policy_doc);
                            }
                          }
                        }}
                      />
                      <Button
                        title={translate("Message Us")}
                        borderColor={Colors.red}
                        textColor={Colors.red}
                        borderWidth={normalize(1)}
                        width={normalize(130)}
                        marginHorizontal={normalize(5)}
                        backgroundColor={Colors.white}
                        onPress={() =>
                          props.navigation.navigate('NewMessage', {
                            insurance_id: policyDetails?.id,
                          })
                        }
                      />
                    </View>
                  </View>

                  <View style={[style.itemBox]}>
                    <View
                      style={{
                        paddingHorizontal: normalize(10),
                        marginTop: normalize(10),
                      }}>
                      <Text
                        style={[
                          style.itemTextDesc,
                          {
                            fontSize: normalize(16),
                            lineHeight: normalize(16),
                            marginBottom: normalize(10),
                          },
                        ]}>
                        {translate("Annual Premium")}
                      </Text>
                      <Text
                        style={[
                          style.itemText,
                          {fontSize: normalize(24), lineHeight: normalize(24)},
                        ]}>
                        CHF {policyDetails?.original_price}
                      </Text>
                    </View>
                  </View>

                  <View style={[style.itemBox]}>
                    <View
                      style={{
                        paddingHorizontal: normalize(10),
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: normalize(10),
                        width: '100%',
                      }}>
                      <Image
                        style={{
                          height: normalize(40),
                          width: normalize(72),
                          marginBottom: normalize(15),
                        }}
                        source={{uri: policyDetails?.company?.logo}}
                        resizeMode="contain"
                      />
                      <Text
                        style={[
                          style.itemTextDesc,
                          {
                            fontSize: normalize(14),
                            lineHeight: normalize(14),
                            marginBottom: normalize(10),
                          },
                        ]}>
                        {policyDetails?.company?.company_name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.red,
                          paddingVertical: normalize(10),
                          paddingHorizontal: normalize(16),
                          borderRadius: normalize(8),
                        }}
                        onPress={() => {
                          let phoneNumber = '';
                          if (Platform.OS !== 'android') {
                            phoneNumber = `telprompt:${policyDetails?.company?.phone_number}`;
                          } else {
                            phoneNumber = `tel:${policyDetails?.company?.phone_number}`;
                          }
                          Linking.canOpenURL(phoneNumber)
                            .then(supported => {
                              if (!supported) {
                                showErrorAlert('Phone number is not available');
                              } else {
                                return Linking.openURL(phoneNumber);
                              }
                            })
                            .catch(err => console.log(err));
                        }}>
                        <Image
                          source={Icons.call}
                          style={{
                            height: normalize(18),
                            width: normalize(18),
                            tintColor: Colors.white,
                            marginRight: normalize(10),
                          }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color: Colors.white,
                            fontFamily: Fonts.Montserrat_SemiBold,
                            fontSize: normalize(12.5),
                          }}>
                          {translate("Call Now")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[style.itemBox, {flexDirection: 'row'}]}
                    onPress={() =>
                      props.navigation.navigate('Documents', {
                        documents: policyDetails?.policy_document,
                        date: policyDetails?.updated_at,
                      })
                    }>
                    <Image
                      style={{
                        height: normalize(50),
                        width: normalize(50),
                        marginLeft:normalize(5)
                      }}
                      source={Icons.write}
                      resizeMode="contain"
                    />
                    <View style={{flex: 1, paddingHorizontal: normalize(10)}}>
                      <Text style={[style.itemText, {textAlign: 'left'}]}>
                        Documents
                      </Text>
                      <Text style={[style.itemTextDesc, {textAlign: 'left'}]}>
                        {translate("Last update")}{' '}
                        {moment().diff(
                          moment(policyDetails?.updated_at),
                          'days',
                        )}{' '}
                        {translate("days ago")}
                      </Text>
                    </View>
                    <Image
                      style={{
                        height: normalize(30),
                        width: normalize(30)
                      }}
                      source={Icons.right_arrow}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <View style={[style.itemBox2]}>
                    <Text
                      style={[
                        style.itemText,
                        {
                          textAlign: 'left',
                          fontSize: normalize(12),
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {translate("duration of the insurance")}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalize(10),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_Regular,
                          textAlign: 'center',
                          color: '#3E7CB6',
                          fontSize: normalize(12.5),
                        }}>
                        {translate("Start Date")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_SemiBold,
                          textAlign: 'center',
                          color: Colors.black,
                          fontSize: normalize(12.5),
                        }}>
                        {policyDetails?.start_date}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalize(10),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_Regular,
                          textAlign: 'center',
                          color: '#3E7CB6',
                          fontSize: normalize(12.5),
                        }}>
                        {translate("End Date")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.Montserrat_SemiBold,
                          textAlign: 'center',
                          color: Colors.black,
                          fontSize: normalize(12.5),
                        }}>
                        {policyDetails?.end_date}
                      </Text>
                    </View>
                  </View>
                  {advisorDetails ? (
                    <View style={[style.itemBox2]}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: normalize(10),
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
                            {translate("ADVISOR")}
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
                              marginTop: normalize(10),
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
                                  advisorDetails?.email
                                    ? advisorDetails?.email
                                    : ''
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
                                {translate("Call")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          marginTop: normalize(10),
                          marginBottom: normalize(5),
                          paddingLeft:normalize(85)
                        }}>
                        {/* <Button
                          title="Change Advisor"
                          borderColor="#A5A5A5"
                          textColor="#A5A5A5"
                          borderWidth={normalize(1)}
                          width={normalize(135)}
                          marginHorizontal={normalize(5)}
                          backgroundColor={Colors.white}
                          onPress={() =>
                            props.navigation.navigate('MyInsuranceAdvisor')
                          }
                        /> */}
                        <Button
                          title={translate("Rate Advisor")}
                          borderColor={Colors.red}
                          textColor={Colors.red}
                          borderWidth={normalize(1)}
                          width={normalize(140)}
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
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          PolicyReducer.status === POLICY.GET_POLICY_DETAILS_REQUEST.type ||
          PolicyReducer.status === POLICY.BUY_POLICY_REQUEST.type
        }
      />
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
    paddingHorizontal:normalize(5)
  },
  itemText: {
    fontFamily: Fonts.Montserrat_Bold,
    textAlign: 'center',
    color: Colors.black,
    fontSize: normalize(15),
    lineHeight: normalize(15),
    marginBottom: normalize(4),
  },
  itemTextDesc: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'center',
    color: Colors.black,
    fontSize: normalize(11),
    lineHeight: normalize(11),
  },
  itemBox2: {
    width: '100%',
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.21)',
    borderRadius: normalize(10),
    marginBottom: normalize(10),
    padding: normalize(15),
  },
});
