import {GENERAL} from '../store/TypeConstants';

const initialState = {
  status: '',
  error: '',
  loading: false,
};

const GeneralReducer = (state = initialState, action) => {
  if (GENERAL[action.type]) {
    if (action.type.toString().endsWith('_REQUEST')) {
      return {
        ...state,
        loading: true,
        status: GENERAL[action.type].type,
      };
    }
    return {
      ...state,
      loading: false,
      ...action.data,
      status: GENERAL[action.type].type,
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

export default GeneralReducer;
