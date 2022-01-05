import {put, call, takeLatest} from 'redux-saga/effects';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import constants from '../utils/helpers/constants';
import {AUTH, TOKEN, PROFILE, POLICY} from '../redux/store/TypeConstants';
import {POST_SET,GET, GET_SET, POST, getToken, json_data} from './setup/method';
import {setAppLanguage} from '../utils/helpers/i18n';

function* getSignin(action) {
  try {
    let response = yield call(POST, 'login', action.payload);
    yield call(
      GET_SET,
      POLICY.GET_BUYED_POLICY_SUCCESS,
      POLICY.GET_BUYED_POLICY_FAILURE,
      'user-policies',
      json_data,
      response.token,
    );
    yield put({
      type: AUTH.LOGIN_SUCCESS.type,
      data: {[AUTH.LOGIN_SUCCESS.value]: response.data},
    });
    yield put({
      type: PROFILE.GET_PROFILE_SUCCESS.type,
      data: {
        [PROFILE.GET_PROFILE_SUCCESS.value]: response?.data?.user_details,
      },
    });
    yield call(setAppLanguage,response?.data?.user_details?.language==2?"en":"fr");
    yield call(EncryptedStorage.setItem, constants.LANGUAGE,JSON.stringify({
      value: response?.data?.user_details?.language==2?2:1,
    }));
    yield call(EncryptedStorage.setItem, constants.CREDENTIALS,JSON.stringify({
      email:action?.payload?.email,
      password:action?.payload?.password,
    }));
    yield call(
      EncryptedStorage.setItem,
      constants.TOKEN,
      JSON.stringify({token: response.token}),
    );
    yield put({
      type: TOKEN.SET_TOKEN_SUCCESS.type,
      data: {[TOKEN.SET_TOKEN_SUCCESS.value]: response.token},
    });
  } catch (error) {
    yield put({
      type: AUTH.LOGIN_FAILURE.type,
      data: {error: error},
    });
  }
}

function* userLogout(action) {
  try {
    let response = yield call(POST, 'logout', {}, yield getToken());
    yield call(EncryptedStorage.removeItem, constants.TOKEN);
    yield put({
      type: 'RESET',
    });
  } catch (err) {
    console.log(err);
  }
}

