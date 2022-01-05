import {takeLatest, call, put} from 'redux-saga/effects';
import {TOKEN,PROFILE} from '../redux/store/TypeConstants';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import constants from '../utils/helpers/constants';

function* tokenAction(action) {
  try {
    yield call(EncryptedStorage.setItem, constants.TOKEN, action.payload);
    yield put({
      type: TOKEN.SET_TOKEN_SUCCESS.type,
      data: {[TOKEN.SET_TOKEN_SUCCESS.value]: action.payload},
    });
  } catch (err) {
    yield put({
      type: TOKEN.SET_TOKEN_FAILURE.type,
      data: {[TOKEN.SET_TOKEN_FAILURE.value]: null},
      error: err,
    });
  }
}

function* getTokenAction() {
  try {
    let token = yield call(EncryptedStorage.getItem, constants.TOKEN);
    if(token!=null && token!=""){
      token=JSON.parse(token);      
      yield put({
        type: PROFILE.GET_PROFILE_REQUEST.type,
        payload:token?.token
      });      
    }
    else{
      yield put({
        type: TOKEN.GET_TOKEN_SUCCESS.type,
        data: {
          [TOKEN.GET_TOKEN_SUCCESS.value]: null,
        },
      });
    }
    
  } catch (err) {
    yield put({
      type: TOKEN.GET_TOKEN_FAILURE,
      data: {[TOKEN.GET_TOKEN_FAILURE.value]: null},
      error: err,
    });
  }
}

export default {
  source: [
    (function* () {
      yield takeLatest(TOKEN.SET_TOKEN_REQUEST.type, tokenAction);
    })(),
    (function* () {
      yield takeLatest(TOKEN.GET_TOKEN_REQUEST.type, getTokenAction);
    })(),
  ],
};
