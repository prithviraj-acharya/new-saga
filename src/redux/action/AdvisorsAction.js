import {ADVISORS} from '../store/TypeConstants';

export const getAdvisorsList = () => ({
  type: ADVISORS.GET_ADVISORS_LIST_REQUEST.type
});

export const setAdvisor = (payload) => ({
  type: ADVISORS.SET_ADVISOR_REQUEST.type,
  payload
});

export const rateAdvisor = (payload) => ({
  type: ADVISORS.RATE_ADVISOR_REQUEST.type,
  payload
});

export const getAdvisorReviews = (payload) => ({
  type: ADVISORS.GET_ADVISOR_REVIEWS_REQUEST.type,
  payload
});


