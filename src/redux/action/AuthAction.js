import {AUTH} from '../store/TypeConstants';

export const getSignin = payload => ({
  type: AUTH.LOGIN_REQUEST.type,
  payload,
});

export const logout = () => ({
  type: AUTH.LOGOUT_REQUEST.type
});

export const signup = (payload) => ({
  type: AUTH.SIGNUP_REQUEST.type,
  payload
});

export const signupOTPSend = (payload) => ({
  type: AUTH.SIGNUP_OTP_SEND_REQUEST.type,
  payload
});

export const signupOTPVerify = (payload) => ({
  type: AUTH.SIGNUP_OTP_VERIFY_REQUEST.type,
  payload
});

export const passwordSetup = (payload) => ({
  type: AUTH.PASSWORD_SETUP_REQUEST.type,
  payload
});

export const switchAccount = (payload) => ({
  type: AUTH.SWITCH_ACCOUNT_REQUEST.type,
  payload
});

export const forgotPassword = (payload) => ({
  type: AUTH.FORGOT_PASSWORD_REQUEST.type,
  payload
});

export const deleteAccount = (payload) => ({
  type: AUTH.DELETE_ACCOUNT_REQUEST.type,
  payload
});