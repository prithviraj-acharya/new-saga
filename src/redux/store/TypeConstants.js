export const TOKEN = {
  SET_TOKEN_REQUEST: {
    type: 'SET_TOKEN_REQUEST',
    value: 'token',
  },
  SET_TOKEN_SUCCESS: {
    type: 'SET_TOKEN_SUCCESS',
    value: 'token',
  },
  SET_TOKEN_FAILURE: {
    type: 'SET_TOKEN_FAILURE',
    value: 'token',
  },


  GET_TOKEN_REQUEST: {
    type: 'GET_TOKEN_REQUEST',
    value: 'token',
  },
  GET_TOKEN_SUCCESS: {
    type: 'GET_TOKEN_SUCCESS',
    value: 'token',
  },
  GET_TOKEN_FAILURE: {
    type: 'GET_TOKEN_FAILURE',
    value: 'token',
  },
};

export const AUTH = {
  LOGIN_REQUEST: {
    type: 'LOGIN_REQUEST',
    value: 'signinResponse',
  },
  LOGIN_SUCCESS: {
    type: 'LOGIN_SUCCESS',
    value: 'signinResponse',
  },
  LOGIN_FAILURE: {
    type: 'LOGIN_FAILURE',
    value: 'signinResponse',
  },
  

  LOGOUT_REQUEST: {
    type: 'LOGOUT_REQUEST',
    value: 'signinResponse',
  },
  LOGOUT_SUCCESS: {
    type: 'LOGOUT_SUCCESS',
    value: 'signinResponse',
  },
  LOGOUT_FAILURE: {
    type: 'LOGOUT_FAILURE',
    value: 'signinResponse',
  },


  SIGNUP_REQUEST: {
    type: 'SIGNUP_REQUEST',
    value: 'signUpResponse',
  },
  SIGNUP_SUCCESS: {
    type: 'SIGNUP_SUCCESS',
    value: 'signUpResponse',
  },
  SIGNUP_FAILURE: {
    type: 'SIGNUP_FAILURE',
    value: 'signUpResponse',
  },


  SIGNUP_OTP_SEND_REQUEST: {
    type: 'SIGNUP_OTP_SEND_REQUEST',
    value: 'signUpOTPResponse',
  },
  SIGNUP_OTP_SEND_SUCCESS: {
    type: 'SIGNUP_OTP_SEND_SUCCESS',
    value: 'signUpOTPResponse',
  },
  SIGNUP_OTP_SEND_FAILURE: {
    type: 'SIGNUP_OTP_SEND_FAILURE',
    value: 'signUpOTPResponse',
  },


  SIGNUP_OTP_VERIFY_REQUEST: {
    type: 'SIGNUP_OTP_VERIFY_REQUEST',
    value: 'signUpOTPVerifyResponse',
  },
  SIGNUP_OTP_VERIFY_SUCCESS: {
    type: 'SIGNUP_OTP_VERIFY_SUCCESS',
    value: 'signUpOTPVerifyResponse',
  },
  SIGNUP_OTP_VERIFY_FAILURE: {
    type: 'SIGNUP_OTP_VERIFY_FAILURE',
    value: 'signUpOTPVerifyResponse',
  },

  PASSWORD_SETUP_REQUEST: {
    type: 'PASSWORD_SETUP_REQUEST',
    value: 'passwordSetup',
  },
  PASSWORD_SETUP_SUCCESS: {
    type: 'PASSWORD_SETUP_SUCCESS',
    value: 'passwordSetup',
  },
  PASSWORD_SETUP_FAILURE: {
    type: 'PASSWORD_SETUP_FAILURE',
    value: 'passwordSetup',
  },

  SWITCH_ACCOUNT_REQUEST: {
    type: 'SWITCH_ACCOUNT_REQUEST',
    value: 'switchAccount',
  },
  SWITCH_ACCOUNT_SUCCESS: {
    type: 'SWITCH_ACCOUNT_SUCCESS',
    value: 'switchAccount',
  },
  SWITCH_ACCOUNT_FAILURE: {
    type: 'SWITCH_ACCOUNT_FAILURE',
    value: 'switchAccount',
  },

  FORGOT_PASSWORD_REQUEST: {
    type: 'FORGOT_PASSWORD_REQUEST',
    value: 'forgotPassword',
  },
  FORGOT_PASSWORD_SUCCESS: {
    type: 'FORGOT_PASSWORD_SUCCESS',
    value: 'forgotPassword',
  },
  FORGOT_PASSWORD_FAILURE: {
    type: 'FORGOT_PASSWORD_FAILURE',
    value: 'forgotPassword',
  },

  DELETE_ACCOUNT_REQUEST: {
    type: 'DELETE_ACCOUNT_REQUEST',
    value: 'deleteAccount',
  },
  DELETE_ACCOUNT_SUCCESS: {
    type: 'DELETE_ACCOUNT_SUCCESS',
    value: 'deleteAccount',
  },
  DELETE_ACCOUNT_FAILURE: {
    type: 'DELETE_ACCOUNT_FAILURE',
    value: 'deleteAccount',
  },

};


