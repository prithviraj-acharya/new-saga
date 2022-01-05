import {call, takeLatest, put} from 'redux-saga/effects';
import {GENERAL} from '../redux/store/TypeConstants';
import {form_data, GET_SET, POST_SET} from './setup/method';

function* getHelpList() {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_HELP_SUCCESS,
      GENERAL.GET_HELP_FAILURE,
      'help',
    );
  } catch (error) {
    console.log(error);
  }
}

function* getSecurityList() {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_SECURITY_LIST_SUCCESS,
      GENERAL.GET_SECURITY_LIST_FAILURE,
      'security',
    );
  } catch (error) {
    console.log(error);
  }
}

function* getTermsConditions() {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_TERMS_CONDITIONS_SUCCESS,
      GENERAL.GET_TERMS_CONDITIONS_FAILURE,
      'terms-and-conditions',
    );
  } catch (error) {
    console.log(error);
  }
}

function* getPrivacyPolicy() {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_PRIVACY_POLICY_SUCCESS,
      GENERAL.GET_PRIVACY_POLICY_FAILURE,
      'policy',
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMessagesList(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.MESSAGE_LIST_SUCCESS,
      GENERAL.MESSAGE_LIST_FAILURE,
      'message-policies',
    );
  } catch (error) {
    console.log(error);
  }
}

function* sendMessage(action) {
  try {
    yield call(
      POST_SET,
      GENERAL.SEND_MESSAGE_SUCCESS,
      GENERAL.SEND_MESSAGE_FAILURE,
      'send-message',
      action.payload,
      form_data,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMessage(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_MESSAGE_SUCCESS,
      GENERAL.GET_MESSAGE_FAILURE,
      'messages?policy_id=' + action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMandateList(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_BROKER_MANDATE_LIST_SUCCESS,
      GENERAL.GET_BROKER_MANDATE_LIST_FAILURE,
      action?.payload
        ? 'broker-mandate?insurance_id=' +
            action?.payload?.insurance_id +
            '&company_id=' +
            action?.payload?.company_id
        : 'broker-mandate',
    );
  } catch (error) {
    console.log(error);
  }
}

function* addMemberComapny(action) {
  try {
    yield call(
      POST_SET,
      GENERAL.ADD_MEMBER_COMPANY_SUCCESS,
      GENERAL.ADD_MEMBER_COMPANY_FAILURE,
      'add-family-and-company',
      action.payload,
      form_data
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMemberComapnyList(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_MEMBER_COMPANY_LIST_SUCCESS,
      GENERAL.GET_MEMBER_COMPANY_LIST_FAILURE,
      'get-family-and-company?user_type='+action.payload
    );
  } catch (error) {
    console.log(error);
  }
}

function* updateMemberComapny(action) {
  try {
    yield call(
      POST_SET,
      GENERAL.UPDATE_MEMBER_COMPANY_SUCCESS,
      GENERAL.UPDATE_MEMBER_COMPANY_FAILURE,
      'update-family-and-company',
      action.payload
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMemberComapny(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_MEMBER_COMPANY_SUCCESS,
      GENERAL.GET_MEMBER_COMPANY_FAILURE,
      'get-family-and-company-details?user_id='+action.payload
    );
  } catch (error) {
    console.log(error);
  }
}

function* getRef(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_REF_CODE_SUCCESS,
      GENERAL.GET_REF_CODE_FAILURE,
      'invite-friends'
    );
  } catch (error) {
    console.log(error);
  }
}

function* getRefFriends(action) {
  try {
    yield call(
      GET_SET,
      GENERAL.GET_REF_FRIENDS_SUCCESS,
      GENERAL.GET_REF_FRIENDS_FAILURE,
      'referral-friends'
    );
  } catch (error) {
    console.log(error);
  }
}

function* setUserForm(action) {
  try {
    yield put({
      type: GENERAL.SET_USER_FORM_SUCCESS.type,
      data: {
        [GENERAL.SET_USER_FORM_SUCCESS.value]: action?.payload,
      },
    });
  } catch (error) {
    console.log(error);
  }
}


export default {
  source: [
    (function* () {
      yield takeLatest(GENERAL.GET_HELP_REQUEST.type, getHelpList);
    })(),
    (function* () {
      yield takeLatest(GENERAL.GET_SECURITY_LIST_REQUEST.type, getSecurityList);
    })(),
    (function* () {
      yield takeLatest(GENERAL.GET_PRIVACY_POLICY_REQUEST.type, getPrivacyPolicy);
    })(),
    (function* () {
      yield takeLatest(GENERAL.GET_TERMS_CONDITIONS_REQUEST.type, getTermsConditions);
    })(),
    (function* () {
      yield takeLatest(GENERAL.MESSAGE_LIST_REQUEST.type, getMessagesList);
    })(),
    (function* () {
      yield takeLatest(GENERAL.SEND_MESSAGE_REQUEST.type, sendMessage);
    })(),
    (function* () {
      yield takeLatest(GENERAL.GET_MESSAGE_REQUEST.type, getMessage);
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.GET_BROKER_MANDATE_LIST_REQUEST.type,
        getMandateList,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.ADD_MEMBER_COMPANY_REQUEST.type,
        addMemberComapny,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type,
        getMemberComapnyList,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.GET_MEMBER_COMPANY_REQUEST.type,
        getMemberComapny,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.UPDATE_MEMBER_COMPANY_REQUEST.type,
        updateMemberComapny,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.GET_REF_CODE_REQUEST.type,
        getRef,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.GET_REF_FRIENDS_REQUEST.type,
        getRefFriends,
      );
    })(),
    (function* () {
      yield takeLatest(
        GENERAL.SET_USER_FORM_REQUEST.type,
        setUserForm,
      );
    })(),
  ],
};
