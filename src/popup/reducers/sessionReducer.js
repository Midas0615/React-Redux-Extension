import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.session, action) {
  switch (action.type) {
    case types.SESSION_RESTORE_SUCCESS:
    case types.SESSION_LOGIN_SUCCESS:
      return action.session;

    case types.SESSION_LOGOUT_SUCCESS:
      return initialState.session;

    default:
      return state;
  }
}