export const POLICY = {
  GET_POLICY_REQUEST: {
    type: 'GET_POLICY_REQUEST',
    value: 'policyList',
  },
  GET_POLICY_SUCCESS: {
    type: 'GET_POLICY_SUCCESS',
    value: 'policyList',
  },
  GET_POLICY_FAILURE: {
    type: 'GET_POLICY_FAILURE',
    value: 'policyList',
  },

  GET_POLICY_COMPANIES_REQUEST: {
    type: 'GET_POLICY_COMPANIES_REQUEST',
    value: 'companyList',
  },
  GET_POLICY_COMPANIES_SUCCESS: {
    type: 'GET_POLICY_COMPANIES_SUCCESS',
    value: 'companyList',
  },
  GET_POLICY_COMPANIES_FAILURE: {
    type: 'GET_POLICY_COMPANIES_FAILURE',
    value: 'companyList',
  },


  GET_POLICY_CATEGORY_REQUEST: {
    type: 'GET_POLICY_CATEGORY_REQUEST',
    value: 'policyCategory',
  },
  GET_POLICY_CATEGORY_SUCCESS: {
    type: 'GET_POLICY_CATEGORY_SUCCESS',
    value: 'policyCategory',
  },
  GET_POLICY_CATEGORY_FAILURE: {
    type: 'GET_POLICY_CATEGORY_FAILURE',
    value: 'policyCategory',
  },


  GET_POLICY_SUB_CATEGORY_REQUEST: {
    type: 'GET_POLICY_SUB_CATEGORY_REQUEST',
    value: 'policySubCategory',
  },
  GET_POLICY_SUB_CATEGORY_SUCCESS: {
    type: 'GET_POLICY_SUB_CATEGORY_SUCCESS',
    value: 'policySubCategory',
  },
  GET_POLICY_SUB_CATEGORY_FAILURE: {
    type: 'GET_POLICY_SUB_CATEGORY_FAILURE',
    value: 'policySubCategory',
  },

  GET_POLICY_DETAILS_REQUEST: {
    type: 'GET_POLICY_DETAILS_REQUEST',
    value: 'policyDetails',
  },
  GET_POLICY_DETAILS_SUCCESS: {
    type: 'GET_POLICY_DETAILS_SUCCESS',
    value: 'policyDetails',
  },
  GET_POLICY_DETAILS_FAILURE: {
    type: 'GET_POLICY_DETAILS_FAILURE',
    value: 'policyDetails',
  },

  SET_SELECTED_POLICY_REQUEST: {
    type: 'SET_SELECTED_POLICY_REQUEST',
    value: 'selectedPolicyList',
  },
  SET_SELECTED_POLICY_SUCCESS: {
    type: 'SET_SELECTED_POLICY_SUCCESS',
    value: 'selectedPolicyList',
  },
  SET_SELECTED_POLICY_FAILURE: {
    type: 'SET_SELECTED_POLICY_FAILURE',
    value: 'selectedPolicyList',
  },
  
  BUY_POLICY_REQUEST: {
    type: 'BUY_POLICY_REQUEST',
    value: 'buyPolicy',
  },
  BUY_POLICY_SUCCESS: {
    type: 'BUY_POLICY_SUCCESS',
    value: 'buyPolicy',
  },
  BUY_POLICY_FAILURE: {
    type: 'BUY_POLICY_FAILURE',
    value: 'buyPolicy',
  },

  GET_BUYED_POLICY_REQUEST: {
    type: 'GET_BUYED_POLICY_REQUEST',
    value: 'buyedPolicyList',
  },
  GET_BUYED_POLICY_SUCCESS: {
    type: 'GET_BUYED_POLICY_SUCCESS',
    value: 'buyedPolicyList',
  },
  GET_BUYED_POLICY_FAILURE: {
    type: 'GET_BUYED_POLICY_FAILURE',
    value: 'buyedPolicyList',
  },

  GET_MY_SELECTED_ADVISOR_REQUEST: {
    type: 'GET_MY_SELECTED_ADVISOR_REQUEST',
    value: 'mySelectedAdvisor',
  },
  GET_MY_SELECTED_ADVISOR_SUCCESS: {
    type: 'GET_MY_SELECTED_ADVISOR_SUCCESS',
    value: 'mySelectedAdvisor',
  },
  GET_MY_SELECTED_ADVISOR_FAILURE: {
    type: 'GET_MY_SELECTED_ADVISOR_FAILURE',
    value: 'mySelectedAdvisor',
  },

  SET_ORDER_POLICY_REQUEST: {
    type: 'SET_ORDER_POLICY_REQUEST',
    value: 'setOrderPolicy',
  },
  SET_ORDER_POLICY_SUCCESS: {
    type: 'SET_ORDER_POLICY_SUCCESS',
    value: 'setOrderPolicy',
  },
  SET_ORDER_POLICY_FAILURE: {
    type: 'SET_ORDER_POLICY_FAILURE',
    value: 'setOrderPolicy',
  },

};

