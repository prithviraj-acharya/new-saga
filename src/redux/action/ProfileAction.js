import {PROFILE} from '../store/TypeConstants';

export const getProfile = () => ({
  type: PROFILE.GET_PROFILE_REQUEST.type
});
export const updateSignature = payload => ({
  type: PROFILE.UPDATE_SIGNATURE_REQUEST.type,
  payload,
});
export const updateProfile = (payload,byAPI=false) => ({
  type: PROFILE.UPDATE_PROFILE_REQUEST.type,
  payload,
  byAPI
});
export const updateLanguage = payload => ({
  type: PROFILE.UPDATE_LANGUAGE_REQUEST.type,
  payload,
});