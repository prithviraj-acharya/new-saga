import {call, takeLatest} from 'redux-saga/effects';
import {ADVISORS} from '../redux/store/TypeConstants';
import {GET_SET, POST_SET} from './setup/method';

function* getAdvisorsList() {
  try {
    yield call(
      GET_SET,
      ADVISORS.GET_ADVISORS_LIST_SUCCESS,
      ADVISORS.GET_ADVISORS_LIST_FAILURE,
      'advisors',
    );
  } catch (error) {
    console.log(error);
  }
}

function* setAdvisor(action) {
  try {
    yield call(
      GET_SET,
      ADVISORS.SET_ADVISOR_SUCCESS,
      ADVISORS.SET_ADVISOR_FAILURE,
      'choose-advisors?id=' + action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* rateAdvisor(action) {
  try {
    yield call(
      POST_SET,
      ADVISORS.RATE_ADVISOR_SUCCESS,
      ADVISORS.RATE_ADVISOR_FAILURE,
      'submit-review',
      action.payload,
    );
  } catch (error) {
    console.log(error);
  }
}

function* getAdvisorReviews(action) {
  try {
    yield call(
      GET_SET,
      ADVISORS.GET_ADVISOR_REVIEWS_SUCCESS,
      ADVISORS.GET_ADVISOR_REVIEWS_FAILURE,
      //'advisor-review?advisor_id=' + action.payload,
      'advisor-review',
    );
  } catch (error) {
    console.log(error);
  }
}

export default {
  source: [
    (function* () {
      yield takeLatest(
        ADVISORS.GET_ADVISORS_LIST_REQUEST.type,
        getAdvisorsList,
      );
    })(),
    (function* () {
      yield takeLatest(ADVISORS.SET_ADVISOR_REQUEST.type, setAdvisor);
    })(),
    (function* () {
      yield takeLatest(ADVISORS.RATE_ADVISOR_REQUEST.type, rateAdvisor);
    })(),
    (function* () {
      yield takeLatest(
        ADVISORS.GET_ADVISOR_REVIEWS_REQUEST.type,
        getAdvisorReviews,
      );
    })(),
  ],
};
