import {POLICY} from '../store/TypeConstants';

export const getAllPolicy = payload => ({
  type: POLICY.GET_POLICY_REQUEST.type,
  payload,
});

export const getCompanyList = (payload) => ({
  type: POLICY.GET_POLICY_COMPANIES_REQUEST.type,
  payload
});

export const getCategory = (payload) => ({
  type: POLICY.GET_POLICY_CATEGORY_REQUEST.type,
  payload
});

export const getSubCategory = (payload) => ({
  type: POLICY.GET_POLICY_SUB_CATEGORY_REQUEST.type,
  payload
});

export const getPolicyDetails = (payload) => ({
  type: POLICY.GET_POLICY_DETAILS_REQUEST.type,
  payload
});

export const setSelectedPolicy = (payload) => ({
  type: POLICY.SET_SELECTED_POLICY_REQUEST.type,
  payload
});

export const buyPolicy = (payload) => ({
  type: POLICY.BUY_POLICY_REQUEST.type,
  payload
});

export const getBuyedPolicyList = () => ({
  type: POLICY.GET_BUYED_POLICY_REQUEST.type
});

export const getMySelectedAdvisor = () => ({
  type: POLICY.GET_MY_SELECTED_ADVISOR_REQUEST.type
});
export const setOrderPolicy = (payload) => ({
  type: POLICY.SET_ORDER_POLICY_REQUEST.type,
  payload
});