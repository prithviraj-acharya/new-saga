import {put, call, takeLatest, select} from 'redux-saga/effects';
import {PROFILE, TOKEN, AUTH, POLICY} from '../redux/store/TypeConstants';
import {
  form_data,
  json_data,
  POST,
  GET,
  GET_SET,
  POST_SET,
  getToken,
} from './setup/method';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import constants from '../utils/helpers/constants';
import {setAppLanguage} from '../utils/helpers/i18n';

function* updateSignature(action) {
  try {
    let response = yield call(
      POST,
      'upload-signature',
      action.payload,
      yield getToken(),
      form_data,
    );
    yield put({
      type: PROFILE.GET_PROFILE_REQUEST.type,
    });
    yield put({
      type: PROFILE.UPDATE_SIGNATURE_SUCCESS.type,
      data: {
        [PROFILE.UPDATE_SIGNATURE_SUCCESS.value]: response?.data,
      },
    });
  } catch (error) {
    yield put({
      type: PROFILE.UPDATE_SIGNATURE_FAILURE.type,
      data: {error: error},
    });
  }
}

function* getProfile(action) {
  try {
    if (action.payload) {
      try {
        let response = yield call(GET, 'user', action.payload);        
        yield call(setAppLanguage,response?.data?.language==2?"en":"fr");
        yield call(EncryptedStorage.setItem, constants.LANGUAGE,JSON.stringify({
          value: response?.data?.language==2?2:1,
        }));
        yield call(
          GET_SET,
          POLICY.GET_BUYED_POLICY_SUCCESS,
          POLICY.GET_BUYED_POLICY_FAILURE,
          'user-policies',
          json_data,
          action.payload,
        );
        yield put({
          type: PROFILE.GET_PROFILE_SUCCESS.type,
          data: {
            [PROFILE.GET_PROFILE_SUCCESS.value]: response?.data,
          },
        });
        yield put({
          type: TOKEN.GET_TOKEN_SUCCESS.type,
          data: {
            [TOKEN.GET_TOKEN_SUCCESS.value]: action.payload,
          },
        });
      } catch (ex) {
        yield call(EncryptedStorage.removeItem, constants.TOKEN);
        yield put({
          type: 'RESET',
        });
      }
    } else {
      if(action.pay!=true){        
        yield call(
          GET_SET,
          POLICY.GET_BUYED_POLICY_SUCCESS,
          POLICY.GET_BUYED_POLICY_FAILURE,
          'user-policies',
        );
      }      
      yield call(
        GET_SET,
        PROFILE.GET_PROFILE_SUCCESS,
        PROFILE.GET_PROFILE_FAILURE,
        'user',
      );
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: 'RESET',
    });
  }
}

function* updateProfile(action) {
  if (action.byAPI == true) {
    try {
      yield call(
        POST_SET,
        PROFILE.UPDATE_PROFILE_SUCCESS,
        PROFILE.UPDATE_PROFILE_FAILURE,
        'profile-update',
        action.payload,
        form_data,
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    const ProfileReducer = yield select(state => state.ProfileReducer);
    yield put({
      type: PROFILE.UPDATE_PROFILE_SUCCESS.type,
      data: {
        [PROFILE.UPDATE_PROFILE_SUCCESS.value]: {
          ...ProfileReducer?.profileDetails,
          ...action.payload,
        },
      },
    });
  }
}

function* updateLanguage(action) {
  try {
    yield call(
      GET_SET,
      PROFILE.UPDATE_LANGUAGE_SUCCESS,
      PROFILE.UPDATE_LANGUAGE_FAILURE,
      'change-language'
    );
    yield put({ type: PROFILE.GET_PROFILE_REQUEST.type,pay:true})
  } catch (error) {
    console.log(error);
  }
}

export default {
  source: [
    (function* () {
      yield takeLatest(PROFILE.UPDATE_SIGNATURE_REQUEST.type, updateSignature);
    })(),
    (function* () {
      yield takeLatest(PROFILE.GET_PROFILE_REQUEST.type, getProfile);
    })(),
    (function* () {
      yield takeLatest(PROFILE.UPDATE_PROFILE_REQUEST.type, updateProfile);
    })(),
    (function* () {
      yield takeLatest(PROFILE.UPDATE_LANGUAGE_REQUEST.type, updateLanguage);
    })(),
  ],
};
