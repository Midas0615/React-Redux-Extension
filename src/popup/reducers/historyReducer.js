import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.history, action) {
  switch (action.type) {
    case types.HISTORY_FETCH_SUCCESS:
      return [...action.history];

    default:
      return state;
  }
}
