import {put, call, takeLatest} from 'redux-saga/effects';
import {POLICY} from '../redux/store/TypeConstants';
import {GET_SET, POST_SET} from './setup/method';

function* getAllPolicy() {
  try {
    yield call(
      GET_SET,
      POLICY.GET_POLICY_SUCCESS,
      POLICY.GET_POLICY_FAILURE,
      'insurances',
    );
  } catch (error) {
    console.log(error);
  }
}

function* getCompanyList(action) {
  try {
    yield call(
      GET_SET,
      POLICY.GET_POLICY_COMPANIES_SUCCESS,
      POLICY.GET_POLICY_COMPANIES_FAILURE,
      'companies?insurance_id=' + action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getCategory(action) {
  try {
    yield call(
      GET_SET,
      POLICY.GET_POLICY_CATEGORY_SUCCESS,
      POLICY.GET_POLICY_CATEGORY_FAILURE,
      'sub-insurances?insurance_id=' +
        action.payload.insuranceId +
        '&company_id=' +
        action.payload.companyId,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getSubCategory(action) {
  try {
    yield call(
      GET_SET,
      POLICY.GET_POLICY_SUB_CATEGORY_SUCCESS,
      POLICY.GET_POLICY_SUB_CATEGORY_FAILURE,
      'policies?insurance_id=' +
        action.payload.insuranceId +
        '&company_id=' +
        action.payload.companyId,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getPolicyDetails(action) {
  try {
    yield call(
      GET_SET,
      POLICY.GET_POLICY_DETAILS_SUCCESS,
      POLICY.GET_POLICY_DETAILS_FAILURE,
      'policy-details?policy_id=' + action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* setSelectedPolicy(action) {
  try {
    yield put({
      type: POLICY.SET_SELECTED_POLICY_SUCCESS.type,
      data: {
        [POLICY.SET_SELECTED_POLICY_SUCCESS.value]: action.payload,
      },
    });
  } catch (error) {
    yield put({
      type: POLICY.SET_SELECTED_POLICY_FAILURE.type,
      data: {error: 'faild to set'},
    });
  }
}

function* buyPolicy(action) {
  try {
    yield call(
      POST_SET,
      POLICY.BUY_POLICY_SUCCESS,
      POLICY.BUY_POLICY_FAILURE,
      'buy-policy',
      action.payload
    );
  } catch (error) {
    console.log(error);
  }
}

function* buyedPolicyList() {
  try {
    yield call(
      GET_SET,
      POLICY.GET_BUYED_POLICY_SUCCESS,
      POLICY.GET_BUYED_POLICY_FAILURE,
      'user-policies'
    );
  } catch (error) {
    console.log(error);
  }
}

function* getMySelectedAdvisor() {
  try {
    yield call(
      GET_SET,
      POLICY.GET_MY_SELECTED_ADVISOR_SUCCESS,
      POLICY.GET_MY_SELECTED_ADVISOR_FAILURE,
      'user-advisor',
    );
  } catch (error) {
    console.log(error);
  }
}

function* setOrderPolicy(action) {
  try {
    yield call(
      POST_SET,
      POLICY.SET_ORDER_POLICY_SUCCESS,
      POLICY.SET_ORDER_POLICY_FAILURE,
      'policies-ordering',
      action.payload
    );
  } catch (error) {
    console.log(error);
  }
}

export default {
  source: [
    (function* () {
      yield takeLatest(POLICY.GET_POLICY_REQUEST.type, getAllPolicy);
    })(),
    (function* () {
      yield takeLatest(
        POLICY.GET_POLICY_COMPANIES_REQUEST.type,
        getCompanyList,
      );
    })(),
    (function* () {
      yield takeLatest(POLICY.GET_POLICY_CATEGORY_REQUEST.type, getCategory);
    })(),
    (function* () {
      yield takeLatest(
        POLICY.GET_POLICY_SUB_CATEGORY_REQUEST.type,
        getSubCategory,
      );
    })(),
    (function* () {
      yield takeLatest(
        POLICY.GET_POLICY_DETAILS_REQUEST.type,
        getPolicyDetails,
      );
    })(),
    (function* () {
      yield takeLatest(
        POLICY.SET_SELECTED_POLICY_REQUEST.type,
        setSelectedPolicy,
      );
    })(),
    (function* () {
      yield takeLatest(POLICY.BUY_POLICY_REQUEST.type, buyPolicy);
    })(),
    (function* () {
      yield takeLatest(POLICY.GET_BUYED_POLICY_REQUEST.type, buyedPolicyList);
    })(),
    (function* () {
      yield takeLatest(POLICY.GET_MY_SELECTED_ADVISOR_REQUEST.type, getMySelectedAdvisor);
    })(),
    (function* () {
      yield takeLatest(POLICY.SET_ORDER_POLICY_REQUEST.type, setOrderPolicy);
    })(),
  ],
};
