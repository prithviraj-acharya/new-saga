import {all} from 'redux-saga/effects';

import TOKEN_SAGA from './TokenSaga';
import AUTH_SAGA from './AuthSaga';
import POLICY_SAGA from './PolicySaga';
import PROFILE_SAGA from './ProfileSaga';
import GENERAL_SAGA from './GeneralSaga';
import ADVISORS_SAGA from './AdvisorsSaga';

function* RootSaga() {
  yield all([
    ...TOKEN_SAGA.source,
    ...AUTH_SAGA.source,
    ...POLICY_SAGA.source,
    ...PROFILE_SAGA.source,
    ...GENERAL_SAGA.source,
    ...ADVISORS_SAGA.source,
  ]);
}

export default RootSaga;
