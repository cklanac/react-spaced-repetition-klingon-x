import 'isomorphic-fetch';
import cookie from 'react-cookie';

export const FETCH_QUESTIONS_REQUEST = 'FETCH_QUESTIONS_REQUEST';
export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
export const FETCH_QUESTIONS_ERROR = 'FETCH_QUESTIONS_ERROR';

export function fetchQuestions() {
  return (dispatch) => {
    dispatch(fetchQuestionsRequest());
    return fetch('/api/questions', {
      headers: {
        Authorization: `Bearer ${cookie.load('accessToken')}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(data => dispatch(fetchQuestionsSuccess(data)))
      .catch(err => dispatch(fetchQuestionsError(err)));
  };
}

export function fetchQuestionsRequest() {
  return { type: FETCH_QUESTIONS_REQUEST };
}

export function fetchQuestionsSuccess(questions) {
  return { type: FETCH_QUESTIONS_SUCCESS, questions };
}

export function fetchQuestionsError(error) {
  return { type: FETCH_QUESTIONS_ERROR, error };
}