export const PROFILE = {
  GET_PROFILE_REQUEST: {
    type: 'GET_PROFILE_REQUEST',
    value: 'profileDetails',
  },
  GET_PROFILE_SUCCESS: {
    type: 'GET_PROFILE_SUCCESS',
    value: 'profileDetails',
  },
  GET_PROFILE_FAILURE: {
    type: 'GET_PROFILE_FAILURE',
    value: 'profileDetails',
  },

  
  UPDATE_PROFILE_REQUEST: {
    type: 'UPDATE_PROFILE_REQUEST',
    value: 'profileDetails',
  },
  UPDATE_PROFILE_SUCCESS: {
    type: 'UPDATE_PROFILE_SUCCESS',
    value: 'profileDetails',
  },
  UPDATE_PROFILE_FAILURE: {
    type: 'UPDATE_PROFILE_FAILURE',
    value: 'profileDetails',
  },


  UPDATE_SIGNATURE_REQUEST: {
    type: 'UPDATE_SIGNATURE_REQUEST',
    value: 'signature',
  },
  UPDATE_SIGNATURE_SUCCESS: {
    type: 'UPDATE_SIGNATURE_SUCCESS',
    value: 'signature',
  },
  UPDATE_SIGNATURE_FAILURE: {
    type: 'UPDATE_SIGNATURE_FAILURE',
    value: 'signature',
  },

  UPDATE_PROFILE_REQUEST: {
    type: 'UPDATE_PROFILE_REQUEST',
    value: 'profileDetails',
  },
  UPDATE_PROFILE_SUCCESS: {
    type: 'UPDATE_PROFILE_SUCCESS',
    value: 'profileDetails',
  },
  UPDATE_PROFILE_FAILURE: {
    type: 'UPDATE_PROFILE_FAILURE',
    value: 'profileDetails',
  },

  UPDATE_LANGUAGE_REQUEST: {
    type: 'UPDATE_LANGUAGE_REQUEST',
    value: 'profileLanguage',
  },
  UPDATE_LANGUAGE_SUCCESS: {
    type: 'UPDATE_LANGUAGE_SUCCESS',
    value: 'profileLanguage',
  },
  UPDATE_LANGUAGE_FAILURE: {
    type: 'UPDATE_LANGUAGE_FAILURE',
    value: 'profileLanguage',
  },
};



