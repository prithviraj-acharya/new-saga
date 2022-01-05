import {GENERAL} from '../store/TypeConstants';

export const getHelpList = () => ({
  type: GENERAL.GET_HELP_REQUEST.type
});
export const getSecurityList = () => ({
  type: GENERAL.GET_SECURITY_LIST_REQUEST.type
});
export const getTermsConditions = () => ({
  type: GENERAL.GET_TERMS_CONDITIONS_REQUEST.type
});
export const getPrivacyPolicy = () => ({
  type: GENERAL.GET_PRIVACY_POLICY_REQUEST.type
});
export const getMessagesList = () => ({
  type: GENERAL.MESSAGE_LIST_REQUEST.type
});
export const sendMessage = (payload) => ({
  type: GENERAL.SEND_MESSAGE_REQUEST.type,
  payload
});
export const getMessage = (payload) => ({
  type: GENERAL.GET_MESSAGE_REQUEST.type,
  payload
});
export const getMandateList = (payload) => ({
  type: GENERAL.GET_BROKER_MANDATE_LIST_REQUEST.type,
  payload
});
export const addMemberComapny = (payload) => ({
  type: GENERAL.ADD_MEMBER_COMPANY_REQUEST.type,
  payload
});
export const getMemberComapnyList = (payload) => ({
  type: GENERAL.GET_MEMBER_COMPANY_LIST_REQUEST.type,
  payload
});
export const getMemberComapny= (payload) => ({
  type: GENERAL.GET_MEMBER_COMPANY_REQUEST.type,
  payload
});
export const updateMemberComapny= (payload) => ({
  type: GENERAL.UPDATE_MEMBER_COMPANY_REQUEST.type,
  payload
});
export const getRef= (payload) => ({
  type: GENERAL.GET_REF_CODE_REQUEST.type,
  payload
});
export const getRefFriends= () => ({
  type: GENERAL.GET_REF_FRIENDS_REQUEST.type
});
export const setUserForm= (payload) => ({
  type: GENERAL.SET_USER_FORM_REQUEST.type,
  payload
});