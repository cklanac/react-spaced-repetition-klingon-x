import 'isomorphic-fetch';
import cookie from 'react-cookie';

export const fetchQuestions = () => dispatch => {
  dispatch(fetchQuestionsRequest());
  return fetch('/api/questions', {
    headers: {
      'Authorization': `Bearer ${cookie.load('accessToken')}`
    }
  }).then(res => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json()
  }).then(data => dispatch(fetchQuestionsSuccess(data)))
    .catch(err => dispatch(fetchQuestionsError(err)));
};

export const FETCH_QUESTIONS_REQUEST = 'FETCH_QUESTIONS_REQUEST';
export const fetchQuestionsRequest = () => ({
  type: FETCH_QUESTIONS_REQUEST
});

export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
export const fetchQuestionsSuccess = questions => ({
  type: FETCH_QUESTIONS_SUCCESS,
  questions
});

export const FETCH_QUESTIONS_ERROR = 'FETCH_QUESTIONS_ERROR';
export const fetchQuestionsError = error => ({
  type: FETCH_QUESTIONS_ERROR,
  error
});
