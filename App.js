import React, {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

import StackNav from './src/navigators/StackNav';
import {getToken} from './src/redux/action/TokenAction';
import {useDispatch} from 'react-redux';

import Splash from './src/screens/auth/Splash';
import {setAppLanguage} from './src/utils/helpers/i18n';
import constants from './src/utils/helpers/constants';

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const setLanguage = async () => {
    try {
      const res = await EncryptedStorage.getItem(constants.LANGUAGE);
      if (res) {
        const rs = JSON.parse(res);
        let currentLanguage = rs.value ? rs.value : 1;
        setAppLanguage(currentLanguage == 2 ? 'en' : 'fr');
        setLoading(false);
      } else {
        setAppLanguage('fr');
        setLoading(false);
      }
    } catch (ex) {
      setAppLanguage('fr');
      setLoading(false);
    }
  };
  useEffect(() => {
    setLanguage();
    setTimeout(() => {
      dispatch(getToken());
    }, 1500);
  }, []);

  return loading == true ? <Splash /> : <StackNav />;
}
