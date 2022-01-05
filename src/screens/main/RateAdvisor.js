import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {translate} from '../../utils/helpers/i18n';
import showErrorAlert from '../../utils/helpers/Toast';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {
  rateAdvisor,
  getAdvisorReviews,
} from '../../redux/action/AdvisorsAction';
import Loader from '../../utils/helpers/Loader';
import {ADVISORS} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import TextInputItem from '../../components/TextInputItem';
import MyStatusBar from '../../utils/MyStatusBar';
import Button from '../../components/Button';
import Line from '../../components/Line';
import Space from '../../components/Space';
import moment from 'moment';
import ImageLoader from '../../components/ImageLoader';

export default function RateAdvisor(props) {
  const dispatch = useDispatch();
  const AdvisorsReducer = useSelector(state => state.AdvisorsReducer);

  const [comment, setcomment] = useState('');
  const [rating, setRating] = useState(0);
  const [advDetails, setAdvDetails] = useState(null);

  const [userComment, setUserComment] = useState(null);

  const getRating = rating => {
    let Rating = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        Rating.push(
          <Image
            key={i}
            style={{
              width: normalize(10),
              height: normalize(10),
              marginRight: normalize(2),
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
              width: normalize(10),
              height: normalize(10),
              marginRight: normalize(2),
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
              width: normalize(10),
              height: normalize(10),
              marginRight: normalize(2),
            }}
            source={Icons.star_line}
            resizeMode="contain"
          />
        );
      } catch (Ex) {}
    }
    return Rating;
  };

  const renderComment = (item, index) => {
    return (
      <View
        key={index}
        style={{flexDirection: 'row', marginBottom: normalize(25), flex: 1}}>
        <View style={{justifyContent: 'space-between', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginTop: 6,
            }}>
            <ImageLoader
              source={{uri: item.image}}
              height={normalize(45)}
              width={normalize(45)}
              borderRadius={normalize(50)}
              loaderColor={Colors.red}
              loaderBorderColor={Colors.red}
              loaderSize="small"
            />
            {/* <View
              style={{
                width: normalize(45),
                height: normalize(45),
                borderRadius: normalize(50),
                overflow: 'hidden',
              }}>
              <Image
                source={item.image}
                style={{
                  width: normalize(45),
                  height: normalize(45),
                }}
                resizeMode="cover"
              />
            </View> */}
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Montserrat_Bold,
                  color: Colors.black,
                  fontSize: normalize(14),
                  lineHeight: normalize(14),
                  paddingLeft: normalize(10),
                  marginBottom: normalize(5),
                }}
                numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: normalize(10),
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  {getRating(item.rating)}
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_Regular,
                    color: Colors.black,
                    fontSize: normalize(11),
                    lineHeight: normalize(11),
                    paddingLeft: normalize(10),
                  }}>
                  {item.date}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontFamily: Fonts.Montserrat_Regular,
              color: Colors.black,
              fontSize: normalize(12),
              lineHeight: normalize(15),
              marginTop: normalize(10),
            }}>
            {item.comment}
          </Text>
        </View>
      </View>
    );
  };

  const giveReviewAdvisorReq = () => {
    isInternetConnected()
      .then(() => {
        if (!rating || rating <= 0) {
          showErrorAlert('Please select a rate!');
        } else if (comment.trim() == '') {
          showErrorAlert('Please write your review!');
        } else {
          dispatch(
            rateAdvisor({
              advisor_id: advDetails?.id,
              rating: rating.toString(),
              review: comment.trim(),
            }),
          );
        }
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  const getAllReviewsReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getAdvisorReviews());
      })
      .catch(err => {
        console.log(err);
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(
    AdvisorsReducer.status,
    [
      ADVISORS.RATE_ADVISOR_REQUEST.type,
      () => {
        showErrorAlert('Your review added successfully!');
        setcomment('');
        setRating(0);
        getAllReviewsReq();
      },
      () => {
        showErrorAlert(AdvisorsReducer?.error?.message);
      },
    ],
    [
      ADVISORS.GET_ADVISOR_REVIEWS_REQUEST.type,
      () => {
        if (AdvisorsReducer?.ReviewList?.id) {
          setAdvDetails({
            image:
              AdvisorsReducer?.ReviewList?.profile_photo_path == ''
                ? AdvisorsReducer?.ReviewList?.profile_photo_url
                : AdvisorsReducer?.ReviewList?.profile_photo_path,
            name: AdvisorsReducer?.ReviewList?.full_name,
            id: AdvisorsReducer?.ReviewList?.id,
            isGaveReview: AdvisorsReducer?.ReviewList?.is_review,
          });
        }
        if (
          Array.isArray(AdvisorsReducer?.ReviewList?.advisor_review) == true
        ) {
          const ListData = AdvisorsReducer?.ReviewList?.advisor_review?.map(
            item => ({
              name: item?.user?.full_name,
              comment: item?.review,
              date: moment(item?.created_at).isValid()
                ? moment(item?.created_at).format('DD.MM.YY')
                : '',
              rating: item?.rating,
              image:
                item?.user?.profile_photo_path == ''
                  ? item?.user?.profile_photo_url
                  : item?.user?.profile_photo_path,
            }),
          );
          setUserComment(ListData);
        }
      },
      () => {
        //showErrorAlert(AdvisorsReducer?.error?.message);
      },
    ],
  );

  useFocusEffect(
    React.useCallback(() => {
      getAllReviewsReq();
      return () => {};
    }, []),
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={translate("my insurance advisor")} {...props} />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            {advDetails ? (
              <View
                style={{
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                    }}>
                    <ImageLoader
                      source={{uri: advDetails?.image}}
                      height={normalize(100)}
                      width={normalize(100)}
                      borderRadius={normalize(100)}
                      loaderColor={Colors.red}
                      loaderBorderColor={Colors.red}
                      loaderSize="small"
                      marginLeft="auto"
                      marginRight="auto"
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.Montserrat_Bold,
                        color: Colors.black,
                        marginVertical: normalize(20),
                        fontSize: normalize(17),
                        alignSelf: 'center',
                      }}>
                      {advDetails?.name}
                    </Text>
                  </View>
                  {advDetails?.isGaveReview == false ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: normalize(10),
                        }}>
                        <TouchableOpacity onPress={() => setRating(1)}>
                          <Image
                            source={rating >= 1 ? Icons.star : Icons.star_line}
                            style={{
                              width: normalize(30),
                              height: normalize(30),
                              marginRight: normalize(10),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRating(2)}>
                          <Image
                            source={rating >= 2 ? Icons.star : Icons.star_line}
                            style={{
                              width: normalize(30),
                              height: normalize(30),
                              marginRight: normalize(10),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRating(3)}>
                          <Image
                            source={rating >= 3 ? Icons.star : Icons.star_line}
                            style={{
                              width: normalize(30),
                              height: normalize(30),
                              marginRight: normalize(10),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRating(4)}>
                          <Image
                            source={rating >= 4 ? Icons.star : Icons.star_line}
                            style={{
                              width: normalize(30),
                              height: normalize(30),
                              marginRight: normalize(10),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRating(5)}>
                          <Image
                            source={rating >= 5 ? Icons.star : Icons.star_line}
                            style={{
                              width: normalize(30),
                              height: normalize(30),
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  {advDetails?.isGaveReview == false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <TextInputItem
                        value={comment}
                        placeholder={translate("Type here")}
                        onChangeText={text => setcomment(text)}
                        marginTop={normalize(15)}
                        marginBottom={normalize(15)}
                        borderRadius={normalize(10)}
                        multiline={true}
                        height={normalize(120)}
                        maxLength={150}
                      />
                    </View>
                  ) : (
                    <Button
                      backgroundColor={Colors.white}
                      borderColor={Colors.red}
                      borderWidth={normalize(1)}
                      textColor={Colors.red}
                      marginBottom={normalize(20)}
                      marginTop={normalize(5)}
                      width={normalize(190)}
                      alignSelf="center"
                      title={translate("Change Advisor")}
                      onPress={() =>
                        props.navigation.navigate('MyInsuranceAdvisor')
                      }></Button>
                  )}
                </View>
                {advDetails?.isGaveReview == false ? (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Button
                      backgroundColor={Colors.white}
                      borderColor={Colors.red}
                      borderWidth={normalize(1)}
                      textColor={Colors.red}
                      marginBottom={normalize(20)}
                      marginTop={normalize(25)}
                      width={normalize(140)}
                      alignSelf="center"
                      title={translate("Change Advisor")}
                      onPress={() =>
                        props.navigation.navigate('MyInsuranceAdvisor')
                      }></Button>
                    <Button
                      backgroundColor={Colors.red}
                      marginBottom={normalize(20)}
                      marginTop={normalize(25)}
                      width={normalize(120)}
                      alignSelf="center"
                      title={translate("Rate Now")}
                      onPress={giveReviewAdvisorReq}></Button>
                  </View>
                ) : null}

                {userComment && userComment?.length > 0 ? (
                  <Line color="#EAEAEA" />
                ) : null}
                <Space size={normalize(20)} />
                <FlatList
                  pagingEnabled={true}
                  legacyImplementation={false}
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  data={userComment}
                  renderItem={({item, index}) => renderComment(item, index)}
                />
                {!userComment || userComment?.length == 0 ? (
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
                      {translate("No Review Found")}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
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
                    lineHeight: normalize(15),
                    paddingVertical: normalize(15),
                    textAlign: 'center',
                  }}>
                   {translate("No Advisor Found")}{"\n"}{translate("Please Contact to Admin")}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          AdvisorsReducer.status === ADVISORS.RATE_ADVISOR_REQUEST.type ||
          AdvisorsReducer.status === ADVISORS.GET_ADVISOR_REVIEWS_REQUEST.type
        }
      />
    </KeyboardAvoidingView>
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
