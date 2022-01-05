import {combineReducers} from 'redux';
import TokenReducer from './TokenReducer';
import AuthReducer from './AuthReducer';
import PolicyReducer from './PolicyReducer';
import ProfileReducer from './ProfileReducer';
import GeneralReducer from './GeneralReducer';
import AdvisorsReducer from './AdvisorsReducer';

const allReducers = combineReducers({
  TokenReducer: TokenReducer,
  AuthReducer: AuthReducer,
  PolicyReducer: PolicyReducer,
  ProfileReducer: ProfileReducer,
  GeneralReducer: GeneralReducer,
  AdvisorsReducer: AdvisorsReducer,
});

export default rootReducer = (state, action) => {
  return allReducers(state, action);
};
