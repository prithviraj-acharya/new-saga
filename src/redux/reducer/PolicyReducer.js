import {POLICY} from '../store/TypeConstants';

const initialState = {
  status: '',
  error: '',
  loading: false,
};

const PolicyReducer = (state = initialState, action) => {
  if (POLICY[action.type]) {
    if (action.type.toString().endsWith('_REQUEST')) {
      return {
        ...state,
        loading: true,
        status: POLICY[action.type].type,
      };
    }
    return {
      ...state,
      loading: false,
      ...action.data,
      status: POLICY[action.type].type,
    };
  } else if (action.type == 'RESET') {
    return {
      status: '',
      error: '',
      loading: false,
    };
  } else {
    return {
      ...state,
    };
  }
};

export default PolicyReducer;
