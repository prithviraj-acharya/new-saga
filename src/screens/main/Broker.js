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
import moment from 'moment';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getMandateList} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL, POLICY} from '../../redux/store/TypeConstants';

import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';
let isSingle = false;

export default function Broker(props) {
  isSingle = props?.route?.params?.isSingle;
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const isCompanyProfile =
    ProfileReducer?.profileDetails?.role_name === 'COMPANY';
  const isMember = ProfileReducer?.profileDetails?.parent_id !== 0;

  const [documentList, setDocumentList] = useState(null);

  const getAllMandateList = payload => {
    isInternetConnected()
      .then(() => {
        dispatch(getMandateList(payload));
      })
      .catch(err => {
        showErrorAlert('Please Connect To Internet');
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_BROKER_MANDATE_LIST_REQUEST.type,
    () => {
      const mandates = GeneralReducer?.mandateList?.map((item, i) => {
        if (item) {
          return {
            date: item?.signature_date,
            form: item?.borakermandate_form,
            name:
              item?.last_name == ''
                ? item?.full_name
                : (item?.last_name ?? '') + ' ' + (item?.first_name ?? ''),
          };
        }
      });
      setDocumentList(mandates);
    },
    () => {
      setDocumentList(null);
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', payload => {
      if (isSingle == true) {
        // getAllMandateList({
        //   company_id: companyId,
        //   insurance_id: insuranceId,
        // });
      } else {
        getAllMandateList();
      }
      return () => {
        unsuscribe();
      };
    });
  }, []);
  function isUrlValid(userInput) {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery,"i");
    return url.test(userInput);
}
  const downloadFile = async (path,name="") => {
    const supported = isUrlValid(path);
    if (supported) {      
      props.navigation.navigate('PDFViewer', {uri: path,customName:name+"_Mandate.pdf"});
    } else {
      showErrorAlert('The document link is not valid!');
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          back={true}
          title={translate("Broker Mandate")}
          add={!isMember}
          addPress={() => {
            if (isCompanyProfile == true) {
              props.navigation.navigate('CompanyList');
            } else {
              props.navigation.navigate('FamilyMemberList');
            }
          }}
          {...props}
        />
        <ScrollView>
          <View style={{padding: normalize(20)}}>
            {documentList &&
              documentList.map((item, i) =>
                item ? (
                  <TouchableOpacity key={i} style={[style.itemBox, {flexDirection: 'row'}]} activeOpacity={.6} onPress={()=>downloadFile(item?.form,item.name)}>
                    <View style={{flex: 1}}>
                      <Text style={style.itemText}>{item.name} - {translate("Mandate")}</Text>
                      <Text style={style.itemTextDesc}>
                        Signed - {item.date ?? 'No Date Found'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null,
              )}

            {!documentList || documentList?.length == 0 ? (
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
                  No Mandate Found
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Loader
        visible={
          GeneralReducer.status === GENERAL.GET_BROKER_MANDATE_LIST_REQUEST.type
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
  },
  itemText: {
    fontFamily: Fonts.Montserrat_SemiBold,
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
