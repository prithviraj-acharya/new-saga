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
import {getAdvisorsList, setAdvisor} from '../../redux/action/AdvisorsAction';
import Loader from '../../utils/helpers/Loader';
import {ADVISORS} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Images, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
import ImageLoader from '../../components/ImageLoader';

export default function MyInsuranceAdvisor(props) {
  const dispatch = useDispatch();
  const AdvisorsReducer = useSelector(state => state.AdvisorsReducer);

  const [advisortList, setAdvisorList] = useState(null);

  const getAdvisorsListReq = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getAdvisorsList());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  const setAdvisorReq = id => {
    isInternetConnected()
      .then(() => {
        dispatch(setAdvisor(id));
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(AdvisorsReducer.status, [
    ADVISORS.GET_ADVISORS_LIST_REQUEST.type,
    () => {
      if (Array.isArray(AdvisorsReducer?.advisorsList) == true) {
        const ListData = AdvisorsReducer?.advisorsList?.map(item => ({
          id: item?.id,
          advId: item?.advisor?.id,
          name: item?.advisor?.full_name,
          rate: item?.advisor_review_avg_rating
            ? parseFloat(item?.advisor_review_avg_rating).toFixed(1)
            : '0',
          notice: `based on ${item?.advisor_review_count} reviews`,
          Insurance: item?.advisor?.role_name,
          status: item?.status == 1 ? Icons.closeinsurance : Icons.Rectangle,
          disabled: item?.status == 1 ? true : false,
          image:
            item?.advisor?.profile_photo_path == ''
              ? item?.advisor?.profile_photo_url
              : item?.advisor?.profile_photo_path,
        }));
        setAdvisorList(ListData);
      }
    },
    () => {
      setAdvisorList(null);
      showErrorAlert(AdvisorsReducer?.error?.message);
    },
  ]);

  this.status(AdvisorsReducer.status, [
    ADVISORS.SET_ADVISOR_REQUEST.type,
    () => {
      showErrorAlert(translate('Your advisor changed successfully!'));
      props.navigation.goBack();
    },
    () => {
      showErrorAlert(AdvisorsReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      getAdvisorsListReq();
      return () => {
        unsuscribe();
      };
    });
  }, []);

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header back={true} title={translate("Change advisor")} {...props} />
        <ScrollView>
          <View style={{padding: normalize(12)}}>
            {advisortList &&
              advisortList.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[style.itemBox, {flexDirection: 'row'}]}
                  activeOpacity={0.6}                  
                  onPress={() => {
                    if(item?.disabled==true){
                      showErrorAlert(translate('This advisor already selected!'));
                    }
                    else{
                      setAdvisorReq(item?.id)
                    }
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <ImageLoader
                      source={{uri: item.image}}
                      height={normalize(60)}
                      width={normalize(60)}
                      borderRadius={normalize(60)}
                      loaderColor={Colors.red}
                      loaderBorderColor={Colors.red}
                      loaderSize="small"
                    />
                    {/* <View
                    style={{
                      width: normalize(60),
                      height: normalize(60),
                      borderRadius: normalize(100),
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={Images.image_profile}
                      style={{
                        width: normalize(60),
                        height: normalize(60),
                      }}
                      resizeMode="cover"
                    />
                  </View> */}
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        paddingLeft: normalize(5),
                      }}>
                      <Text style={style.itemText}>{item.name}</Text>
                      <View style={{flexDirection: 'row',marginBottom:normalize(2)}}>
                        <Text style={style.itemTextDesc}>{item.rate}</Text>
                        <Image
                          source={item.rate == 0 ? Icons.star_line : Icons.star}
                          style={{
                            width: 10,
                            height: 10,
                            marginHorizontal: normalize(6),
                          }}
                        />
                        <Text style={style.itemTextNotice}>{item.notice}</Text>
                      </View>
                      <Text style={style.itemTextDesc}>{item.Insurance}</Text>
                    </View>
                      <Image
                        source={item.status}
                        style={{width: 20, height: 20, alignSelf: 'center'}}
                      />
                  </View>
                </TouchableOpacity>
              ))}
              {!advisortList || advisortList?.length == 0 ? (
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
                 {translate("No Advisor Found")}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          AdvisorsReducer.status === ADVISORS.GET_ADVISORS_LIST_REQUEST.type ||
          AdvisorsReducer.status === ADVISORS.SET_ADVISOR_REQUEST.type
        }
      />
    </>
  );
}

const style = StyleSheet.create({
  itemBox: {
    width: '100%',
    borderWidth: normalize(1),
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: normalize(10),
    marginBottom: normalize(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(15),
  },
  itemText: {
    fontFamily: Fonts.Montserrat_SemiBold,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(14),
    marginBottom: normalize(4),
    paddingLeft: normalize(6),
  },
  itemTextDesc: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(10),
    lineHeight: normalize(10),
    paddingLeft: normalize(6),
  },
  itemTextNotice: {
    fontFamily: Fonts.Montserrat_Regular,
    textAlign: 'left',
    color: Colors.black,
    fontSize: normalize(10),
    lineHeight: normalize(10),
    marginBottom: normalize(4),
  },
});
