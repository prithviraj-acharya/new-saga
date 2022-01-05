import {select, call, put} from 'redux-saga/effects';
import {postApi, getApi} from '../../utils/helpers/ApiRequest';

export function* getToken() {
  const TokenReducer = yield select(state => state.TokenReducer);
  return TokenReducer?.token;
}

export const json_data = {
  Accept: 'application/json',
  contenttype: 'application/json',
};

export const form_data = {
  Accept: 'application/json',
  contenttype: 'multipart/form-data',
};

export async function POST(URL, PAYLOAD, TOKEN, HEADER = json_data) {
  try {
    let response = await postApi(URL, PAYLOAD, TOKEN, HEADER);
    if (response?.data?.status == true) {
      return response?.data;
    } else {
      throw response?.data;
    }
  } catch (error) {
    throw error;
  }
}

export async function GET(URL, TOKEN, HEADER = json_data) {
  try {
    let response = await getApi(URL, TOKEN, HEADER);
    if (response?.data?.status == true) {
      return response?.data;
    } else {
      throw response?.data;
    }
  } catch (error) {
    throw error;
  }
}

export function* GET_SET(_SUCCESS, _FAILD, URL, HEADER = json_data, TOKEN) {
  try {
    if (!TOKEN) {
      TOKEN = yield call(getToken);
    }
    let response = yield call(getApi, URL, TOKEN, HEADER);
    if (response?.data?.status == true) {
      yield put({
        type: _SUCCESS.type,
        data: {
          [_SUCCESS.value]: response.data.data,
        },
      });
    } else {
      yield put({
        type: _FAILD.type,
        data: {
          error: response.data
        },
      });
    }
  } catch (error) {
    yield put({type: _FAILD.type, data: {error: error}});
  }
}

export function* POST_SET(
  _SUCCESS,
  _FAILD,
  URL,
  PAYLOAD,
  HEADER = json_data,
  TOKEN,
) {
  try {
    if (!TOKEN) {
      TOKEN = yield call(getToken);
    }
    let response = yield call(postApi, URL, PAYLOAD, TOKEN, HEADER);   
    if (response?.data?.status == true) {
      yield put({
        type: _SUCCESS.type,
        data: {
          [_SUCCESS.value]: response.data.data,
        },
      });
    } else {      
      yield put({
        type: _FAILD.type,
        data: {
          error: response.data
        },
      });
    }
  } catch (error) {
    yield put({type: _FAILD.type, data: {error: error}});
  }
}
