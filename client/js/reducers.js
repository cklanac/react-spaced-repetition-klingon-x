import * as actions from './actions';

const initialState = {
  questions: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  if (action.type === actions.FETCH_QUESTIONS_REQUEST) {
    return Object.assign({}, state, {
      loading: true
    });
  } else if (action.type === actions.FETCH_QUESTIONS_SUCCESS) {
    return Object.assign({}, state, {
      questions: action.questions,
      loading: false,
      error: null
    });
  } else if (action.type === actions.FETCH_QUESTIONS_ERROR) {
    return Object.assign({}, state, {
      error: action.error,
      loading: false
    });
  }
  return state;
};