export const GENERAL = {
  GET_HELP_REQUEST: {
    type: 'GET_HELP_REQUEST',
    value: 'helpList',
  },
  GET_HELP_SUCCESS: {
    type: 'GET_HELP_SUCCESS',
    value: 'helpList',
  },
  GET_HELP_FAILURE: {
    type: 'GET_HELP_FAILURE',
    value: 'helpList',
  },


  GET_SECURITY_LIST_REQUEST: {
    type: 'GET_SECURITY_LIST_REQUEST',
    value: 'securityList',
  },
  GET_SECURITY_LIST_SUCCESS: {
    type: 'GET_SECURITY_LIST_SUCCESS',
    value: 'securityList',
  },
  GET_SECURITY_LIST_FAILURE: {
    type: 'GET_SECURITY_LIST_FAILURE',
    value: 'securityList',
  },


  GET_PRIVACY_POLICY_REQUEST: {
    type: 'GET_PRIVACY_POLICY_REQUEST',
    value: 'privacyPolicy',
  },
  GET_PRIVACY_POLICY_SUCCESS: {
    type: 'GET_PRIVACY_POLICY_SUCCESS',
    value: 'privacyPolicy',
  },
  GET_PRIVACY_POLICY_FAILURE: {
    type: 'GET_PRIVACY_POLICY_FAILURE',
    value: 'privacyPolicy',
  },

  GET_TERMS_CONDITIONS_REQUEST: {
    type: 'GET_TERMS_CONDITIONS_REQUEST',
    value: 'termsConditions',
  },
  GET_TERMS_CONDITIONS_SUCCESS: {
    type: 'GET_TERMS_CONDITIONS_SUCCESS',
    value: 'termsConditions',
  },
  GET_TERMS_CONDITIONS_FAILURE: {
    type: 'GET_TERMS_CONDITIONS_FAILURE',
    value: 'termsConditions',
  },


  MESSAGE_LIST_REQUEST: {
    type: 'MESSAGE_LIST_REQUEST',
    value: 'messageList',
  },
  MESSAGE_LIST_SUCCESS: {
    type: 'MESSAGE_LIST_SUCCESS',
    value: 'messageList',
  },
  MESSAGE_LIST_FAILURE: {
    type: 'MESSAGE_LIST_FAILURE',
    value: 'messageList',
  },


  SEND_MESSAGE_REQUEST: {
    type: 'SEND_MESSAGE_REQUEST',
    value: 'messageList',
  },
  SEND_MESSAGE_SUCCESS: {
    type: 'SEND_MESSAGE_SUCCESS',
    value: 'messageList',
  },
  SEND_MESSAGE_FAILURE: {
    type: 'SEND_MESSAGE_FAILURE',
    value: 'messageList',
  },

  GET_MESSAGE_REQUEST: {
    type: 'GET_MESSAGE_REQUEST',
    value: 'messageDetails',
  },
  GET_MESSAGE_SUCCESS: {
    type: 'GET_MESSAGE_SUCCESS',
    value: 'messageDetails',
  },
  GET_MESSAGE_FAILURE: {
    type: 'GET_MESSAGE_FAILURE',
    value: 'messageDetails',
  },

  GET_BROKER_MANDATE_LIST_REQUEST: {
    type: 'GET_BROKER_MANDATE_LIST_REQUEST',
    value: 'mandateList',
  },
  GET_BROKER_MANDATE_LIST_SUCCESS: {
    type: 'GET_BROKER_MANDATE_LIST_SUCCESS',
    value: 'mandateList',
  },
  GET_BROKER_MANDATE_LIST_FAILURE: {
    type: 'GET_BROKER_MANDATE_LIST_FAILURE',
    value: 'mandateList',
  },

  ADD_MEMBER_COMPANY_REQUEST: {
    type: 'ADD_MEMBER_COMPANY_REQUEST',
    value: 'addMemberCompany',
  },
  ADD_MEMBER_COMPANY_SUCCESS: {
    type: 'ADD_MEMBER_COMPANY_SUCCESS',
    value: 'addMemberCompany',
  },
  ADD_MEMBER_COMPANY_FAILURE: {
    type: 'ADD_MEMBER_COMPANY_FAILURE',
    value: 'addMemberCompany',
  },

  GET_MEMBER_COMPANY_LIST_REQUEST: {
    type: 'GET_MEMBER_COMPANY_LIST_REQUEST',
    value: 'memberCompanyList',
  },
  GET_MEMBER_COMPANY_LIST_SUCCESS: {
    type: 'GET_MEMBER_COMPANY_LIST_SUCCESS',
    value: 'memberCompanyList',
  },
  GET_MEMBER_COMPANY_LIST_FAILURE: {
    type: 'GET_MEMBER_COMPANY_LIST_FAILURE',
    value: 'memberCompanyList',
  },

  GET_MEMBER_COMPANY_REQUEST: {
    type: 'GET_MEMBER_COMPANY_REQUEST',
    value: 'memberCompany',
  },
  GET_MEMBER_COMPANY_SUCCESS: {
    type: 'GET_MEMBER_COMPANY_SUCCESS',
    value: 'memberCompany',
  },
  GET_MEMBER_COMPANY_FAILURE: {
    type: 'GET_MEMBER_COMPANY_FAILURE',
    value: 'memberCompany',
  },

  UPDATE_MEMBER_COMPANY_REQUEST: {
    type: 'UPDATE_MEMBER_COMPANY_REQUEST',
    value: 'memberCompanyUpdate',
  },
  UPDATE_MEMBER_COMPANY_SUCCESS: {
    type: 'UPDATE_MEMBER_COMPANY_SUCCESS',
    value: 'memberCompanyUpdate',
  },
  UPDATE_MEMBER_COMPANY_FAILURE: {
    type: 'UPDATE_MEMBER_COMPANY_FAILURE',
    value: 'memberCompanyUpdate',
  },

  GET_REF_CODE_REQUEST: {
    type: 'GET_REF_CODE_REQUEST',
    value: 'refResponse',
  },
  GET_REF_CODE_SUCCESS: {
    type: 'GET_REF_CODE_SUCCESS',
    value: 'refResponse',
  },
  GET_REF_CODE_FAILURE: {
    type: 'GET_REF_CODE_FAILURE',
    value: 'refResponse',
  },

  SET_NOTIFICATION_REQUEST: {
    type: 'SET_NOTIFICATION_REQUEST',
    value: 'notifications',
  },
  SET_NOTIFICATION_SUCCESS: {
    type: 'SET_NOTIFICATION_SUCCESS',
    value: 'notifications',
  },
  SET_NOTIFICATION_FAILURE: {
    type: 'SET_NOTIFICATION_FAILURE',
    value: 'notifications',
  },

  GET_REF_FRIENDS_REQUEST: {
    type: 'GET_REF_FRIENDS_REQUEST',
    value: 'refFriends',
  },
  GET_REF_FRIENDS_SUCCESS: {
    type: 'GET_REF_FRIENDS_SUCCESS',
    value: 'refFriends',
  },
  GET_REF_FRIENDS_FAILURE: {
    type: 'GET_REF_FRIENDS_FAILURE',
    value: 'refFriends',
  },

  SET_USER_FORM_REQUEST: {
    type: 'SET_USER_FORM_REQUEST',
    value: 'tempUserData',
  },
  SET_USER_FORM_SUCCESS: {
    type: 'SET_USER_FORM_SUCCESS',
    value: 'tempUserData',
  },
  SET_USER_FORM_FAILURE: {
    type: 'SET_USER_FORM_FAILURE',
    value: 'tempUserData',
  },
};


