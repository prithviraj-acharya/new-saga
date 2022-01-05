import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import {translate} from '../../utils/helpers/i18n';
import isInternetConnected from '../../utils/helpers/NetInfo';
import {getTermsConditions} from '../../redux/action/GeneralAction';
import Loader from '../../utils/helpers/Loader';
import {GENERAL} from '../../redux/store/TypeConstants';

import {WebView} from 'react-native-webview';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

export default function TermsAndConditions(props) {
  const dispatch = useDispatch();
  const GeneralReducer = useSelector(state => state.GeneralReducer);
  const [content, setContent] = useState('');
  const req = () => {
    isInternetConnected()
      .then(() => {
        dispatch(getTermsConditions());
      })
      .catch(err => {
        showErrorAlert(translate('Please Connect To Internet'));
      });
  };

  this.status(GeneralReducer.status, [
    GENERAL.GET_TERMS_CONDITIONS_REQUEST.type,
    () => {
      if (GeneralReducer?.termsConditions?.content) {
        setContent(GeneralReducer?.termsConditions?.content);
      }
    },
    () => {
      showErrorAlert(GeneralReducer?.error?.message);
    },
  ]);

  useEffect(() => {
    req();
  }, []);
  return (
    <>
      <MyStatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Header back={true} title={translate("Terms and Conditions")} {...props} />
        <WebView
          originWhitelist={['*']}
          source={{
            html: `<head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${content}</body></html>`,
          }}
        />
        <Loader
          visible={
            GeneralReducer.status === GENERAL.GET_TERMS_CONDITIONS_REQUEST.type
          }
        />
      </SafeAreaView>
    </>
  );
}
