import {ADVISORS} from '../store/TypeConstants';

const initialState = {
  status: '',
  error: '',
  loading: false,
};

const AdvisorsReducer = (state = initialState, action) => {
  if (ADVISORS[action.type]) {
    if (action.type.toString().endsWith('_REQUEST')) {
      return {
        ...state,
        loading: true,
        status: ADVISORS[action.type].type,
      };
    }
    return {
      ...state,
      loading: false,
      ...action.data,
      status: ADVISORS[action.type].type,
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

export default AdvisorsReducer;