export const ADVISORS = {
  GET_ADVISORS_LIST_REQUEST: {
    type: 'GET_ADVISORS_LIST_REQUEST',
    value: 'advisorsList',
  },
  GET_ADVISORS_LIST_SUCCESS: {
    type: 'GET_ADVISORS_LIST_SUCCESS',
    value: 'advisorsList',
  },
  GET_ADVISORS_LIST_FAILURE: {
    type: 'GET_ADVISORS_LIST_FAILURE',
    value: 'advisorsList',
  },


  SET_ADVISOR_REQUEST: {
    type: 'SET_ADVISOR_REQUEST',
    value: 'advisorData',
  },
  SET_ADVISOR_SUCCESS: {
    type: 'SET_ADVISOR_SUCCESS',
    value: 'advisorData',
  },
  SET_ADVISOR_FAILURE: {
    type: 'SET_ADVISOR_FAILURE',
    value: 'advisorData',
  },


  RATE_ADVISOR_REQUEST: {
    type: 'RATE_ADVISOR_REQUEST',
    value: 'rateAdvisor',
  },
  RATE_ADVISOR_SUCCESS: {
    type: 'RATE_ADVISOR_SUCCESS',
    value: 'rateAdvisor',
  },
  RATE_ADVISOR_FAILURE: {
    type: 'RATE_ADVISOR_FAILURE',
    value: 'rateAdvisor',
  },

  GET_ADVISOR_REVIEWS_REQUEST: {
    type: 'GET_ADVISOR_REVIEWS_REQUEST',
    value: 'ReviewList',
  },
  GET_ADVISOR_REVIEWS_SUCCESS: {
    type: 'GET_ADVISOR_REVIEWS_SUCCESS',
    value: 'ReviewList',
  },
  GET_ADVISOR_REVIEWS_FAILURE: {
    type: 'GET_ADVISOR_REVIEWS_FAILURE',
    value: 'ReviewList',
  },
};