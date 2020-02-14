import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.page, action) {
  switch (action.type) {
    case types.PAGE_FETCH_SUCCESS:
      return [...action.page];

    default:
      return state;
  }
}