function* signUp(action) {
  try {
    yield call(
      POST_SET,
      AUTH.SIGNUP_SUCCESS,
      AUTH.SIGNUP_FAILURE,
      'register',
      action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* signUpOTPSend(action) {
  try {    
    yield call(
      POST_SET,
      AUTH.SIGNUP_OTP_SEND_SUCCESS,
      AUTH.SIGNUP_OTP_SEND_FAILURE,
      'otp-send',
      action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* signUpOTPVerify(action) {
  try {
    const _payload={...action.payload}
    delete _payload.isFromForgot;
    let response = yield call(
      POST,
      action.payload.isFromForgot==true?'forgot-password-otp-validate':'otp-validate',
      _payload,
      yield call(getToken),
    );
    yield put({
      type: AUTH.SIGNUP_OTP_VERIFY_SUCCESS.type,
      data: {[AUTH.SIGNUP_OTP_VERIFY_SUCCESS.value]: response.token},
    });
  } catch (error) {
    yield put({
      type: AUTH.SIGNUP_OTP_VERIFY_FAILURE.type,
      data: {error: error},
    });
  }
}

function* passwordSetup(action) {
  try {
    let response = yield call(
      POST,
      action.payload.isFromForgot==true?'change-password':'password-setup',
      action.payload.isFromForgot==true?
      {
        password:action.payload.password
      }:{
        password: action.payload.password,
        device_token: action.payload.device_token,
        device_type: action.payload.device_type,
      },
      action.payload.token,
    );
    if(action.payload.isFromForgot!=true){
      yield call(
        EncryptedStorage.setItem,
        constants.TOKEN,
        JSON.stringify({
          token: response.token,
        }),
      );
      yield put({
        type:PROFILE.GET_PROFILE_REQUEST.type
      })
    }
    yield put({
      type: AUTH.PASSWORD_SETUP_SUCCESS.type,
      data: {[AUTH.PASSWORD_SETUP_SUCCESS.value]: response.data},
    });
    if(action.payload.isFromForgot!=true){
      yield put({
        type: TOKEN.SET_TOKEN_SUCCESS.type,
        data: {[TOKEN.SET_TOKEN_SUCCESS.value]: response.token},
      });
    }    
  } catch (error) {
    yield put({
      type: AUTH.PASSWORD_SETUP_FAILURE.type,
      data: {error: error},
    });
  }
}

function* switchAccount(action) {
  try {
    let response = yield call(GET, 'switch-another-account?user_id='+action.payload,yield getToken());    
    yield call(
      GET_SET,
      POLICY.GET_BUYED_POLICY_SUCCESS,
      POLICY.GET_BUYED_POLICY_FAILURE,
      'user-policies',
      json_data,
      response.token,
    );
    yield put({
      type: AUTH.SWITCH_ACCOUNT_SUCCESS.type,
      data: {[AUTH.SWITCH_ACCOUNT_SUCCESS.value]: response.data},
    });
    yield put({
      type: PROFILE.GET_PROFILE_SUCCESS.type,
      data: {
        [PROFILE.GET_PROFILE_SUCCESS.value]: response?.data,
      },
    });
    yield call(setAppLanguage,response?.data?.language==2?"en":"fr");
    yield call(EncryptedStorage.setItem, constants.LANGUAGE,JSON.stringify({
      value: response?.data?.language==2?2:1,
    }));
    yield call(
      EncryptedStorage.setItem,
      constants.TOKEN,
      JSON.stringify({token: response.token}),
    );
    yield put({
      type: TOKEN.SET_TOKEN_SUCCESS.type,
      data: {[TOKEN.SET_TOKEN_SUCCESS.value]: response.token},
    });
  } catch (error) {
    yield put({
      type: AUTH.SWITCH_ACCOUNT_FAILURE.type,
      data: {error: error},
    });
  }
}

function* forgotPassword(action) {
  try {
    let response = yield call(
      POST,
      'forgot-password',
      action.payload,
    );
    yield put({
      type: AUTH.FORGOT_PASSWORD_SUCCESS.type,
      data: {[AUTH.FORGOT_PASSWORD_SUCCESS.value]: response.data},
    });
  } catch (error) {
    yield put({
      type: AUTH.FORGOT_PASSWORD_FAILURE.type,
      data: {error: error},
    });
  }
}

function* deleteAccount(action) {
  try {
    let response = yield call(
      GET,
      'delete-account',
      yield getToken()
    );
    yield call(EncryptedStorage.removeItem, constants.TOKEN);
    yield put({
      type: 'RESET',
    });
  } catch (error) {
    yield put({
      type: AUTH.DELETE_ACCOUNT_FAILURE.type,
      data: {error: error},
    });
  }
}

export default {
  source: [
    (function* () {
      yield takeLatest(AUTH.LOGIN_REQUEST.type, getSignin);
    })(),
    (function* () {
      yield takeLatest(AUTH.LOGOUT_REQUEST.type, userLogout);
    })(),

    (function* () {
      yield takeLatest(AUTH.SIGNUP_REQUEST.type, signUp);
    })(),
    (function* () {
      yield takeLatest(AUTH.SIGNUP_OTP_SEND_REQUEST.type, signUpOTPSend);
    })(),
    (function* () {
      yield takeLatest(AUTH.SIGNUP_OTP_VERIFY_REQUEST.type, signUpOTPVerify);
    })(),
    (function* () {
      yield takeLatest(AUTH.PASSWORD_SETUP_REQUEST.type, passwordSetup);
    })(),
    (function* () {
      yield takeLatest(AUTH.SWITCH_ACCOUNT_REQUEST.type, switchAccount);
    })(),
    (function* () {
      yield takeLatest(AUTH.FORGOT_PASSWORD_REQUEST.type, forgotPassword);
    })(),
    (function* () {
      yield takeLatest(AUTH.DELETE_ACCOUNT_REQUEST.type, deleteAccount);
    })(),
  ],
};
